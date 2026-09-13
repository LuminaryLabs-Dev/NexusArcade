import { countAssistanceTargets, queryNearestAssistanceTarget } from "./contracts.js";

function transition(baseApi, command, kind) {
  return baseApi.applyCommand(command, (state, request) => {
    const targetId = String(request.targetId ?? "");
    const target = state.targets.find((entry) => entry.id === targetId);
    if (!target) throw new TypeError(`Unknown assistance target ${targetId}.`);
    if (target.completed || target.lost) throw new TypeError(`Assistance target ${targetId} is terminal (${target.status}).`);
    let changed;
    if (kind === "stabilized") {
      const amount = Number(request.amount ?? target.stabilizeAmount);
      if (!Number.isFinite(amount) || amount < 0) throw new TypeError("Stabilize amount must be finite and nonnegative.");
      const urgency = Math.min(100, target.urgency + amount);
      changed = { ...target, urgency, status: urgency >= 100 ? "stable" : "distressed" };
    } else if (kind === "attached") {
      const carrierId = String(request.carrierId ?? "").trim();
      if (!carrierId) throw new TypeError("Assistance attachment requires carrierId.");
      changed = { ...target, status: "attached", attachedTo: carrierId };
    } else {
      changed = { ...target, status: "completed", completed: true, attachedTo: null };
    }
    const next = countAssistanceTargets({ ...state, targets: state.targets.map((entry) => entry.id === targetId ? changed : entry), lastEvent: { type: kind, target: changed } });
    return { patch: next, result: { target: changed }, events: [{ name: kind, payload: { target: changed } }] };
  });
}

export function createAssistanceTargetServices(baseApi) {
  return {
    nearest: (point) => queryNearestAssistanceTarget(baseApi.getState(), point),
    stabilize: (command) => transition(baseApi, command, "stabilized"),
    attach: (command) => transition(baseApi, command, "attached"),
    complete: (command) => transition(baseApi, command, "completed"),
    advance(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const delta = Number(request.delta ?? 0);
        if (!Number.isFinite(delta) || delta < 0) throw new TypeError("Assistance delta must be finite and nonnegative.");
        const lost = [];
        const targets = state.targets.map((target) => {
          if (target.completed || target.lost) return target;
          const urgency = Math.max(0, target.urgency - target.decayPerSecond * delta);
          if (urgency > 0) return { ...target, urgency };
          lost.push(target.id);
          return { ...target, urgency: 0, status: "lost", lost: true, attachedTo: null };
        });
        const next = countAssistanceTargets({ ...state, elapsedSeconds: state.elapsedSeconds + delta, targets, lastEvent: lost.length ? { type: "lost", targetIds: lost } : state.lastEvent });
        return { patch: next, result: { lost } };
      });
    }
  };
}
