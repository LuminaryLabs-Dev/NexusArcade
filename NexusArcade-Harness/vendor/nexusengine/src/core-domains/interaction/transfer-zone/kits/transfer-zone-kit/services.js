import { queryTransferZones, validateTransferCandidate } from "./contracts.js";

function occupancy(state, zoneId) {
  return Object.values(state.active).filter((entry) => entry.zoneId === zoneId).length;
}

export function createTransferZoneServices(baseApi) {
  return {
    zonesAt: (point) => queryTransferZones(baseApi.getState(), point),
    begin(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const { zone, subjectId, subjectType } = validateTransferCandidate(state, request);
        if (state.active[subjectId]) throw new TypeError(`Transfer subject ${subjectId} is already active.`);
        if (occupancy(state, zone.id) >= zone.capacity) throw new RangeError(`Transfer zone ${zone.id} is at capacity.`);
        const record = { zoneId: zone.id, subjectId, subjectType, dwellSeconds: 0, point: structuredClone(request.point), metadata: structuredClone(request.metadata ?? {}) };
        return { patch: { active: { ...state.active, [subjectId]: record } }, result: { active: record } };
      });
    },
    advance(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const delta = Number(request.delta ?? 0);
        if (!Number.isFinite(delta) || delta < 0) throw new TypeError("Transfer delta must be finite and nonnegative.");
        const positions = request.positions ?? {};
        const active = {};
        const completions = [];
        for (const [subjectId, record] of Object.entries(state.active)) {
          const zone = state.zones.find((entry) => entry.id === record.zoneId);
          const point = positions[subjectId] ?? record.point;
          if (!zone || !queryTransferZones({ zones: [zone] }, point).length) continue;
          const next = { ...record, point: structuredClone(point), dwellSeconds: record.dwellSeconds + delta };
          if (next.dwellSeconds >= zone.dwellSeconds) completions.push({ schema: "nexusengine.transfer-completion/1", zoneId: zone.id, subjectId, subjectType: record.subjectType, dwellSeconds: next.dwellSeconds, metadata: record.metadata });
          else active[subjectId] = next;
        }
        return { patch: { active, completed: [...state.completed, ...completions], completedCount: state.completedCount + completions.length, lastCompletion: completions.at(-1) ?? state.lastCompletion }, result: { completions }, events: completions.map((completion) => ({ name: "completed", payload: { completion } })) };
      });
    },
    transfer(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const { zone, subjectId, subjectType } = validateTransferCandidate(state, request);
        if (occupancy(state, zone.id) >= zone.capacity) throw new RangeError(`Transfer zone ${zone.id} is at capacity.`);
        const dwellSeconds = Number(request.dwellSeconds ?? 0);
        if (!Number.isFinite(dwellSeconds) || dwellSeconds < zone.dwellSeconds) throw new RangeError(`Transfer zone ${zone.id} requires ${zone.dwellSeconds} seconds of dwell.`);
        const completion = { schema: "nexusengine.transfer-completion/1", zoneId: zone.id, subjectId, subjectType, dwellSeconds, metadata: structuredClone(request.metadata ?? {}) };
        return { patch: { completed: [...state.completed, completion], completedCount: state.completedCount + 1, lastCompletion: completion }, result: { completion }, events: [{ name: "completed", payload: { completion } }] };
      });
    }
  };
}
