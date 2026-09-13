import { cloneSerializableState } from "../../../../../foundation/serializable-state.js";

function finite(value, label, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  const next = Number(value);
  if (!Number.isFinite(next)) throw new TypeError(`${label} must be finite.`);
  return next;
}

export function normalizeAssistanceTarget(target = {}, index = 0) {
  const id = String(target.id ?? `target-${index + 1}`);
  const urgency = Math.max(0, finite(target.urgency, `${id}.urgency`, 100));
  const completed = target.completed === true || target.status === "completed";
  const lost = !completed && (target.lost === true || target.status === "lost");
  return { id, kind: String(target.kind ?? "assistance-target"), x: finite(target.x, `${id}.x`, 0), y: finite(target.y, `${id}.y`, 0), radius: Math.max(0, finite(target.radius, `${id}.radius`, 14)), urgency, decayPerSecond: Math.max(0, finite(target.decayPerSecond, `${id}.decayPerSecond`, 0.8)), stabilizeAmount: Math.max(0, finite(target.stabilizeAmount, `${id}.stabilizeAmount`, 25)), attachDistance: Math.max(0, finite(target.attachDistance, `${id}.attachDistance`, 28)), status: completed ? "completed" : lost ? "lost" : String(target.status ?? "distressed"), attachedTo: target.attachedTo == null ? null : String(target.attachedTo), completed, lost, metadata: cloneSerializableState(target.metadata ?? {}) };
}

export function normalizeAssistanceTargetConfig(config = {}) {
  const source = config.assistanceTargetDataset ?? config;
  const targets = (source.targets ?? []).map(normalizeAssistanceTarget);
  if (new Set(targets.map((target) => target.id)).size !== targets.length) throw new TypeError("Assistance targets contain duplicate IDs.");
  return { id: String(source.id ?? "assistance-targets"), targets };
}

export function countAssistanceTargets(state) {
  return { ...state, completedCount: state.targets.filter((target) => target.completed).length, lostCount: state.targets.filter((target) => target.lost).length };
}

export function createAssistanceTargetState(config = {}) {
  const normalized = normalizeAssistanceTargetConfig(config);
  return countAssistanceTargets({ targetsId: normalized.id, elapsedSeconds: 0, targets: normalized.targets, lastEvent: null });
}

export function queryNearestAssistanceTarget(state = {}, point = {}) {
  const x = finite(point.x, "point.x", 0);
  const y = finite(point.y, "point.y", 0);
  const found = state.targets.filter((target) => !target.completed && !target.lost)
    .map((target) => ({ target, distance: Math.hypot(target.x - x, target.y - y) }))
    .sort((left, right) => left.distance - right.distance || right.target.urgency - left.target.urgency || left.target.id.localeCompare(right.target.id))[0] ?? null;
  return found ? cloneSerializableState(found) : null;
}
