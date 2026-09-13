function assertFunction(value, message) {
  if (typeof value !== "function") {
    throw new TypeError(message);
  }
}

function createSurfaceBase(kind, label, metadata = {}) {
  const listeners = new Set();
  let current = kind === "query" ? { kind, current: [], entered: [], exited: [] } : [];
  let disposed = false;

  return {
    kind,
    label: label ?? kind,
    metadata: Object.freeze({ kind, label: label ?? kind, ...metadata }),

    subscribe(listener) {
      if (disposed) {
        throw new Error(`Cannot subscribe to a disposed ${kind} surface.`);
      }

      assertFunction(listener, `${kind} surface subscribers must be functions.`);
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    publish(batch, context = {}) {
      if (disposed) {
        return batch;
      }

      current = batch;

      for (const listener of Array.from(listeners)) {
        listener(batch, context);
      }

      return batch;
    },

    snapshot() {
      return current;
    },

    dispose() {
      disposed = true;
      listeners.clear();
    }
  };
}

export function createEventSurface(eventDefinition, options = {}) {
  if (!eventDefinition || eventDefinition.kind !== "event") {
    throw new TypeError("createEventSurface expects an event definition.");
  }

  return Object.freeze({
    ...createSurfaceBase("event", options.label ?? eventDefinition.name, {
      event: eventDefinition
    }),
    event: eventDefinition
  });
}

export function createResourceSurface(resourceDefinition, options = {}) {
  if (!resourceDefinition || resourceDefinition.kind !== "resource") {
    throw new TypeError("createResourceSurface expects a resource definition.");
  }

  return Object.freeze({
    ...createSurfaceBase("resource", options.label ?? resourceDefinition.name, {
      resource: resourceDefinition
    }),
    resource: resourceDefinition
  });
}

export function createQuerySurface(components, options = {}) {
  if (!Array.isArray(components) || components.length === 0) {
    throw new TypeError("createQuerySurface expects a non-empty component array.");
  }

  return {
    ...createSurfaceBase("query", options.label ?? components.map((component) => component.name).join("+"), {
      components: components.slice()
    }),
    components: components.slice(),
    initialized: false,
    members: new Set()
  };
}

export function createLifecycleSurface(options = {}) {
  const topics = Array.isArray(options) ? options : options.topics;
  const normalizedTopics = Array.isArray(topics) && topics.length > 0
    ? topics.slice()
    : ["tick", "phase", "entity", "component"];

  return Object.freeze({
    ...createSurfaceBase("lifecycle", (options && options.label) ?? "lifecycle", {
      topics: normalizedTopics
    }),
    topics: normalizedTopics,
    includesTopic(topic) {
      return normalizedTopics.includes(topic);
    }
  });
}
