import { queryNearbyAffordances } from "./contracts.js";

export function createEnvironmentalAffordanceServices(baseApi) {
  return {
    nearby: (point, radius) => queryNearbyAffordances(baseApi.getState(), point, radius),
    activate(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const affordanceId = String(request.affordanceId ?? "");
        const affordance = state.affordances.find((entry) => entry.id === affordanceId);
        if (!affordance) throw new TypeError(`Unknown environmental affordance ${affordanceId}.`);
        if (!affordance.active) throw new TypeError(`Environmental affordance ${affordanceId} is inactive.`);
        if (affordance.completed) throw new TypeError(`Environmental affordance ${affordanceId} is already completed.`);
        const amount = Number(request.amount ?? 1);
        if (!Number.isFinite(amount) || amount < 0) throw new TypeError("Affordance activation amount must be finite and nonnegative.");
        const progress = Math.min(affordance.target, affordance.progress + amount);
        const changed = { ...affordance, progress, completed: progress >= affordance.target };
        const completedCount = state.completedCount + (changed.completed ? 1 : 0);
        return { patch: { affordances: state.affordances.map((entry) => entry.id === affordanceId ? changed : entry), completedCount, lastEvent: { type: changed.completed ? "completed" : "activated", affordance: changed } }, result: { affordance: changed }, events: [{ name: "activated", payload: { affordance: changed } }, ...(changed.completed ? [{ name: "completed", payload: { affordance: changed } }] : [])] };
      });
    }
  };
}
