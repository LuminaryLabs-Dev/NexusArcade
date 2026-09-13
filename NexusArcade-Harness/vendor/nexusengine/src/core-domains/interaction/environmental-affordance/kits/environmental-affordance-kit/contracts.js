import { cloneSerializableState } from "../../../../../foundation/serializable-state.js";

function finite(value, label, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  const next = Number(value);
  if (!Number.isFinite(next)) throw new TypeError(`${label} must be finite.`);
  return next;
}

function normalizeAffordance(value = {}, index = 0) {
  const id = String(value.id ?? `affordance-${index + 1}`);
  const target = finite(value.target, `${id}.target`, 1);
  if (target <= 0) throw new RangeError(`Affordance ${id} target must be positive.`);
  const progress = Math.max(0, Math.min(target, finite(value.progress, `${id}.progress`, 0)));
  const completed = value.completed === true || progress >= target;
  return { id, kind: String(value.kind ?? "affordance"), action: String(value.action ?? "activate"), x: finite(value.x, `${id}.x`, 0), y: finite(value.y, `${id}.y`, 0), radius: Math.max(0, finite(value.radius, `${id}.radius`, 24)), progress: completed ? target : progress, target, active: value.active !== false, completed, metadata: cloneSerializableState(value.metadata ?? {}) };
}

export function normalizeEnvironmentalAffordanceConfig(config = {}) {
  const source = config.environmentalAffordanceDataset ?? config;
  const affordances = (source.affordances ?? []).map(normalizeAffordance);
  if (new Set(affordances.map((entry) => entry.id)).size !== affordances.length) throw new TypeError("Environmental affordances contain duplicate IDs.");
  return { id: String(source.id ?? "environmental-affordance"), affordances };
}

export function createEnvironmentalAffordanceState(config = {}) {
  const normalized = normalizeEnvironmentalAffordanceConfig(config);
  return { affordancesId: normalized.id, affordances: normalized.affordances, completedCount: normalized.affordances.filter((entry) => entry.completed).length, lastEvent: null };
}

export function queryNearbyAffordances(state = {}, point = {}, radius = Number.MAX_SAFE_INTEGER) {
  const x = finite(point.x, "point.x", 0);
  const y = finite(point.y, "point.y", 0);
  const limit = finite(radius, "radius", Number.MAX_SAFE_INTEGER);
  if (limit < 0) throw new RangeError("Affordance query radius cannot be negative.");
  return state.affordances.filter((entry) => entry.active && !entry.completed)
    .map((affordance) => ({ affordance, distance: Math.hypot(affordance.x - x, affordance.y - y) }))
    .filter((entry) => entry.distance <= Math.min(limit, entry.affordance.radius))
    .sort((left, right) => left.distance - right.distance || left.affordance.id.localeCompare(right.affordance.id))
    .map(cloneSerializableState);
}
