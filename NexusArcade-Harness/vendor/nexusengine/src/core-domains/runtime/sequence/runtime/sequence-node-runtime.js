import { createDefaultSequenceNodeLibrary } from "./sequence-node-library.js";

export const SequenceNodeState = Object.freeze({
  Idle: "idle",
  Ready: "ready",
  Running: "running",
  Complete: "complete",
  Finished: "finished",
  Failed: "failed",
  Cancelled: "cancelled",
  Skipped: "skipped"
});

export const SequenceNodeCompletionMode = Object.freeze({
  Sequence: "sequence",
  All: "all",
  Any: "any",
  Race: "race",
  Event: "event",
  Condition: "condition",
  Manual: "manual",
  Timeout: "timeout"
});

export const SequenceNodeDriver = Object.freeze({
  Event: "event",
  Frame: "frame",
  Surface: "surface",
  Manual: "manual",
  Timer: "timer",
  Hybrid: "hybrid"
});

export const SequenceNodeEventType = Object.freeze({
  RuntimeMounted: "sequence.runtime.mounted",
  RuntimeDisposed: "sequence.runtime.disposed",
  Frame: "sequence.frame",
  Tick: "sequence.tick",
  Evaluate: "sequence.evaluate",
  NodeMounted: "sequence.node.mounted",
  NodeStarted: "sequence.node.started",
  NodeReady: "sequence.node.ready",
  NodeRunning: "sequence.node.running",
  NodeComplete: "sequence.node.complete",
  NodeFinished: "sequence.node.finished",
  NodeFailed: "sequence.node.failed",
  NodeCancelled: "sequence.node.cancelled",
  NodeSkipped: "sequence.node.skipped",
  ChildFinished: "sequence.child.finished",
  ChildFailed: "sequence.child.failed",
  KitRequired: "sequence.kit.required",
  KitInstalled: "sequence.kit.installed",
  KitMissing: "sequence.kit.missing",
  SurfaceEvent: "sequence.surface.event",
  SurfaceResource: "sequence.surface.resource",
  SurfaceQuery: "sequence.surface.query",
  SurfaceLifecycle: "sequence.surface.lifecycle",
  Telemetry: "sequence.telemetry",
  ManualComplete: "sequence.manual.complete",
  ManualFail: "sequence.manual.fail",
  ManualCancel: "sequence.manual.cancel"
});

const TERMINAL = new Set([
  SequenceNodeState.Finished,
  SequenceNodeState.Failed,
  SequenceNodeState.Cancelled,
  SequenceNodeState.Skipped
]);

let eventSequence = 0;

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isObject(value)) {
    const out = {};
    for (const [key, entry] of Object.entries(value)) out[key] = clone(entry);
    return out;
  }
  return value;
}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function unique(values) {
  return Array.from(new Set(values.filter((value) => value !== undefined && value !== null && value !== "")));
}

function hasOwn(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

function number(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function eventId() {
  eventSequence += 1;
  return `sequence-event-${eventSequence}`;
}

export function createSequenceNodeEvent(typeOrEvent, payload = {}, meta = {}) {
  const input = isObject(typeOrEvent) ? typeOrEvent : { type: typeOrEvent, payload, meta };
  const inputMeta = isObject(input.meta) ? input.meta : {};

  if (typeof input.type !== "string" || input.type.length === 0) {
    throw new TypeError("SequenceNode events require a non-empty type.");
  }

  return {
    id: input.id ?? eventId(),
    type: input.type,
    payload: clone(input.payload ?? payload ?? {}),
    source: input.source ?? meta.source ?? "runtime",
    target: input.target ?? null,
    nodeId: input.nodeId ?? null,
    time: number(input.time, Date.now()),
    frame: input.frame ?? meta.frame ?? null,
    delta: input.delta ?? meta.delta ?? null,
    elapsed: input.elapsed ?? meta.elapsed ?? null,
    meta: {
      ...clone(inputMeta),
      ...clone(meta)
    }
  };
}

function predicateFor(typeOrPredicate) {
  if (typeof typeOrPredicate === "function") return typeOrPredicate;
  if (Array.isArray(typeOrPredicate)) {
    const allowed = new Set(typeOrPredicate);
    return (event) => allowed.has(event.type);
  }
  return (event) => event.type === typeOrPredicate;
}

export function createSequenceNodeEventBus(options = {}) {
  const listeners = [];
  const anyListeners = new Set();
  const history = [];
  const queue = [];
  const historyLimit = Math.max(0, number(options.historyLimit, 100));
  let dispatching = false;
  let disposed = false;

  function remember(event) {
    if (historyLimit <= 0) return;
    history.push(event);
    while (history.length > historyLimit) history.shift();
  }

  function drain() {
    if (dispatching) return;
    dispatching = true;
    try {
      while (queue.length) {
        const event = queue.shift();
        remember(event);
        for (const listener of Array.from(anyListeners)) listener(event);
        for (const entry of listeners.slice()) {
          if (!entry.predicate(event)) continue;
          entry.listener(event);
          if (entry.once) {
            const index = listeners.indexOf(entry);
            if (index !== -1) listeners.splice(index, 1);
          }
        }
      }
    } finally {
      dispatching = false;
    }
  }

  return {
    subscribe(typeOrPredicate, listener) {
      if (disposed) throw new Error("Cannot subscribe to a disposed SequenceNode event bus.");
      if (typeof listener !== "function") throw new TypeError("SequenceNode event listeners must be functions.");
      const entry = { predicate: predicateFor(typeOrPredicate), listener, once: false };
      listeners.push(entry);
      return () => {
        const index = listeners.indexOf(entry);
        if (index !== -1) listeners.splice(index, 1);
      };
    },
    once(typeOrPredicate, listener) {
      if (disposed) throw new Error("Cannot subscribe to a disposed SequenceNode event bus.");
      if (typeof listener !== "function") throw new TypeError("SequenceNode event listeners must be functions.");
      const entry = { predicate: predicateFor(typeOrPredicate), listener, once: true };
      listeners.push(entry);
      return () => {
        const index = listeners.indexOf(entry);
        if (index !== -1) listeners.splice(index, 1);
      };
    },
    dispatch(eventOrType, payload = {}, meta = {}) {
      if (disposed) return null;
      const event = createSequenceNodeEvent(eventOrType, payload, meta);
      queue.push(event);
      drain();
      return event;
    },
    onAny(listener) {
      if (typeof listener !== "function") throw new TypeError("SequenceNode any listeners must be functions.");
      anyListeners.add(listener);
      return () => anyListeners.delete(listener);
    },
    snapshot() {
      return {
        disposed,
        listenerCount: listeners.length,
        anyListenerCount: anyListeners.size,
        history: history.slice()
      };
    },
    clear() {
      history.length = 0;
      queue.length = 0;
    },
    dispose() {
      disposed = true;
      history.length = 0;
      queue.length = 0;
      listeners.length = 0;
      anyListeners.clear();
    }
  };
}

function typeDefinition(library, type) {
  return library?.get?.(type) ?? null;
}

function defaultCompletionFor(node, library) {
  return typeDefinition(library, node.type)?.defaultCompletionMode ?? SequenceNodeCompletionMode.Manual;
}

function defaultDriverFor(node, library) {
  return typeDefinition(library, node.type)?.defaultDriver ?? SequenceNodeDriver.Event;
}

export function normalizeSequenceNode(root, library = createDefaultSequenceNodeLibrary()) {
  function normalize(node) {
    if (!isObject(node)) {
      throw new TypeError("SequenceNode entries must be objects.");
    }

    const base = clone(node);
    const normalized = {
      id: base.id,
      type: base.type,
      state: base.state ?? SequenceNodeState.Idle,
      completionMode: base.completionMode ?? defaultCompletionFor(base, library),
      driver: base.driver ?? defaultDriverFor(base, library),
      config: isObject(base.config) ? base.config : {},
      data: isObject(base.data) ? base.data : {},
      kits: asArray(base.kits),
      listen: asArray(base.listen),
      read: asArray(base.read),
      write: isObject(base.write) ? base.write : {},
      emit: asArray(base.emit),
      until: base.until ?? null,
      children: asArray(base.children).map(normalize)
    };

    for (const [key, value] of Object.entries(base)) {
      if (!hasOwn(normalized, key)) normalized[key] = value;
    }

    return normalized;
  }

  if (Array.isArray(root)) return root.map(normalize);
  return normalize(root);
}

export function flattenSequenceNode(root) {
  const nodes = [];
  const parents = new Map();

  function visit(node, parent = null) {
    if (!node) return;
    nodes.push(node);
    if (parent) parents.set(node.id, parent.id);
    for (const child of node.children ?? []) visit(child, node);
  }

  for (const node of asArray(root)) visit(node);
  return { nodes, parents };
}

function isValidCondition(condition) {
  if (condition === null || condition === undefined) return true;
  if (!isObject(condition)) return false;
  if (condition.all !== undefined) return Array.isArray(condition.all) && condition.all.every(isValidCondition);
  if (condition.any !== undefined) return Array.isArray(condition.any) && condition.any.every(isValidCondition);
  if (condition.not !== undefined) return isValidCondition(condition.not);
  if (condition.event !== undefined) return typeof condition.event === "string" || Array.isArray(condition.event);
  return typeof condition.path === "string" || typeof condition.state === "string";
}

function hasCompletionPath(node) {
  return (node.children?.length ?? 0) > 0 ||
    (node.listen?.length ?? 0) > 0 ||
    node.until !== null ||
    Object.keys(node.write ?? {}).length > 0 ||
    (node.emit?.length ?? 0) > 0 ||
    node.config?.event !== undefined ||
    node.config?.durationMs !== undefined;
}

export function validateSequenceNode(root, library = createDefaultSequenceNodeLibrary(), options = {}) {
  const errors = [];
  const warnings = [];
  const normalizedRoot = (() => {
    try {
      return normalizeSequenceNode(root, library);
    } catch (error) {
      errors.push({ nodeId: null, code: "invalid_root", message: error.message });
      return null;
    }
  })();

  if (!normalizedRoot) {
    return { ok: false, errors, warnings, nodes: [], ids: [] };
  }

  const { nodes } = flattenSequenceNode(normalizedRoot);
  const ids = [];
  const seen = new Set();
  const knownStates = new Set(Object.values(SequenceNodeState));
  const knownModes = new Set(Object.values(SequenceNodeCompletionMode));
  const knownDrivers = new Set(Object.values(SequenceNodeDriver));

  if (nodes.length === 0) {
    errors.push({ nodeId: null, code: "missing_root", message: "SequenceNode root is required." });
  }

  for (const node of nodes) {
    if (typeof node.id !== "string" || node.id.trim().length === 0) {
      errors.push({ nodeId: null, code: "missing_id", message: "Every SequenceNode requires an id." });
    } else if (seen.has(node.id)) {
      errors.push({ nodeId: node.id, code: "duplicate_id", message: `Duplicate SequenceNode id: ${node.id}` });
    } else {
      seen.add(node.id);
      ids.push(node.id);
    }

    if (typeof node.type !== "string" || node.type.trim().length === 0) {
      errors.push({ nodeId: node.id ?? null, code: "missing_type", message: "Every SequenceNode requires a type." });
    } else if (!library?.has?.(node.type)) {
      errors.push({ nodeId: node.id ?? null, code: "unknown_type", message: `Unknown SequenceNode type: ${node.type}` });
    }

    if (!knownStates.has(node.state)) errors.push({ nodeId: node.id, code: "invalid_state", message: `Invalid state: ${node.state}` });
    if (!knownModes.has(node.completionMode)) errors.push({ nodeId: node.id, code: "invalid_completion_mode", message: `Invalid completionMode: ${node.completionMode}` });
    if (!knownDrivers.has(node.driver)) errors.push({ nodeId: node.id, code: "invalid_driver", message: `Invalid driver: ${node.driver}` });

    for (const [field, value] of [["children", node.children], ["listen", node.listen], ["read", node.read], ["emit", node.emit], ["kits", node.kits]]) {
      if (!Array.isArray(value)) errors.push({ nodeId: node.id, code: "invalid_array", message: `${field} must be an array.` });
    }

    if (!isObject(node.write)) errors.push({ nodeId: node.id, code: "invalid_write", message: "write must be an object." });
    if (!isValidCondition(node.until)) errors.push({ nodeId: node.id, code: "invalid_until", message: "until must be a valid condition object." });

    if (node.completionMode === SequenceNodeCompletionMode.Event && node.listen.length === 0 && !node.until?.event && !node.config?.event) {
      errors.push({ nodeId: node.id, code: "event_without_source", message: "event completion requires listen, until.event, or config.event." });
    }

    if (node.completionMode === SequenceNodeCompletionMode.Condition && !node.until) {
      errors.push({ nodeId: node.id, code: "condition_without_until", message: "condition completion requires until." });
    }

    if ([SequenceNodeCompletionMode.Sequence, SequenceNodeCompletionMode.All, SequenceNodeCompletionMode.Any, SequenceNodeCompletionMode.Race].includes(node.completionMode) && node.children.length === 0) {
      errors.push({ nodeId: node.id, code: "children_required", message: `${node.completionMode} completion requires children.` });
    }

    if (node.completionMode === SequenceNodeCompletionMode.Timeout && node.config.durationMs === undefined && node.config.durationFrames === undefined) {
      errors.push({ nodeId: node.id, code: "timeout_without_duration", message: "timeout completion requires config.durationMs or config.durationFrames." });
    }

    for (const path of node.read) {
      if (typeof path !== "string") errors.push({ nodeId: node.id, code: "invalid_read_path", message: "read paths must be strings." });
    }

    for (const path of Object.keys(node.write)) {
      if (typeof path !== "string" || path.trim().length === 0) {
        errors.push({ nodeId: node.id, code: "invalid_write_path", message: "write paths must be string paths." });
      }
    }

    if (node.next && !seen.has(node.next) && !nodes.some((entry) => entry.id === node.next)) {
      errors.push({ nodeId: node.id, code: "missing_next", message: `next references missing node: ${node.next}` });
    }

    const typeResult = library?.validateNode?.(node) ?? { ok: true, errors: [], warnings: [] };
    errors.push(...(typeResult.errors ?? []));
    warnings.push(...(typeResult.warnings ?? []));

    if (!hasCompletionPath(node)) warnings.push({ nodeId: node.id, code: "no_completion_path", message: "Node has no config, children, or completion path." });
    if (node.listen.length > 0 && !options.eventSourcesKnown) warnings.push({ nodeId: node.id, code: "event_source_unknown", message: "Node listens for an event but no event source is known." });
    if (node.until?.path?.startsWith("world.resource.") && !options.resourceSurfaceBridge) warnings.push({ nodeId: node.id, code: "resource_bridge_unknown", message: "Node has resource condition but no resource surface bridge is configured." });
    if (node.until?.path?.startsWith("query.") && !options.querySurfaceBridge) warnings.push({ nodeId: node.id, code: "query_bridge_unknown", message: "Node has query condition but no query surface bridge is configured." });
    if (node.driver === SequenceNodeDriver.Frame && options.frameBridge === false) warnings.push({ nodeId: node.id, code: "frame_bridge_disabled", message: "Node uses frame driver but frame bridge is disabled." });
    if (node.children.length > 0 && [SequenceNodeCompletionMode.Event, SequenceNodeCompletionMode.Condition, SequenceNodeCompletionMode.Timeout].includes(node.completionMode) && node.config.allowLocalCompletionWithChildren !== true) {
      warnings.push({ nodeId: node.id, code: "local_completion_with_children", message: "Node has both children and local completion." });
    }
    if (node.kits.length > 0 && !options.kitRegistry) warnings.push({ nodeId: node.id, code: "kit_registry_missing", message: "Node lists kits but no kit registry was supplied." });
  }

  return { ok: errors.length === 0, errors, warnings, nodes, ids };
}

function addAll(set, values = []) {
  for (const value of values) set.add(value);
}

function kitId(kit) {
  return typeof kit === "string" ? kit : kit?.id;
}

function collectCondition(condition, out) {
  if (!condition || !isObject(condition)) return;
  if (condition.event) addAll(out.requiredEvents, asArray(condition.event));
  if (condition.path?.startsWith("world.resource.")) out.requiredResources.add(condition.path.slice("world.resource.".length).split(".")[0]);
  if (condition.path?.startsWith("query.")) out.requiredQueries.add(condition.path.slice("query.".length).split(".")[0]);
  for (const entry of condition.all ?? []) collectCondition(entry, out);
  for (const entry of condition.any ?? []) collectCondition(entry, out);
  if (condition.not) collectCondition(condition.not, out);
}

export function createSequenceNodePlan(root, library = createDefaultSequenceNodeLibrary(), options = {}) {
  const normalized = normalizeSequenceNode(root, library);
  const { nodes, parents } = flattenSequenceNode(normalized);
  const edges = [];
  const sets = {
    requiredKits: new Set(),
    requiredEvents: new Set(),
    requiredResources: new Set(),
    requiredQueries: new Set(),
    requiredSurfaces: new Set(),
    requiredDrivers: new Set(),
    emittedEvents: new Set(),
    listenedEvents: new Set()
  };
  const warnings = [];
  const telemetry = [];
  const rendererNeeds = [];

  for (const node of nodes) {
    if (parents.has(node.id)) edges.push({ from: parents.get(node.id), to: node.id, kind: "child" });
    for (const kit of node.kits) sets.requiredKits.add(kitId(kit));
    addAll(sets.listenedEvents, node.listen);
    addAll(sets.requiredEvents, node.listen);
    addAll(sets.requiredDrivers, [node.driver]);
    addAll(sets.emittedEvents, node.emit.map((entry) => typeof entry === "string" ? entry : entry?.type ?? entry?.event));
    if (node.config?.event) sets.emittedEvents.add(node.config.event);
    for (const path of node.read) {
      if (String(path).startsWith("world.resource.")) sets.requiredResources.add(String(path).slice("world.resource.".length).split(".")[0]);
    }
    for (const path of Object.keys(node.write ?? {})) {
      if (String(path).startsWith("world.resource.")) sets.requiredResources.add(String(path).slice("world.resource.".length).split(".")[0]);
    }
    collectCondition(node.until, sets);

    const type = library?.get?.(node.type);
    if (type) {
      addAll(sets.requiredKits, type.requiredKits);
      addAll(sets.requiredEvents, type.requiredEvents);
      addAll(sets.requiredResources, type.requiredResources);
      addAll(sets.requiredSurfaces, type.requiredSurfaces);
      addAll(sets.requiredDrivers, type.requiredDrivers);
      const extra = type.plan?.(node, { root: normalized, node, options }) ?? {};
      addAll(sets.requiredKits, extra.requiredKits);
      addAll(sets.requiredEvents, extra.requiredEvents);
      addAll(sets.requiredResources, extra.requiredResources);
      addAll(sets.requiredSurfaces, extra.requiredSurfaces);
      addAll(sets.requiredDrivers, extra.requiredDrivers);
      addAll(sets.emittedEvents, extra.emittedEvents);
      addAll(sets.listenedEvents, extra.listenedEvents);
      if (extra.telemetry) telemetry.push(...asArray(extra.telemetry));
      if (extra.rendererNeeds) rendererNeeds.push(...asArray(extra.rendererNeeds));
      if (extra.warnings) warnings.push(...asArray(extra.warnings));
    }
  }

  return {
    rootId: Array.isArray(normalized) ? normalized[0]?.id ?? null : normalized.id,
    nodes,
    edges,
    requiredKits: unique(Array.from(sets.requiredKits)),
    requiredEvents: unique(Array.from(sets.requiredEvents)),
    requiredResources: unique(Array.from(sets.requiredResources)),
    requiredQueries: unique(Array.from(sets.requiredQueries)),
    requiredSurfaces: unique(Array.from(sets.requiredSurfaces)),
    requiredDrivers: unique(Array.from(sets.requiredDrivers)),
    emittedEvents: unique(Array.from(sets.emittedEvents)),
    listenedEvents: unique(Array.from(sets.listenedEvents)),
    telemetry,
    rendererNeeds,
    warnings
  };
}

function resolveRoot(path, context) {
  if (path === "root") return context.root;
  if (path === "node") return context.node;
  if (path === "parent") return context.parent;
  if (path === "event") return context.event;
  if (path === "engine") return context.engine;
  if (path === "world") return context.world;
  return undefined;
}

export function readSequencePath(path, context = {}) {
  if (typeof path !== "string" || path.length === 0) return undefined;

  if (path.startsWith("world.resource.")) {
    const [, rest] = path.split("world.resource.");
    const [name, ...tail] = rest.split(".");
    const resource = { kind: "resource", name };
    let value = context.world?.getResource?.(resource);
    for (const segment of tail) value = value?.[segment];
    return value;
  }

  const [head, ...tail] = path.split(".");
  let value = resolveRoot(head, context);
  for (const segment of tail) value = value?.[segment];
  return value;
}

function ensurePathObject(target, path) {
  let current = target;
  for (const segment of path) {
    if (!isObject(current[segment])) current[segment] = {};
    current = current[segment];
  }
  return current;
}

export function writeSequencePath(path, value, context = {}) {
  if (typeof path !== "string" || path.length === 0) return false;

  if (path.startsWith("world.resource.")) {
    const [, rest] = path.split("world.resource.");
    const [name, ...tail] = rest.split(".");
    const resource = { kind: "resource", name };
    if (tail.length === 0) {
      context.world?.setResource?.(resource, value);
      return true;
    }
    const current = clone(context.world?.getResource?.(resource) ?? {});
    const parent = ensurePathObject(current, tail.slice(0, -1));
    parent[tail.at(-1)] = value;
    context.world?.setResource?.(resource, current);
    return true;
  }

  const [head, ...tail] = path.split(".");
  const target = resolveRoot(head, context);
  if (!target || tail.length === 0) return false;
  const parent = ensurePathObject(target, tail.slice(0, -1));
  parent[tail.at(-1)] = value;
  return true;
}

function resolveWriteValue(value, path, context) {
  if (typeof value === "string") {
    if (/^[+-]\d+(\.\d+)?$/.test(value)) {
      return number(readSequencePath(path, context), 0) + Number(value);
    }
    if (value.startsWith("$")) return clone(readSequencePath(value.slice(1), context));
  }
  return clone(value);
}

export function applySequenceWrites(writeSpec = {}, context = {}) {
  const applied = [];
  for (const [path, value] of Object.entries(writeSpec ?? {})) {
    const next = resolveWriteValue(value, path, context);
    if (writeSequencePath(path, next, context)) applied.push({ path, value: next });
  }
  return applied;
}

function compare(value, condition) {
  if (condition.equals !== undefined && value !== condition.equals) return false;
  if (condition.notEquals !== undefined && value === condition.notEquals) return false;
  if (condition.gt !== undefined && !(value > condition.gt)) return false;
  if (condition.gte !== undefined && !(value >= condition.gte)) return false;
  if (condition.lt !== undefined && !(value < condition.lt)) return false;
  if (condition.lte !== undefined && !(value <= condition.lte)) return false;
  if (condition.includes !== undefined && !(Array.isArray(value) || typeof value === "string") || condition.includes !== undefined && !value.includes(condition.includes)) return false;
  if (condition.exists !== undefined && Boolean(value !== undefined && value !== null) !== Boolean(condition.exists)) return false;
  return true;
}

export function evaluateSequenceCondition(condition, context = {}) {
  if (!condition) return false;
  if (condition.all) return condition.all.every((entry) => evaluateSequenceCondition(entry, context));
  if (condition.any) return condition.any.some((entry) => evaluateSequenceCondition(entry, context));
  if (condition.not) return !evaluateSequenceCondition(condition.not, context);
  if (condition.event) return asArray(condition.event).includes(context.event?.type);

  const path = condition.path ?? (condition.state ? `root.data.${condition.state}` : null);
  if (!path) return false;
  return compare(readSequencePath(path, context), condition);
}

function eventMatches(node, event) {
  const listen = new Set([...(node.listen ?? []), ...asArray(node.config?.event), ...asArray(node.until?.event)]);
  if (listen.size === 0) return false;
  return listen.has(event.type);
}

function isFrameEvent(event) {
  return event.type === SequenceNodeEventType.Frame || event.type === SequenceNodeEventType.Tick || event.meta?.driver === "frame";
}

function isSurfaceEvent(event) {
  return event.source === "surface" ||
    event.type === SequenceNodeEventType.SurfaceEvent ||
    event.type === SequenceNodeEventType.SurfaceResource ||
    event.type === SequenceNodeEventType.SurfaceQuery ||
    event.type === SequenceNodeEventType.SurfaceLifecycle ||
    event.meta?.surfaceKind;
}

function isManualEvent(event) {
  return event.type === SequenceNodeEventType.ManualComplete ||
    event.type === SequenceNodeEventType.ManualFail ||
    event.type === SequenceNodeEventType.ManualCancel ||
    event.type === SequenceNodeEventType.Evaluate ||
    event.meta?.manual === true;
}

function isTimerEvent(event) {
  return event.meta?.timer === true || event.type === "sequence.timer";
}

function nodeAcceptsEvent(node, event) {
  if (node.driver === SequenceNodeDriver.Hybrid) return true;
  if (eventMatches(node, event) && [SequenceNodeDriver.Event, SequenceNodeDriver.Surface, SequenceNodeDriver.Hybrid].includes(node.driver)) return true;
  if (node.config?.allowCrossDriverEvents === true && eventMatches(node, event)) return true;
  if (node.driver === SequenceNodeDriver.Manual) return isManualEvent(event);
  if (node.driver === SequenceNodeDriver.Event) return !isFrameEvent(event) && !isSurfaceEvent(event) && !isTimerEvent(event);
  if (node.driver === SequenceNodeDriver.Surface) return isSurfaceEvent(event);
  if (node.driver === SequenceNodeDriver.Frame) return isFrameEvent(event);
  if (node.driver === SequenceNodeDriver.Timer) return isTimerEvent(event) || isFrameEvent(event);
  return false;
}

export function createSequenceNodeRuntime(options = {}) {
  let library = options.library ?? createDefaultSequenceNodeLibrary();
  let kitRegistry = { ...(options.kitRegistry ?? {}) };
  let engine = options.engine ?? null;
  let roots = [];
  let nodeMap = new Map();
  let parentMap = new Map();
  let bus = createSequenceNodeEventBus({ historyLimit: options.historyLimit });
  let queue = [];
  let draining = false;
  let disposed = false;
  const unsubscribers = [];

  function rebuild() {
    nodeMap = new Map();
    parentMap = new Map();
    for (const root of roots) {
      const flat = flattenSequenceNode(root);
      for (const node of flat.nodes) nodeMap.set(node.id, node);
      for (const [child, parent] of flat.parents.entries()) parentMap.set(child, parent);
    }
  }

  function rootFor(node) {
    let current = node;
    while (current && parentMap.has(current.id)) current = nodeMap.get(parentMap.get(current.id));
    return current ?? node;
  }

  function contextFor(node, event = null, extra = {}) {
    return {
      runtime: api,
      engine,
      world: engine?.world,
      root: rootFor(node),
      node,
      parent: nodeMap.get(parentMap.get(node.id)) ?? null,
      event,
      clock: engine?.clock,
      ...extra
    };
  }

  function emitBus(type, payload = {}, meta = {}) {
    return bus.dispatch({ type, payload, source: "sequence", meta });
  }

  function setState(node, state, eventType, payload = {}) {
    node.state = state;
    emitBus(eventType, { nodeId: node.id, ...payload }, { nodeId: node.id });
  }

  function shouldFinishFromCondition(node, event) {
    if (!node.until) return false;
    return evaluateSequenceCondition(node.until, contextFor(node, event));
  }

  function startChildren(node) {
    const children = node.children ?? [];
    if (children.length === 0 || node.config?.startChildren === false) return;
    if (node.completionMode === SequenceNodeCompletionMode.Sequence) {
      startNode(children[0]);
      return;
    }
    for (const child of children) startNode(child);
  }

  function completeIfEmptyGroup(node) {
    if ([SequenceNodeCompletionMode.Sequence, SequenceNodeCompletionMode.All, SequenceNodeCompletionMode.Any, SequenceNodeCompletionMode.Race].includes(node.completionMode) && (node.children?.length ?? 0) === 0) {
      finishNode(node);
    }
  }

  function runEnterBehavior(node, event) {
    const context = contextFor(node, event);
    const type = library.get(node.type);
    type?.onEnter?.(node, context);

    if (node.config?.writeOnEnter === true || node.type === "setState") {
      applySequenceWrites(node.write, context);
    }

    if (node.type === "emitEvent") {
      const events = node.config?.event ? [node.config.event] : node.emit;
      for (const entry of events) {
        const typeName = typeof entry === "string" ? entry : entry?.type ?? entry?.event;
        if (typeName) api.dispatch(typeName, typeof entry === "object" ? entry.payload ?? {} : {}, { sourceNodeId: node.id });
      }
      finishNode(node);
    } else if (node.type === "telemetryMark") {
      api.dispatch(SequenceNodeEventType.Telemetry, { label: node.config?.label ?? node.id, nodeId: node.id }, { sourceNodeId: node.id });
      finishNode(node);
    } else if (node.type === "installKit") {
      const result = api.installRequiredKits({ ...node, kits: [node.config?.kit].filter(Boolean) });
      result.missing.length ? failNode(node, { missing: result.missing }) : finishNode(node);
    } else if (node.type === "setState") {
      finishNode(node);
    }
  }

  function startNode(nodeOrId, payload = {}) {
    const node = typeof nodeOrId === "string" ? nodeMap.get(nodeOrId) : nodeOrId;
    if (!node || TERMINAL.has(node.state) || node.state === SequenceNodeState.Running) return false;
    setState(node, SequenceNodeState.Ready, SequenceNodeEventType.NodeReady, { payload });
    setState(node, SequenceNodeState.Running, SequenceNodeEventType.NodeStarted, { payload });
    emitBus(SequenceNodeEventType.NodeRunning, { nodeId: node.id }, { nodeId: node.id });
    node.__sequenceStartFrame = engine?.clock?.frame ?? 0;
    node.__sequenceStartElapsed = engine?.clock?.elapsed ?? 0;
    runEnterBehavior(node, null);
    if (TERMINAL.has(node.state)) return true;
    startChildren(node);
    if (node.completionMode === SequenceNodeCompletionMode.Condition && shouldFinishFromCondition(node, null)) finishNode(node);
    completeIfEmptyGroup(node);
    return true;
  }

  function finishNode(nodeOrId, payload = {}) {
    const node = typeof nodeOrId === "string" ? nodeMap.get(nodeOrId) : nodeOrId;
    if (!node || TERMINAL.has(node.state)) return false;
    setState(node, SequenceNodeState.Complete, SequenceNodeEventType.NodeComplete, { payload });
    library.get(node.type)?.onExit?.(node, contextFor(node, null, { payload }));
    setState(node, SequenceNodeState.Finished, SequenceNodeEventType.NodeFinished, { payload });
    notifyParent(node, false);
    return true;
  }

  function failNode(nodeOrId, error = {}) {
    const node = typeof nodeOrId === "string" ? nodeMap.get(nodeOrId) : nodeOrId;
    if (!node || TERMINAL.has(node.state)) return false;
    setState(node, SequenceNodeState.Failed, SequenceNodeEventType.NodeFailed, { error });
    notifyParent(node, true);
    return true;
  }

  function cancelOrSkip(nodeOrId, state, eventType, reason = {}) {
    const node = typeof nodeOrId === "string" ? nodeMap.get(nodeOrId) : nodeOrId;
    if (!node || TERMINAL.has(node.state)) return false;
    for (const child of node.children ?? []) cancelOrSkip(child, state, eventType, reason);
    setState(node, state, eventType, { reason });
    notifyParent(node, state === SequenceNodeState.Failed);
    return true;
  }

  function activeChildren(node) {
    return (node.children ?? []).filter((child) => !TERMINAL.has(child.state));
  }

  function successfulChildren(node) {
    return (node.children ?? []).filter((child) => child.state === SequenceNodeState.Finished || child.state === SequenceNodeState.Skipped);
  }

  function notifyParent(child, failed) {
    const parent = nodeMap.get(parentMap.get(child.id));
    if (!parent || parent.state !== SequenceNodeState.Running) return;

    emitBus(failed ? SequenceNodeEventType.ChildFailed : SequenceNodeEventType.ChildFinished, {
      parentId: parent.id,
      childId: child.id
    });

    if (failed && parent.config?.continueOnFailure !== true) {
      failNode(parent, { childId: child.id });
      return;
    }

    const children = parent.children ?? [];
    if (parent.completionMode === SequenceNodeCompletionMode.Sequence) {
      const index = children.indexOf(child);
      const next = children[index + 1];
      if (next) startNode(next);
      else finishNode(parent);
      return;
    }

    if (parent.completionMode === SequenceNodeCompletionMode.All && successfulChildren(parent).length === children.length) {
      finishNode(parent);
      return;
    }

    if (parent.completionMode === SequenceNodeCompletionMode.Any && !failed) {
      for (const sibling of activeChildren(parent)) cancelOrSkip(sibling, SequenceNodeState.Skipped, SequenceNodeEventType.NodeSkipped, { winner: child.id });
      finishNode(parent);
      return;
    }

    if (parent.completionMode === SequenceNodeCompletionMode.Race) {
      for (const sibling of activeChildren(parent)) cancelOrSkip(sibling, SequenceNodeState.Cancelled, SequenceNodeEventType.NodeCancelled, { winner: child.id });
      failed ? failNode(parent, { childId: child.id }) : finishNode(parent);
    }
  }

  function processTimeout(node, event) {
    if (node.completionMode !== SequenceNodeCompletionMode.Timeout) return false;
    const startFrame = number(node.__sequenceStartFrame, engine?.clock?.frame ?? 0);
    const startElapsed = number(node.__sequenceStartElapsed, engine?.clock?.elapsed ?? 0);
    if (node.config.durationFrames !== undefined && number(event.frame ?? engine?.clock?.frame, 0) - startFrame >= number(node.config.durationFrames, 0)) return true;
    if (node.config.durationMs !== undefined && (number(event.elapsed ?? engine?.clock?.elapsed, 0) - startElapsed) * 1000 >= number(node.config.durationMs, 0)) return true;
    return false;
  }

  function processNodeEvent(node, event) {
    if (node.state !== SequenceNodeState.Running || !nodeAcceptsEvent(node, event)) return;

    const context = contextFor(node, event);
    const type = library.get(node.type);
    if (isFrameEvent(event)) type?.onFrame?.(node, context, event);
    else type?.onEvent?.(node, context, event);

    const matches = eventMatches(node, event);
    const hasExplicitListen = (node.listen?.length ?? 0) > 0 || node.until?.event !== undefined || node.config?.event !== undefined;
    if (matches || !hasExplicitListen && (
      node.completionMode === SequenceNodeCompletionMode.Condition ||
      node.completionMode === SequenceNodeCompletionMode.Timeout ||
      isFrameEvent(event)
    )) {
      applySequenceWrites(node.write, context);
    }

    for (const entry of node.emit ?? []) {
      const typeName = typeof entry === "string" ? entry : entry?.type ?? entry?.event;
      if (typeName && matches) api.dispatch(typeName, typeof entry === "object" ? entry.payload ?? {} : {}, { sourceNodeId: node.id });
    }

    if (node.completionMode === SequenceNodeCompletionMode.Event && (matches || shouldFinishFromCondition(node, event))) finishNode(node);
    else if (node.completionMode === SequenceNodeCompletionMode.Condition && shouldFinishFromCondition(node, event)) finishNode(node);
    else if (processTimeout(node, event)) finishNode(node);
  }

  function drainRuntimeQueue() {
    if (draining) return;
    draining = true;
    try {
      while (queue.length) {
        const event = queue.shift();
        bus.dispatch(event);
        for (const node of Array.from(nodeMap.values())) {
          processNodeEvent(node, event);
        }
      }
    } finally {
      draining = false;
    }
  }

  function normalizeMountInput(nodeOrNodes) {
    return asArray(normalizeSequenceNode(nodeOrNodes, library));
  }

  function mount(nodeOrNodes, mountOptions = {}) {
    const nodes = normalizeMountInput(nodeOrNodes);
    roots = mountOptions.replace ? nodes : [...roots, ...nodes];
    rebuild();
    for (const node of nodes) emitBus(SequenceNodeEventType.NodeMounted, { nodeId: node.id });
    if (mountOptions.autoStart) for (const node of nodes) startNode(node);
    return nodes.length === 1 ? nodes[0] : nodes;
  }

  function bindSurface(surface, surfaceOptions = {}) {
    if (!surface || typeof surface.subscribe !== "function") {
      throw new TypeError("bindSurface expects a subscribable surface.");
    }

    const unsubscribe = surface.subscribe((batch, context = {}) => {
      const records = Array.isArray(batch) ? batch : [batch];
      if (surface.kind === "event") {
        for (const record of records) {
          const type = record?.event?.name ?? surface.event?.name ?? surface.label;
          api.dispatch({ type, payload: record?.payload ?? record, source: "surface", meta: { surfaceKind: "event", surface: surface.label, context } });
          api.dispatch({ type: SequenceNodeEventType.SurfaceEvent, payload: record, source: "surface", meta: { surfaceKind: "event", surface: surface.label } });
        }
      } else if (surface.kind === "resource") {
        for (const record of records) {
          const type = `resource:${record?.resource?.name ?? surface.resource?.name ?? surface.label}`;
          api.dispatch({ type, payload: record, source: "surface", meta: { surfaceKind: "resource", surface: surface.label, context } });
          api.dispatch({ type: SequenceNodeEventType.SurfaceResource, payload: record, source: "surface", meta: { surfaceKind: "resource", surface: surface.label } });
        }
      } else if (surface.kind === "query") {
        api.dispatch({ type: `query:${surface.label}`, payload: batch, source: "surface", meta: { surfaceKind: "query", surface: surface.label, context } });
        api.dispatch({ type: SequenceNodeEventType.SurfaceQuery, payload: batch, source: "surface", meta: { surfaceKind: "query", surface: surface.label } });
      } else if (surface.kind === "lifecycle") {
        for (const record of records) {
          api.dispatch({ type: `lifecycle:${record?.topic ?? surface.label}`, payload: record, source: "surface", frame: record?.frame, delta: record?.delta, elapsed: record?.elapsed, meta: { surfaceKind: "lifecycle", surface: surface.label, context } });
          if (record?.topic === "tick") api.frame({ source: "surface", payload: record, frame: record.frame, delta: record.delta, elapsed: record.elapsed });
          api.dispatch({ type: SequenceNodeEventType.SurfaceLifecycle, payload: record, source: "surface", meta: { surfaceKind: "lifecycle", surface: surface.label } });
        }
      }
    });

    const cleanup = () => unsubscribe();
    unsubscribers.push(cleanup);
    if (surfaceOptions.track !== false) return cleanup;
    return cleanup;
  }

  function bindEngineSurfaces(planOrOptions = {}) {
    const warnings = [];
    if (!engine) {
      warnings.push("No engine is bound.");
      return { warnings, bound: [] };
    }
    const bound = [];
    for (const surface of planOrOptions.surfaces ?? []) {
      bound.push(bindSurface(surface));
    }
    return { warnings, bound };
  }

  function installRequiredKits(rootOrPlan, registry = kitRegistry) {
    const installed = [];
    const skipped = [];
    const missing = [];
    const warnings = [];
    const plan = rootOrPlan?.requiredKits ? rootOrPlan : createSequenceNodePlan(rootOrPlan, library);
    const kitSpecs = [];

    if (!rootOrPlan?.requiredKits) {
      for (const node of plan.nodes ?? []) kitSpecs.push(...(node.kits ?? []));
    }
    for (const id of plan.requiredKits ?? []) kitSpecs.push(id);

    for (const spec of kitSpecs) {
      const id = kitId(spec);
      if (!id) continue;
      if (engine?.kits?.some((kit) => kit.id === id || kit.provides?.includes(id))) {
        skipped.push(id);
        continue;
      }
      const factory = registry?.[id];
      if (!factory) {
        missing.push(id);
        warnings.push(`Missing SequenceNode kit: ${id}`);
        api.dispatch(SequenceNodeEventType.KitMissing, { id }, { source: "sequence-node-kit" });
        continue;
      }
      const kit = typeof factory === "function" ? factory(isObject(spec) ? spec.config ?? {} : {}) : factory;
      if (kit?.install && !kit.systems && !kit.components && !kit.resources && !kit.events) {
        kit.install(engine, isObject(spec) ? spec.config ?? {} : {});
      } else {
        engine?.installKit?.(kit, isObject(spec) ? spec.config ?? {} : {});
      }
      installed.push(id);
      api.dispatch(SequenceNodeEventType.KitInstalled, { id }, { source: "sequence-node-kit" });
    }

    return { installed: unique(installed), skipped: unique(skipped), missing: unique(missing), warnings };
  }

  const api = {
    bind(nextEngine) {
      engine = nextEngine;
      emitBus(SequenceNodeEventType.RuntimeMounted, { engineBound: Boolean(engine) });
      return api;
    },
    setLibrary(nextLibrary) {
      library = nextLibrary ?? createDefaultSequenceNodeLibrary();
      return api;
    },
    getLibrary() {
      return library;
    },
    registerType(typeDefinition) {
      return library.register(typeDefinition);
    },
    registerTypes(typeDefinitions = []) {
      library.registerMany(typeDefinitions);
      return api;
    },
    setKitRegistry(registry = {}) {
      kitRegistry = { ...registry };
      return api;
    },
    getKitRegistry() {
      return { ...kitRegistry };
    },
    mount,
    appendGraph(nodeOrNodes, mountOptions = {}) {
      return mount(nodeOrNodes, mountOptions);
    },
    setGraph(nodeOrNodes, mountOptions = {}) {
      return mount(nodeOrNodes, { ...mountOptions, replace: true });
    },
    unmount(id) {
      roots = roots.filter((root) => root.id !== id);
      rebuild();
      return true;
    },
    start(id, payload = {}) {
      return startNode(id, payload);
    },
    complete(id, payload = {}) {
      api.dispatch(SequenceNodeEventType.ManualComplete, payload, { manual: true, nodeId: id });
      return finishNode(id, payload);
    },
    fail(id, error = {}) {
      api.dispatch(SequenceNodeEventType.ManualFail, error, { manual: true, nodeId: id });
      return failNode(id, error);
    },
    cancel(id, reason = {}) {
      api.dispatch(SequenceNodeEventType.ManualCancel, reason, { manual: true, nodeId: id });
      return cancelOrSkip(id, SequenceNodeState.Cancelled, SequenceNodeEventType.NodeCancelled, reason);
    },
    skip(id, reason = {}) {
      return cancelOrSkip(id, SequenceNodeState.Skipped, SequenceNodeEventType.NodeSkipped, reason);
    },
    evaluate(id, event = null) {
      const node = nodeMap.get(id);
      if (!node) return false;
      const normalized = event ? createSequenceNodeEvent(event) : createSequenceNodeEvent(SequenceNodeEventType.Evaluate, {}, { manual: true, nodeId: id });
      processNodeEvent(node, normalized);
      return node.state;
    },
    dispatch(eventOrType, payload = {}, meta = {}) {
      if (disposed) return null;
      const event = createSequenceNodeEvent(eventOrType, payload, meta);
      queue.push(event);
      drainRuntimeQueue();
      return event;
    },
    frame(deltaOrEvent = null) {
      const event = isObject(deltaOrEvent)
        ? createSequenceNodeEvent({
          type: deltaOrEvent.type ?? SequenceNodeEventType.Frame,
          payload: deltaOrEvent.payload ?? {
            delta: deltaOrEvent.delta ?? engine?.clock?.delta ?? 0,
            frame: deltaOrEvent.frame ?? engine?.clock?.frame ?? null,
            elapsed: deltaOrEvent.elapsed ?? engine?.clock?.elapsed ?? null
          },
          source: deltaOrEvent.source ?? "runtime",
          frame: deltaOrEvent.frame ?? deltaOrEvent.payload?.frame ?? engine?.clock?.frame ?? null,
          delta: deltaOrEvent.delta ?? deltaOrEvent.payload?.delta ?? engine?.clock?.delta ?? null,
          elapsed: deltaOrEvent.elapsed ?? deltaOrEvent.payload?.elapsed ?? engine?.clock?.elapsed ?? null,
          meta: { ...(deltaOrEvent.meta ?? {}), driver: "frame" }
        })
        : createSequenceNodeEvent(SequenceNodeEventType.Frame, {
          delta: deltaOrEvent ?? engine?.clock?.delta ?? 0,
          frame: engine?.clock?.frame ?? null,
          elapsed: engine?.clock?.elapsed ?? null
        }, { driver: "frame" });
      queue.push(event);
      drainRuntimeQueue();
      return event;
    },
    tick(delta = null) {
      if (options.disableTickFrameDispatch) return api.snapshot();
      return api.frame(delta);
    },
    subscribe(typeOrPredicate, listener) {
      return bus.subscribe(typeOrPredicate, listener);
    },
    onAny(listener) {
      return bus.onAny(listener);
    },
    bindSurface,
    bindEngineSurfaces,
    bindFrameDriver() {
      return api;
    },
    unbindFrameDriver() {
      return api;
    },
    addSubscription(subscription) {
      if (!subscription) return api;
      if (typeof subscription === "function") {
        unsubscribers.push(subscription(api));
      } else if (subscription.event && subscription.thenSequence) {
        unsubscribers.push(api.subscribe(subscription.event, () => api.start(subscription.thenSequence)));
      } else if (subscription.event && subscription.thenDispatch) {
        unsubscribers.push(api.subscribe(subscription.event, (event) => api.dispatch(subscription.thenDispatch, event.payload)));
      }
      return api;
    },
    installRequiredKits,
    getNodeState(id) {
      return nodeMap.get(id)?.state ?? null;
    },
    getRunnerStates() {
      const out = {};
      for (const [id, node] of nodeMap.entries()) out[id] = { state: node.state, type: node.type };
      return out;
    },
    snapshot() {
      return {
        disposed,
        roots: roots.map(clone),
        nodes: Array.from(nodeMap.values()).map(clone),
        runnerStates: api.getRunnerStates(),
        events: bus.snapshot().history
      };
    },
    createPlan(rootIdOrNode) {
      const target = typeof rootIdOrNode === "string" ? nodeMap.get(rootIdOrNode) : rootIdOrNode ?? roots[0];
      return createSequenceNodePlan(target, library, { kitRegistry });
    },
    validate(rootIdOrNode) {
      const target = typeof rootIdOrNode === "string" ? nodeMap.get(rootIdOrNode) : rootIdOrNode ?? roots;
      return validateSequenceNode(target, library, {
        kitRegistry,
        eventSourcesKnown: true,
        frameBridge: engine?.driveSequenceNodesWithTick !== false
      });
    },
    dispose() {
      disposed = true;
      for (const unsubscribe of unsubscribers.splice(0)) {
        if (typeof unsubscribe === "function") unsubscribe();
      }
      bus.dispatch(SequenceNodeEventType.RuntimeDisposed, {});
      bus.dispose();
      queue = [];
      roots = [];
      rebuild();
    }
  };

  if (options.nodes) api.mount(options.nodes, { autoStart: options.autoStart });
  if (engine) api.bind(engine);
  return api;
}
