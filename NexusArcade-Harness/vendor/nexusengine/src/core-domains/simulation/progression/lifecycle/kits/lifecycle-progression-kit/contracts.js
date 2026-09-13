import { cloneSerializableState } from "../../../../../../foundation/serializable-state.js";

function finite(value, label, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  const next = Number(value);
  if (!Number.isFinite(next)) throw new TypeError(`${label} must be finite.`);
  return next;
}

export function normalizeLifecycleItem(item = {}, index = 0) {
  const id = String(item.id ?? `item-${index + 1}`);
  const durationSeconds = finite(item.durationSeconds ?? item.duration, `${id}.durationSeconds`, 0);
  if (durationSeconds < 0) throw new RangeError(`Lifecycle item ${id} duration cannot be negative.`);
  let cost = null;
  if (item.cost != null) {
    const amount = finite(item.cost.amount, `${id}.cost.amount`, 0);
    if (amount < 0) throw new RangeError(`Lifecycle item ${id} cost cannot be negative.`);
    cost = { account: String(item.cost.account ?? "cash"), amount, metadata: cloneSerializableState(item.cost.metadata ?? {}) };
  }
  return { id, kind: String(item.kind ?? "generic"), status: String(item.status ?? "planned"), durationSeconds, elapsedSeconds: Math.max(0, finite(item.elapsedSeconds, `${id}.elapsedSeconds`, 0)), cost, prerequisites: [...new Set((item.prerequisites ?? []).map(String))].sort(), effects: cloneSerializableState(item.effects ?? {}), metadata: cloneSerializableState(item.metadata ?? {}) };
}

export function normalizeLifecycleProgressionConfig(config = {}) {
  const source = config.lifecycleDataset ?? config;
  const items = (source.items ?? []).map(normalizeLifecycleItem);
  if (new Set(items.map((item) => item.id)).size !== items.length) throw new TypeError("Lifecycle items contain duplicate IDs.");
  const ids = new Set(items.map((item) => item.id));
  for (const item of items) for (const prerequisite of item.prerequisites) if (!ids.has(prerequisite) || prerequisite === item.id) throw new TypeError(`Lifecycle item ${item.id} has invalid prerequisite ${prerequisite}.`);
  return { id: String(source.id ?? "lifecycle-progression"), items };
}

export function createLifecycleProgressionState(config = {}) {
  const normalized = normalizeLifecycleProgressionConfig(config);
  const completed = normalized.items.filter((item) => item.status === "complete").map((item) => item.id).sort();
  return { progressionId: normalized.id, items: normalized.items, completed, lastCompleted: normalized.items.filter((item) => item.status === "complete").at(-1) ?? null };
}

export function prerequisitesMet(item, state) {
  const completed = new Set(state.completed);
  return item.prerequisites.every((id) => completed.has(id));
}

export function advanceLifecycleProgression(state = {}, command = {}) {
  const delta = finite(command.delta, "delta", 0);
  if (delta < 0) throw new RangeError("Lifecycle delta cannot be negative.");
  const newlyCompleted = [];
  const items = state.items.map((source) => {
    if (source.status !== "active") return source;
    const elapsedSeconds = Math.min(source.durationSeconds, source.elapsedSeconds + delta);
    if (elapsedSeconds < source.durationSeconds) return { ...source, elapsedSeconds };
    const completed = { ...source, elapsedSeconds, status: "complete" };
    newlyCompleted.push(completed);
    return completed;
  });
  return { items, newlyCompleted, completed: [...new Set([...state.completed, ...newlyCompleted.map((item) => item.id)])].sort() };
}
