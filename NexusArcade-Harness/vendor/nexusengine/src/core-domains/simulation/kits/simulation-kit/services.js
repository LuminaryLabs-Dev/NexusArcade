const clone = (value) => value === undefined ? undefined : structuredClone(value);
const asList = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function number(value, fallback = 0) { const result = Number(value); return Number.isFinite(result) ? result : fallback; }
function stableId(value, fallback, label) { const id = String(value ?? fallback ?? "").trim(); if (!id) throw new TypeError(`${label} requires a stable id.`); return id; }
function normalizeThreshold(input = {}, index = 0) { return { id: stableId(input.id, `threshold-${index + 1}`, "Threshold"), value: number(input.value, 0), direction: input.direction === "above" ? "above" : "below", repeatable: input.repeatable !== false && input.once !== true, metadata: clone(input.metadata ?? {}) }; }
function thresholdMatches(value, threshold) { return threshold.direction === "above" ? value >= threshold.value : value <= threshold.value; }

function normalizeMeter(input = {}, index = 0) {
  const min = number(input.min, 0);
  const max = Math.max(min, number(input.max, Math.max(100, min)));
  const initial = clamp(number(input.initial ?? input.value, max), min, max);
  const explicitRate = input.ratePerSecond ?? input.rate;
  const ratePerSecond = explicitRate == null ? Math.max(0, number(input.recoverPerSecond ?? input.recover, 0)) - Math.max(0, number(input.drainPerSecond ?? input.drain, 0)) : number(explicitRate, 0);
  const thresholds = asList(input.thresholds).map(normalizeThreshold);
  const meter = {
    id: stableId(input.id ?? input.name, `resource-${index + 1}`, "Resource meter"),
    label: String(input.label ?? input.id ?? input.name ?? `Resource ${index + 1}`),
    index,
    initial,
    min,
    max,
    value: initial,
    ratePerSecond,
    locked: Boolean(input.locked),
    thresholds,
    thresholdStates: {},
    thresholdCrossCounts: Object.fromEntries(thresholds.map((threshold) => [threshold.id, 0])),
    tags: [...new Set(asList(input.tags).map(String).filter(Boolean))],
    metadata: clone(input.metadata ?? {}),
    lastChangeReason: null
  };
  meter.thresholdStates = Object.fromEntries(thresholds.map((threshold) => [threshold.id, thresholdMatches(meter.value, threshold)]));
  return meter;
}

function meterDescriptor(meter) {
  const span = meter.max - meter.min;
  const empty = meter.value <= meter.min;
  const full = meter.value >= meter.max;
  return { id: meter.id, kind: "resource-meter", label: meter.label, value: meter.value, min: meter.min, max: meter.max, normalized: span <= 0 ? 0 : (meter.value - meter.min) / span, ratePerSecond: meter.ratePerSecond, locked: meter.locked, empty, full, status: meter.locked ? "locked" : empty ? "empty" : full ? "full" : "active", tags: [...meter.tags], metadata: clone(meter.metadata) };
}

export function createResourceService(config = {}) {
  const recentChangeLimit = Math.max(1, Math.floor(number(config.recentChangeLimit, 64)));
  const initialResources = asList(config.resources ?? config.meters);
  let meters = new Map(); let elapsedSeconds = 0; let recentChanges = []; let lastChange = null;
  function emit(type, payload) { config.onEvent?.(type, clone(payload)); }
  function record(change) { lastChange = clone(change); recentChanges = [...recentChanges, lastChange].slice(-recentChangeLimit); emit(change.type ?? "changed", change); return change; }
  function setMeter(next, reason = "set") {
    const previous = meters.get(next.id); const before = previous?.value ?? next.value; const after = next.value; const thresholdEvents = [];
    for (const threshold of next.thresholds) {
      const prior = Boolean(previous?.thresholdStates?.[threshold.id]); const matched = thresholdMatches(after, threshold); const count = Number(next.thresholdCrossCounts[threshold.id] ?? 0);
      if (!prior && matched && (threshold.repeatable || count === 0)) { next.thresholdCrossCounts[threshold.id] = count + 1; thresholdEvents.push({ type: "threshold-crossed", id: next.id, thresholdId: threshold.id, value: after, threshold: threshold.value, direction: threshold.direction, reason }); }
      next.thresholdStates[threshold.id] = matched;
    }
    meters.set(next.id, next);
    const change = { type: "resource-changed", accepted: true, id: next.id, before, after, amount: after - before, reason };
    record(change); for (const event of thresholdEvents) record(event);
    if (previous && previous.value > previous.min && next.value <= next.min) record({ ...change, type: "emptied" });
    if (previous && previous.value < previous.max && next.value >= next.max) record({ ...change, type: "filled" });
    return clone(next);
  }
  function register(input, options = {}) {
    const existing = meters.get(String(input?.id ?? input?.name ?? ""));
    if (existing && options.replace !== true) return clone(existing);
    const meter = normalizeMeter(input, existing?.index ?? meters.size); meters.set(meter.id, meter); record({ type: "registered", id: meter.id, replaced: Boolean(existing), reason: options.reason ?? "register" }); return clone(meter);
  }
  function requireMeter(id) {
    const meter = meters.get(String(id));
    if (!meter) record({ type: "rejected", accepted: false, reason: "unknown-resource", id: String(id) });
    return meter ?? null;
  }
  function change(id, amount, reason, options = {}) {
    const meter = requireMeter(id); if (!meter) return null;
    if (meter.locked && options.allowLockedOverride !== true && config.allowLockedOverride !== true) { record({ type: "rejected", accepted: false, reason: "resource-locked", id: meter.id }); return clone(meter); }
    const next = { ...meter, value: config.clamp === false ? meter.value + number(amount, 0) : clamp(meter.value + number(amount, 0), meter.min, meter.max), thresholdStates: { ...meter.thresholdStates }, thresholdCrossCounts: { ...meter.thresholdCrossCounts }, lastChangeReason: reason };
    return setMeter(next, reason);
  }
  function snapshot() { return { schema: "nexusengine.core-simulation.resources/1", elapsedSeconds, resources: [...meters.values()].sort((a, b) => a.id.localeCompare(b.id)).map(clone), recentChanges: clone(recentChanges), lastChange: clone(lastChange) }; }
  function loadSnapshot(value = {}) {
    if (value.schema !== "nexusengine.core-simulation.resources/1") throw new TypeError("Unsupported Core Simulation resources snapshot.");
    meters = new Map();
    for (const [index, entry] of asList(value.resources).entries()) {
      const meter = normalizeMeter(entry, index); meter.value = clamp(number(entry.value, meter.initial), meter.min, meter.max); meter.ratePerSecond = number(entry.ratePerSecond, meter.ratePerSecond); meter.locked = Boolean(entry.locked); meter.thresholdStates = { ...meter.thresholdStates, ...(entry.thresholdStates ?? {}) }; meter.thresholdCrossCounts = { ...meter.thresholdCrossCounts, ...(entry.thresholdCrossCounts ?? {}) }; meters.set(meter.id, meter);
    }
    elapsedSeconds = Math.max(0, number(value.elapsedSeconds, 0)); recentChanges = asList(value.recentChanges).slice(-recentChangeLimit).map(clone); lastChange = clone(value.lastChange ?? null); return snapshot();
  }
  function reset(value = {}) {
    meters = new Map(); elapsedSeconds = 0; recentChanges = []; lastChange = null;
    for (const resource of asList(value.resources ?? value.meters ?? initialResources)) register(resource);
    recentChanges = []; lastChange = null; return snapshot();
  }
  reset();
  return Object.freeze({
    register,
    remove(id, reason = "remove") { const removed = meters.delete(String(id)); if (removed) record({ type: "removed", id: String(id), reason }); return removed; },
    get(id) { const key = id ?? [...meters.keys()][0]; return clone(key == null ? null : meters.get(String(key)) ?? null); },
    getResource(id) { const key = id ?? [...meters.keys()][0]; return clone(key == null ? null : meters.get(String(key)) ?? null); },
    list() { return [...meters.values()].sort((a, b) => a.id.localeCompare(b.id)).map(clone); },
    adjust: (id, amount, reason = "adjust", options) => change(id, amount, reason, options),
    add: (id, amount, reason = "add", options) => change(id, Math.abs(number(amount, 0)), reason, options),
    spend: (id, amount, reason = "spend", options) => change(id, -Math.abs(number(amount, 0)), reason, options),
    restore: (id, amount, reason = "restore", options) => change(id, Math.abs(number(amount, 0)), reason, options),
    set(id, value, reason = "set", options) { const meter = requireMeter(id); return meter ? change(id, number(value, meter.value) - meter.value, reason, options) : null; },
    setRate(id, ratePerSecond, reason = "set-rate") { const meter = requireMeter(id); if (!meter) return null; meter.ratePerSecond = number(ratePerSecond, 0); meter.lastChangeReason = reason; record({ type: "rate-changed", id: meter.id, ratePerSecond: meter.ratePerSecond, reason }); return clone(meter); },
    setLocked(id, locked, reason = "set-locked") { const meter = requireMeter(id); if (!meter) return null; meter.locked = Boolean(locked); meter.lastChangeReason = reason; record({ type: "lock-changed", id: meter.id, locked: meter.locked, reason }); return clone(meter); },
    tick(deltaSeconds = 0) { const dt = Math.max(0, Math.min(number(deltaSeconds, 0), number(config.maxDelta, Number.POSITIVE_INFINITY))); elapsedSeconds += dt; if (dt === 0) return snapshot(); for (const meter of [...meters.values()]) if (!meter.locked && meter.ratePerSecond !== 0) change(meter.id, meter.ratePerSecond * dt, "tick"); return snapshot(); },
    getDescriptors() { return [...meters.values()].sort((a, b) => a.id.localeCompare(b.id)).map(meterDescriptor); },
    getRecentChanges() { return clone(recentChanges); },
    getState: snapshot,
    getSnapshot: snapshot,
    snapshot,
    loadSnapshot,
    reset
  });
}

function pressureStatus(channel) { if (channel.value >= channel.failAt) return "failed"; if (channel.value >= channel.warningAt) return "warning"; return "normal"; }
function normalizePressure(input = {}, index = 0) {
  const min = number(input.min, 0); const max = Math.max(min, number(input.max, 100)); const warningAt = clamp(number(input.warningAt, min + (max - min) * 0.7), min, max); const failAt = clamp(number(input.failAt, max), warningAt, max); const value = clamp(number(input.initial ?? input.value, min), min, max);
  return { id: stableId(input.id ?? input.name, `pressure-${index + 1}`, "Pressure channel"), label: String(input.label ?? input.id ?? input.name ?? `Pressure ${index + 1}`), min, max, warningAt, failAt, value, ratePerSecond: number(input.ratePerSecond ?? input.risePerSecond, 0), locked: Boolean(input.locked), metadata: clone(input.metadata ?? {}), status: pressureStatus({ value, warningAt, failAt }) };
}

export function createPressureService(config = {}) {
  const initialChannels = asList(config.channels ?? config.pressureChannels);
  let channels = new Map(); let elapsedSeconds = 0; let recentEvents = [];
  const eventLimit = Math.max(1, Math.floor(number(config.eventLimit, 64)));
  function emit(type, payload) { const event = { type, ...clone(payload) }; recentEvents = [...recentEvents, event].slice(-eventLimit); config.onEvent?.(type, clone(event)); return event; }
  function register(input, options = {}) { const existing = channels.get(String(input?.id ?? input?.name ?? "")); if (existing && options.replace !== true) return clone(existing); const channel = normalizePressure(input, existing?.index ?? channels.size); channels.set(channel.id, channel); emit("registered", { id: channel.id, replaced: Boolean(existing) }); return clone(channel); }
  function requireChannel(id) { const channel = channels.get(String(id)); if (!channel) emit("rejected", { accepted: false, reason: "unknown-pressure", id: String(id) }); return channel ?? null; }
  function adjust(id, amount, reason = "adjust", options = {}) {
    const channel = requireChannel(id); if (!channel) return null;
    if (channel.locked && options.allowLockedOverride !== true) { emit("rejected", { accepted: false, reason: "pressure-locked", id: channel.id }); return clone(channel); }
    const before = channel.value; const beforeStatus = channel.status; channel.value = clamp(channel.value + number(amount, 0), channel.min, channel.max); channel.status = pressureStatus(channel);
    emit("changed", { accepted: true, id: channel.id, before, after: channel.value, amount: channel.value - before, reason, status: channel.status });
    if (beforeStatus !== channel.status) emit("status-changed", { id: channel.id, before: beforeStatus, after: channel.status, value: channel.value, reason });
    return clone(channel);
  }
  function snapshot() { return { schema: "nexusengine.core-simulation.pressure/1", elapsedSeconds, channels: [...channels.values()].sort((a, b) => a.id.localeCompare(b.id)).map(clone), recentEvents: clone(recentEvents) }; }
  function loadSnapshot(value = {}) {
    if (value.schema !== "nexusengine.core-simulation.pressure/1") throw new TypeError("Unsupported Core Simulation pressure snapshot.");
    channels = new Map();
    for (const [index, entry] of asList(value.channels).entries()) { const channel = normalizePressure(entry, index); channel.value = clamp(number(entry.value, channel.value), channel.min, channel.max); channel.ratePerSecond = number(entry.ratePerSecond, channel.ratePerSecond); channel.locked = Boolean(entry.locked); channel.status = pressureStatus(channel); channels.set(channel.id, channel); }
    elapsedSeconds = Math.max(0, number(value.elapsedSeconds, 0)); recentEvents = asList(value.recentEvents).slice(-eventLimit).map(clone); return snapshot();
  }
  function reset(value = {}) { channels = new Map(); elapsedSeconds = 0; recentEvents = []; for (const channel of asList(value.channels ?? value.pressureChannels ?? initialChannels)) register(channel); recentEvents = []; return snapshot(); }
  reset();
  return Object.freeze({
    register,
    remove(id) { return channels.delete(String(id)); },
    get(id) { return clone(channels.get(String(id)) ?? null); },
    list() { return [...channels.values()].sort((a, b) => a.id.localeCompare(b.id)).map(clone); },
    adjust,
    recover: (id, amount, reason = "recover", options) => adjust(id, -Math.abs(number(amount, 0)), reason, options),
    setRate(id, ratePerSecond) { const channel = requireChannel(id); if (!channel) return null; channel.ratePerSecond = number(ratePerSecond, 0); emit("rate-changed", { id: channel.id, ratePerSecond: channel.ratePerSecond }); return clone(channel); },
    setLocked(id, locked) { const channel = requireChannel(id); if (!channel) return null; channel.locked = Boolean(locked); emit("lock-changed", { id: channel.id, locked: channel.locked }); return clone(channel); },
    tick(deltaSeconds = 0) { const dt = Math.max(0, Math.min(number(deltaSeconds, 0), number(config.maxDelta, Number.POSITIVE_INFINITY))); elapsedSeconds += dt; if (dt === 0) return snapshot(); for (const channel of [...channels.values()]) if (!channel.locked && channel.ratePerSecond !== 0) adjust(channel.id, channel.ratePerSecond * dt, "tick"); return snapshot(); },
    getDescriptors() { return [...channels.values()].sort((a, b) => a.id.localeCompare(b.id)).map((channel) => ({ id: channel.id, kind: "pressure-channel", label: channel.label, value: channel.value, min: channel.min, max: channel.max, warningAt: channel.warningAt, failAt: channel.failAt, status: channel.status, locked: channel.locked, metadata: clone(channel.metadata) })); },
    getState: snapshot,
    getSnapshot: snapshot,
    snapshot,
    loadSnapshot,
    reset
  });
}

function normalizeWindow(input = {}, index = 0) {
  const intervalSeconds = Math.max(0.001, number(input.intervalSeconds ?? input.interval, 1));
  const perfectWindowSeconds = Math.max(0, number(input.perfectWindowSeconds ?? input.perfect, intervalSeconds * 0.1));
  const goodWindowSeconds = Math.max(perfectWindowSeconds, number(input.goodWindowSeconds ?? input.good, intervalSeconds * 0.25));
  return { id: stableId(input.id, `window-${index + 1}`, "Action window"), intervalSeconds, offsetSeconds: number(input.offsetSeconds ?? input.offset, 0), perfectWindowSeconds, goodWindowSeconds, cooldownSeconds: Math.max(0, number(input.cooldownSeconds ?? input.cooldown, 0)), metadata: clone(input.metadata ?? {}) };
}
function evaluateWindow(window, elapsedSeconds) {
  const wrapped = ((elapsedSeconds - window.offsetSeconds) % window.intervalSeconds + window.intervalSeconds) % window.intervalSeconds;
  const distance = Math.min(wrapped, window.intervalSeconds - wrapped);
  const quality = distance <= window.perfectWindowSeconds ? "perfect" : distance <= window.goodWindowSeconds ? "good" : "miss";
  return { id: window.id, phase: wrapped / window.intervalSeconds, distanceSeconds: distance, secondsToPeak: wrapped <= window.intervalSeconds / 2 ? -wrapped : window.intervalSeconds - wrapped, quality, multiplier: quality === "perfect" ? 1.4 : quality === "good" ? 1 : 0, open: quality !== "miss", metadata: clone(window.metadata) };
}

export function createActionWindowService(config = {}) {
  const initialWindows = asList(config.windows ?? config.actionWindows);
  let windows = new Map(); let elapsedSeconds = 0; let cooldownUntil = new Map(); let history = [];
  const historyLimit = Math.max(1, Math.floor(number(config.historyLimit, 64)));
  function emit(type, payload) { config.onEvent?.(type, clone(payload)); }
  function register(input, options = {}) { const existing = windows.get(String(input?.id ?? "")); if (existing && options.replace !== true) return clone(existing); const window = normalizeWindow(input, existing?.index ?? windows.size); windows.set(window.id, window); emit("registered", { id: window.id, replaced: Boolean(existing) }); return clone(window); }
  function snapshot() { return { schema: "nexusengine.core-simulation.windows/1", elapsedSeconds, windows: [...windows.values()].sort((a, b) => a.id.localeCompare(b.id)).map(clone), cooldownUntil: Object.fromEntries([...cooldownUntil.entries()].sort(([a], [b]) => a.localeCompare(b))), history: clone(history) }; }
  function loadSnapshot(value = {}) {
    if (value.schema !== "nexusengine.core-simulation.windows/1") throw new TypeError("Unsupported Core Simulation action-window snapshot.");
    windows = new Map(asList(value.windows).map((entry, index) => { const window = normalizeWindow(entry, index); return [window.id, window]; })); elapsedSeconds = Math.max(0, number(value.elapsedSeconds, 0)); cooldownUntil = new Map(Object.entries(value.cooldownUntil ?? {}).map(([id, at]) => [id, number(at, 0)])); history = asList(value.history).slice(-historyLimit).map(clone); return snapshot();
  }
  function reset(value = {}) { windows = new Map(); elapsedSeconds = 0; cooldownUntil = new Map(); history = []; for (const window of asList(value.windows ?? value.actionWindows ?? initialWindows)) register(window); history = []; return snapshot(); }
  reset();
  return Object.freeze({
    register,
    remove(id) { cooldownUntil.delete(String(id)); return windows.delete(String(id)); },
    get(id) { return clone(windows.get(String(id)) ?? null); },
    list() { return [...windows.values()].sort((a, b) => a.id.localeCompare(b.id)).map(clone); },
    tick(deltaSeconds = 0) { elapsedSeconds += Math.max(0, number(deltaSeconds, 0)); return snapshot(); },
    evaluate(id, at = elapsedSeconds) { const window = windows.get(String(id)); return window ? evaluateWindow(window, number(at, elapsedSeconds)) : null; },
    action(id, payload = {}) {
      const window = windows.get(String(id));
      if (!window) { const result = { accepted: false, reason: "unknown-window", windowId: String(id), at: elapsedSeconds }; history = [...history, result].slice(-historyLimit); emit("rejected", result); return clone(result); }
      const availableAt = cooldownUntil.get(window.id) ?? 0;
      if (elapsedSeconds < availableAt) { const result = { accepted: false, reason: "cooldown", windowId: window.id, at: elapsedSeconds, availableAt }; history = [...history, result].slice(-historyLimit); emit("rejected", result); return clone(result); }
      const evaluation = evaluateWindow(window, elapsedSeconds);
      const result = { accepted: true, windowId: window.id, actorId: payload.actorId ?? null, actionId: payload.actionId ?? null, at: elapsedSeconds, ...evaluation, metadata: clone(payload.metadata ?? {}) };
      if (window.cooldownSeconds > 0) cooldownUntil.set(window.id, elapsedSeconds + window.cooldownSeconds);
      history = [...history, result].slice(-historyLimit); emit("resolved", result); return clone(result);
    },
    getActive(id) { if (id != null) { const window = windows.get(String(id)); return window ? evaluateWindow(window, elapsedSeconds) : null; } return Object.fromEntries([...windows.values()].sort((a, b) => a.id.localeCompare(b.id)).map((window) => [window.id, evaluateWindow(window, elapsedSeconds)])); },
    getHistory: () => clone(history),
    getState: snapshot,
    getSnapshot: snapshot,
    snapshot,
    loadSnapshot,
    reset
  });
}
