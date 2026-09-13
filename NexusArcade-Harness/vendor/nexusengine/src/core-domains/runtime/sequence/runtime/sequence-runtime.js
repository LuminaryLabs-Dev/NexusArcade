export const SequenceLifecycle = Object.freeze({
  Idle: "Idle",
  Loading: "Loading",
  Loaded: "Loaded",
  Running: "Running",
  Complete: "Complete",
  Unloading: "Unloading",
  Unloaded: "Unloaded"
});

export const CompletionMode = Object.freeze({
  LinearChildren: "linear",
  AllChildren: "all",
  AnyChild: "any"
});

class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener);
    if (set.size === 0) this.listeners.delete(event);
  }

  emit(event, payload) {
    for (const listener of Array.from(this.listeners.get(event) ?? [])) {
      listener(payload);
    }
  }
}

export class BaseSequence {
  static id = "Base";
  static displayName = "Base";
  static canHaveChildren = false;
  static descriptor = { settings: [], invokes: [], events: [] };

  static defaultParams() {
    return {};
  }

  constructor() {
    this.emitter = new Emitter();
    this.lifecycle = SequenceLifecycle.Idle;
  }

  on(event, listener) {
    return this.emitter.on(event, listener);
  }

  setLifecycle(next) {
    if (this.lifecycle === next) return;
    this.lifecycle = next;
    this.emitter.emit("lifecycle", { sequence: this, lifecycle: next });
    this.emitter.emit(next, { sequence: this, lifecycle: next });
  }

  load() {}
  unload() {}
  start() {}

  invoke(node, state, name, params = {}, context = {}) {
    state.invokes = [...(state.invokes ?? []), { name, params, context }];
    return state;
  }

  tick() {
    return { status: "completed" };
  }
}

export class GroupSequence extends BaseSequence {
  static id = "Group";
  static displayName = "Group";
  static canHaveChildren = true;
}

export class WaitForSequence extends BaseSequence {
  static id = "WaitForSequence";
  static displayName = "Wait For Sequence";
  static descriptor = {
    settings: [{ name: "ref", type: "string" }],
    invokes: [],
    events: []
  };

  static defaultParams() {
    return { ref: "" };
  }

  tick(node, state, context) {
    const ref = node?.params?.ref;
    if (!ref) return { status: "skipped" };
    return context.runnerStates?.[ref]?.status === "completed"
      ? { status: "completed" }
      : { status: "running" };
  }
}

export class WaitForEventSequence extends BaseSequence {
  static id = "WaitForEventSequence";
  static displayName = "Wait For Event";
  static descriptor = {
    settings: [{ name: "event", type: "string" }],
    invokes: [{ name: "notify", params: [{ name: "event", type: "object" }] }],
    events: []
  };

  static defaultParams() {
    return { event: "" };
  }

  invoke(node, state, name, params = {}) {
    if (name === "notify") {
      const expected = node?.params?.event;
      const actual = params.eventName ?? params.event?.event?.name ?? params.event;
      if (!expected || expected === actual) {
        state.received = true;
      }
    }
    return state;
  }

  tick(node, state) {
    return state.received ? { status: "completed" } : { status: "running" };
  }
}

export class UIControllerSequence extends BaseSequence {
  static id = "UIControllerSequence";
  static displayName = "UI Controller";
  static descriptor = {
    settings: [{ name: "panel", type: "string" }, { name: "action", type: "string" }],
    invokes: [{ name: "setPanel", params: [{ name: "panel", type: "string" }] }],
    events: []
  };

  tick(node, state, context) {
    const handler = context.engine?.kit?.invokes?.setPanel
      ?? context.engine?.sequenceControllers?.setPanel;
    if (typeof handler === "function") {
      handler({
        ...context,
        node,
        state,
        panel: node?.params?.panel,
        action: node?.params?.action
      });
    }
    return { status: "completed" };
  }
}

export class EntityControllerSequence extends BaseSequence {
  static id = "EntityControllerSequence";
  static displayName = "Entity Controller";
  static descriptor = {
    settings: [{ name: "invoke", type: "string" }],
    invokes: [{ name: "run", params: [] }],
    events: []
  };

  tick(node, state, context) {
    const invokeName = node?.invoke ?? node?.params?.invoke;
    const handler = context.engine?.kit?.invokes?.[invokeName];
    if (typeof handler === "function") {
      handler({ ...context, node, state });
      return { status: "completed" };
    }
    return invokeName ? { status: "skipped" } : { status: "completed" };
  }
}

export const DefaultSequenceRegistry = Object.freeze({
  [GroupSequence.id]: GroupSequence,
  [WaitForSequence.id]: WaitForSequence,
  [WaitForEventSequence.id]: WaitForEventSequence,
  [UIControllerSequence.id]: UIControllerSequence,
  [EntityControllerSequence.id]: EntityControllerSequence
});

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function flatten(nodes, out = new Map()) {
  for (const node of safeArray(nodes)) {
    if (node?.id) out.set(node.id, node);
    flatten(node?.children, out);
  }
  return out;
}

function findEventDefinition(engine, eventName) {
  for (const kit of [engine?.kit, ...(engine?.kits ?? [])].filter(Boolean)) {
    const event = kit.events?.[eventName] ?? Object.values(kit.events ?? {}).find((definition) => definition.name === eventName);
    if (event) return event;
  }
  return null;
}

export function createSequenceRuntime(options = {}) {
  const registry = { ...DefaultSequenceRegistry, ...(options.registry ?? {}) };
  const runtime = {};
  const activeRoots = new Set();
  let graph = safeArray(options.sequences);
  let nodeMap = flatten(graph);
  const pendingSubscriptions = [];
  const unsubscribers = [];
  let engine = options.engine ?? null;

  function getType(node) {
    return registry[node?.type] ?? registry.Group;
  }

  function ensureState(node) {
    if (!node?.id) return null;
    if (runtime[node.id]) return runtime[node.id];
    const Type = getType(node);
    runtime[node.id] = {
      id: node.id,
      type: node.type,
      sequence: new Type(),
      lifecycle: SequenceLifecycle.Idle,
      status: undefined,
      started: false,
      childIndex: 0,
      forceSkip: false
    };
    return runtime[node.id];
  }

  function setLifecycle(state, next) {
    if (!state || state.lifecycle === next) return;
    state.lifecycle = next;
    state.sequence?.setLifecycle?.(next);
  }

  function finish(node, state, status, context) {
    setLifecycle(state, SequenceLifecycle.Complete);
    state.status = status || state.status || "completed";
    setLifecycle(state, SequenceLifecycle.Unloading);
    state.sequence?.unload?.(node, state, context);
    setLifecycle(state, SequenceLifecycle.Unloaded);
    return true;
  }

  function tickLeaf(node, state, context) {
    if (state.lifecycle === SequenceLifecycle.Idle) {
      setLifecycle(state, SequenceLifecycle.Loading);
      state.sequence?.load?.(node, state, context);
      setLifecycle(state, SequenceLifecycle.Loaded);
      setLifecycle(state, SequenceLifecycle.Running);
    }

    if (state.forceSkip) {
      return finish(node, state, "skipped", context);
    }

    if (!state.started) {
      state.started = true;
      state.sequence?.start?.(node, state, context);
    }

    const result = state.sequence?.tick?.(node, state, context) ?? { status: "completed" };
    if (result.status === "running") {
      state.status = "running";
      return false;
    }
    return finish(node, state, result.status ?? "completed", context);
  }

  function tickGroup(node, state, context) {
    if (state.lifecycle === SequenceLifecycle.Idle) {
      setLifecycle(state, SequenceLifecycle.Loading);
      state.sequence?.load?.(node, state, context);
      setLifecycle(state, SequenceLifecycle.Loaded);
      setLifecycle(state, SequenceLifecycle.Running);
      state.childIndex = 0;
    }

    const children = safeArray(node?.children);
    if (!children.length) {
      return finish(node, state, "completed", context);
    }

    const mode = node?.completionMode ?? CompletionMode.LinearChildren;
    if (mode === CompletionMode.LinearChildren) {
      while (state.childIndex < children.length) {
        const done = tickNode(children[state.childIndex], context);
        if (!done) {
          state.status = "running";
          return false;
        }
        state.childIndex += 1;
      }
      return finish(node, state, "completed", context);
    }

    let completeCount = 0;
    for (const child of children) {
      const childState = ensureState(child);
      if (childState.lifecycle !== SequenceLifecycle.Unloaded) {
        tickNode(child, context);
      }
      if (childState.status === "completed") completeCount += 1;
    }

    if (mode === CompletionMode.AnyChild && completeCount > 0) {
      for (const child of children) {
        const childState = ensureState(child);
        if (childState.lifecycle !== SequenceLifecycle.Unloaded) childState.forceSkip = true;
      }
      return finish(node, state, "completed", context);
    }

    if (mode === CompletionMode.AllChildren && completeCount === children.length) {
      return finish(node, state, "completed", context);
    }

    state.status = "running";
    return false;
  }

  function tickNode(node, context) {
    if (!node?.id) return true;
    const state = ensureState(node);
    if (!state || state.lifecycle === SequenceLifecycle.Unloaded) return true;
    const Type = getType(node);
    return Type.canHaveChildren ? tickGroup(node, state, context) : tickLeaf(node, state, context);
  }

  function getRunnerStates() {
    const out = {};
    for (const [id, state] of Object.entries(runtime)) {
      out[id] = { status: state.status, lifecycle: state.lifecycle };
    }
    return out;
  }

  function start(id) {
    if (!nodeMap.has(id)) {
      return false;
    }
    const state = runtime[id];
    if (state?.lifecycle === SequenceLifecycle.Unloaded) {
      delete runtime[id];
    }
    activeRoots.add(id);
    return true;
  }

  function invoke(id, name, params = {}, extra = {}) {
    const node = nodeMap.get(id);
    if (!node) return false;
    const state = ensureState(node);
    state.sequence?.invoke?.(node, state, name, params, {
      ...extra,
      engine,
      world: engine?.world,
      runnerStates: getRunnerStates()
    });
    return true;
  }

  function bindSubscription(subscription) {
    if (!engine || !subscription?.event) return;
    const eventDefinition = findEventDefinition(engine, subscription.event);
    if (!eventDefinition) {
      pendingSubscriptions.push(subscription);
      return;
    }
    const surface = engine.eventSurface(eventDefinition, { label: `sequence:${subscription.event}` });
    const unsubscribe = surface.subscribe((batch) => {
      for (const record of batch) {
        if (subscription.thenSequence) start(subscription.thenSequence);
        if (subscription.thenInvoke) {
          const [target, method = "notify"] = String(subscription.thenInvoke).split(":");
          invoke(target, method, { ...subscription.params, event: record, eventName: eventDefinition.name });
        }
      }
    });
    unsubscribers.push(() => {
      unsubscribe();
      engine.unregisterSurface(surface);
    });
  }

  const api = {
    bind(nextEngine) {
      engine = nextEngine;
      while (pendingSubscriptions.length) {
        bindSubscription(pendingSubscriptions.shift());
      }
      return api;
    },
    setGraph(nodes = []) {
      graph = safeArray(nodes);
      nodeMap = flatten(graph);
      return api;
    },
    appendGraph(nodes = []) {
      graph = [...graph, ...safeArray(nodes)];
      nodeMap = flatten(graph);
      return api;
    },
    addSubscription(subscription) {
      bindSubscription(subscription);
      return api;
    },
    start,
    cancel(id) {
      activeRoots.delete(id);
      return true;
    },
    invoke,
    tick(delta = 1 / 60) {
      const context = {
        engine,
        world: engine?.world,
        delta,
        clock: engine?.clock,
        runnerStates: getRunnerStates()
      };
      for (const id of Array.from(activeRoots)) {
        const node = nodeMap.get(id);
        const done = tickNode(node, context);
        if (done) activeRoots.delete(id);
      }
      return getRunnerStates();
    },
    getRunnerStates,
    listDescriptors() {
      return Object.values(registry).map((Type) => ({
        id: Type.id,
        displayName: Type.displayName,
        canHaveChildren: Boolean(Type.canHaveChildren),
        ...(Type.descriptor ?? {})
      }));
    },
    dispose() {
      for (const unsubscribe of unsubscribers.splice(0)) unsubscribe();
    }
  };

  return api.bind(engine);
}
