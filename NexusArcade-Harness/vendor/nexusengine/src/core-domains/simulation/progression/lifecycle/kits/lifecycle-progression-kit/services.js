import { advanceLifecycleProgression, normalizeLifecycleItem, prerequisitesMet } from "./contracts.js";

export function createLifecycleProgressionServices(baseApi) {
  return {
    start(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const itemId = String(request.itemId ?? request.id ?? "");
        const item = state.items.find((entry) => entry.id === itemId);
        if (!item) throw new TypeError(`Unknown lifecycle item ${itemId}.`);
        if (item.status === "active" || item.status === "complete") throw new TypeError(`Lifecycle item ${itemId} is already ${item.status}.`);
        if (!prerequisitesMet(item, state)) throw new TypeError(`Lifecycle prerequisites are not complete for ${itemId}.`);
        const changed = { ...item, status: item.durationSeconds === 0 ? "complete" : "active", elapsedSeconds: 0 };
        const completed = changed.status === "complete" ? [...new Set([...state.completed, changed.id])].sort() : state.completed;
        const result = { item: changed, cost: item.cost, effects: changed.status === "complete" ? item.effects : null };
        return { patch: { items: state.items.map((entry) => entry.id === itemId ? changed : entry), completed, lastCompleted: changed.status === "complete" ? changed : state.lastCompleted }, result, events: [{ name: "started", payload: result }, ...(changed.status === "complete" ? [{ name: "completed", payload: result }] : [])] };
      });
    },
    add(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const item = normalizeLifecycleItem(request.item, state.items.length);
        if (state.items.some((entry) => entry.id === item.id)) throw new TypeError(`Lifecycle item ${item.id} already exists.`);
        const ids = new Set(state.items.map((entry) => entry.id));
        for (const prerequisite of item.prerequisites) if (!ids.has(prerequisite)) throw new TypeError(`Lifecycle item ${item.id} has unknown prerequisite ${prerequisite}.`);
        return { patch: { items: [...state.items, item] }, result: { item } };
      });
    },
    advance(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const advanced = advanceLifecycleProgression(state, request);
        return { patch: { items: advanced.items, completed: advanced.completed, lastCompleted: advanced.newlyCompleted.at(-1) ?? state.lastCompleted }, result: { completed: advanced.newlyCompleted, effects: advanced.newlyCompleted.map((item) => ({ itemId: item.id, effects: item.effects })) }, events: advanced.newlyCompleted.map((item) => ({ name: "completed", payload: { item, effects: item.effects } })) };
      });
    }
  };
}
