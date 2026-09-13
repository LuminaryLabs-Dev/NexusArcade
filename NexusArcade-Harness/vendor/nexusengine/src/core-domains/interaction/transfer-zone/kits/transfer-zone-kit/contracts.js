import { cloneSerializableState } from "../../../../../foundation/serializable-state.js";

function finite(value, label, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  const next = Number(value);
  if (!Number.isFinite(next)) throw new TypeError(`${label} must be finite.`);
  return next;
}

function normalizeZone(zone = {}, index = 0) {
  const id = String(zone.id ?? `transfer-zone-${index + 1}`);
  const capacity = Math.floor(finite(zone.capacity, `${id}.capacity`, 1));
  if (capacity < 1) throw new RangeError(`Transfer zone ${id} capacity must be positive.`);
  return { id, x: finite(zone.x, `${id}.x`, 0), y: finite(zone.y, `${id}.y`, 0), radius: Math.max(0, finite(zone.radius, `${id}.radius`, 32)), accepts: [...new Set((zone.accepts ?? ["target"]).map(String))].sort(), dwellSeconds: Math.max(0, finite(zone.dwellSeconds, `${id}.dwellSeconds`, 0)), capacity, metadata: cloneSerializableState(zone.metadata ?? {}) };
}

export function normalizeTransferZoneConfig(config = {}) {
  const source = config.transferZoneDataset ?? config;
  const zones = (source.zones ?? []).map(normalizeZone);
  if (new Set(zones.map((zone) => zone.id)).size !== zones.length) throw new TypeError("Transfer zones contain duplicate IDs.");
  return { id: String(source.id ?? "transfer-zones"), zones };
}

export function createTransferZoneState(config = {}) {
  const normalized = normalizeTransferZoneConfig(config);
  return { zonesId: normalized.id, zones: normalized.zones, active: {}, completed: [], completedCount: 0, lastCompletion: null };
}

export function pointInTransferZone(zone, point = {}) {
  const x = finite(point.x, "point.x", 0);
  const y = finite(point.y, "point.y", 0);
  return Math.hypot(zone.x - x, zone.y - y) <= zone.radius;
}

export function queryTransferZones(state = {}, point = {}) {
  return state.zones.filter((zone) => pointInTransferZone(zone, point)).sort((left, right) => left.id.localeCompare(right.id)).map(cloneSerializableState);
}

export function validateTransferCandidate(state, command) {
  const zoneId = String(command.zoneId ?? "");
  const zone = state.zones.find((entry) => entry.id === zoneId);
  if (!zone) throw new TypeError(`Unknown transfer zone ${zoneId}.`);
  const subjectId = String(command.subjectId ?? "").trim();
  const subjectType = String(command.subjectType ?? command.type ?? "").trim();
  if (!subjectId || !subjectType) throw new TypeError("Transfer requires subjectId and subjectType.");
  if (!zone.accepts.includes(subjectType)) throw new TypeError(`Transfer zone ${zoneId} does not accept ${subjectType}.`);
  if (!pointInTransferZone(zone, command.point)) throw new RangeError(`Transfer subject ${subjectId} is outside zone ${zoneId}.`);
  return { zone, subjectId, subjectType };
}
