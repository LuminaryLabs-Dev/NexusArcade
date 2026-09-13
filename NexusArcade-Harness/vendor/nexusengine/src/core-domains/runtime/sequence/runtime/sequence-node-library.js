const COMPLETION = Object.freeze({
  Sequence: "sequence",
  All: "all",
  Any: "any",
  Race: "race",
  Event: "event",
  Condition: "condition",
  Manual: "manual",
  Timeout: "timeout"
});

const DRIVER = Object.freeze({
  Event: "event",
  Frame: "frame",
  Surface: "surface",
  Manual: "manual",
  Timer: "timer",
  Hybrid: "hybrid"
});

function list(value) {
  return Array.isArray(value) ? value.slice() : [];
}

function defaultResult() {
  return { errors: [], warnings: [] };
}

function normalizeType(definition = {}) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError("defineSequenceNodeType expects an object.");
  }

  if (typeof definition.type !== "string" || definition.type.trim().length === 0) {
    throw new TypeError("SequenceNode type definitions require a non-empty type.");
  }

  const defaultCompletionMode = definition.defaultCompletionMode ?? COMPLETION.Manual;
  const defaultDriver = definition.defaultDriver ?? DRIVER.Event;

  return Object.freeze({
    type: definition.type,
    title: definition.title ?? definition.type,
    description: definition.description ?? "",
    inputs: Object.freeze(list(definition.inputs)),
    outputs: Object.freeze(list(definition.outputs)),
    requiredKits: Object.freeze(list(definition.requiredKits)),
    requiredEvents: Object.freeze(list(definition.requiredEvents)),
    requiredResources: Object.freeze(list(definition.requiredResources)),
    requiredSurfaces: Object.freeze(list(definition.requiredSurfaces)),
    requiredDrivers: Object.freeze(list(definition.requiredDrivers)),
    defaultCompletionMode,
    allowedCompletionModes: Object.freeze(list(definition.allowedCompletionModes).length
      ? list(definition.allowedCompletionModes)
      : [defaultCompletionMode]),
    defaultDriver,
    allowedDrivers: Object.freeze(list(definition.allowedDrivers).length
      ? list(definition.allowedDrivers)
      : [defaultDriver]),
    validateConfig: definition.validateConfig ?? defaultResult,
    onEnter: definition.onEnter,
    onEvent: definition.onEvent,
    onFrame: definition.onFrame,
    onExit: definition.onExit,
    plan: definition.plan
  });
}

export function defineSequenceNodeType(definition) {
  return normalizeType(definition);
}

export function createSequenceNodeLibrary(entries = []) {
  const types = new Map();

  const api = {
    register(typeDefinition) {
      const normalized = normalizeType(typeDefinition);
      types.set(normalized.type, normalized);
      return normalized;
    },
    registerMany(typeDefinitions = []) {
      for (const entry of typeDefinitions) {
        api.register(entry);
      }
      return api;
    },
    get(type) {
      return types.get(type) ?? null;
    },
    has(type) {
      return types.has(type);
    },
    list() {
      return Array.from(types.values());
    },
    validateNode(node) {
      const errors = [];
      const warnings = [];
      const type = api.get(node?.type);

      if (!type) {
        errors.push({ nodeId: node?.id ?? null, code: "unknown_type", message: `Unknown SequenceNode type: ${node?.type}` });
        return { ok: false, errors, warnings };
      }

      if (!type.allowedCompletionModes.includes(node.completionMode)) {
        errors.push({
          nodeId: node.id,
          code: "invalid_completion_mode",
          message: `${node.type} does not allow completionMode ${node.completionMode}.`
        });
      }

      if (!type.allowedDrivers.includes(node.driver)) {
        errors.push({
          nodeId: node.id,
          code: "invalid_driver",
          message: `${node.type} does not allow driver ${node.driver}.`
        });
      }

      const configResult = type.validateConfig?.(node.config ?? {}, node, { library: api }) ?? defaultResult();
      for (const error of configResult.errors ?? []) errors.push({ nodeId: node.id, code: "config", message: String(error) });
      for (const warning of configResult.warnings ?? []) warnings.push({ nodeId: node.id, code: "config", message: String(warning) });

      return { ok: errors.length === 0, errors, warnings };
    }
  };

  api.registerMany(entries);
  return api;
}

function eventType(type, extra = {}) {
  return {
    type,
    title: extra.title ?? type,
    description: extra.description ?? "",
    defaultCompletionMode: extra.defaultCompletionMode ?? COMPLETION.Event,
    allowedCompletionModes: extra.allowedCompletionModes ?? [COMPLETION.Event, COMPLETION.Condition, COMPLETION.Manual],
    defaultDriver: extra.defaultDriver ?? DRIVER.Event,
    allowedDrivers: extra.allowedDrivers ?? [DRIVER.Event, DRIVER.Surface, DRIVER.Hybrid],
    requiredKits: extra.requiredKits ?? [],
    requiredEvents: extra.requiredEvents ?? [],
    requiredResources: extra.requiredResources ?? [],
    requiredSurfaces: extra.requiredSurfaces ?? [],
    requiredDrivers: extra.requiredDrivers ?? [],
    validateConfig: extra.validateConfig,
    onEnter: extra.onEnter,
    onEvent: extra.onEvent,
    onFrame: extra.onFrame,
    onExit: extra.onExit,
    plan: extra.plan
  };
}

export const BuiltInSequenceNodeTypes = Object.freeze([
  eventType("flow", {
    title: "Flow",
    defaultCompletionMode: COMPLETION.Sequence,
    allowedCompletionModes: [COMPLETION.Sequence, COMPLETION.All, COMPLETION.Any, COMPLETION.Race, COMPLETION.Manual, COMPLETION.Event, COMPLETION.Condition],
    defaultDriver: DRIVER.Hybrid,
    allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Frame, DRIVER.Manual, DRIVER.Hybrid]
  }),
  eventType("group", {
    title: "Group",
    defaultCompletionMode: COMPLETION.Sequence,
    allowedCompletionModes: [COMPLETION.Sequence, COMPLETION.All, COMPLETION.Any, COMPLETION.Race, COMPLETION.Manual, COMPLETION.Event, COMPLETION.Condition],
    defaultDriver: DRIVER.Hybrid,
    allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Frame, DRIVER.Manual, DRIVER.Hybrid]
  }),
  eventType("phase", {
    title: "Phase",
    defaultCompletionMode: COMPLETION.Sequence,
    allowedCompletionModes: [COMPLETION.Sequence, COMPLETION.All, COMPLETION.Any, COMPLETION.Race, COMPLETION.Manual, COMPLETION.Event, COMPLETION.Condition],
    defaultDriver: DRIVER.Hybrid,
    allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Frame, DRIVER.Manual, DRIVER.Hybrid]
  }),
  eventType("objective", {
    title: "Objective",
    defaultCompletionMode: COMPLETION.Sequence,
    allowedCompletionModes: [COMPLETION.Sequence, COMPLETION.All, COMPLETION.Any, COMPLETION.Race, COMPLETION.Event, COMPLETION.Condition, COMPLETION.Manual],
    defaultDriver: DRIVER.Hybrid,
    allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Frame, DRIVER.Manual, DRIVER.Hybrid]
  }),
  eventType("playerVerb", {
    title: "Player Verb",
    defaultCompletionMode: COMPLETION.Event,
    defaultDriver: DRIVER.Event
  }),
  eventType("waitForEvent", {
    title: "Wait For Event",
    defaultCompletionMode: COMPLETION.Event,
    defaultDriver: DRIVER.Event,
    validateConfig(config, node) {
      const hasEvent = typeof config.event === "string" || (Array.isArray(node.listen) && node.listen.length > 0);
      return hasEvent ? defaultResult() : { errors: ["waitForEvent requires config.event or listen."], warnings: [] };
    }
  }),
  eventType("waitForResourceCondition", {
    title: "Wait For Resource Condition",
    defaultCompletionMode: COMPLETION.Condition,
    allowedCompletionModes: [COMPLETION.Condition, COMPLETION.Manual],
    defaultDriver: DRIVER.Surface,
    allowedDrivers: [DRIVER.Surface, DRIVER.Hybrid],
    requiredSurfaces: ["resource"]
  }),
  eventType("waitForQueryEnter", {
    title: "Wait For Query Enter",
    defaultCompletionMode: COMPLETION.Event,
    defaultDriver: DRIVER.Surface,
    allowedDrivers: [DRIVER.Surface, DRIVER.Hybrid],
    requiredSurfaces: ["query"]
  }),
  eventType("emitEvent", {
    title: "Emit Event",
    defaultCompletionMode: COMPLETION.Manual,
    allowedCompletionModes: [COMPLETION.Manual],
    defaultDriver: DRIVER.Manual,
    allowedDrivers: [DRIVER.Manual]
  }),
  eventType("setState", {
    title: "Set State",
    defaultCompletionMode: COMPLETION.Manual,
    allowedCompletionModes: [COMPLETION.Manual],
    defaultDriver: DRIVER.Manual,
    allowedDrivers: [DRIVER.Manual]
  }),
  eventType("installKit", {
    title: "Install Kit",
    defaultCompletionMode: COMPLETION.Manual,
    allowedCompletionModes: [COMPLETION.Manual],
    defaultDriver: DRIVER.Manual,
    allowedDrivers: [DRIVER.Manual],
    plan(node) {
      return node.config?.kit ? { requiredKits: [node.config.kit] } : {};
    }
  }),
  eventType("subscribeSurface", {
    title: "Subscribe Surface",
    defaultCompletionMode: COMPLETION.Manual,
    allowedCompletionModes: [COMPLETION.Manual],
    defaultDriver: DRIVER.Manual,
    allowedDrivers: [DRIVER.Manual, DRIVER.Surface],
    requiredSurfaces: ["event", "resource", "query", "lifecycle"]
  }),
  eventType("collect", {
    title: "Collect",
    defaultCompletionMode: COMPLETION.Condition,
    allowedCompletionModes: [COMPLETION.Condition, COMPLETION.Event, COMPLETION.Manual],
    defaultDriver: DRIVER.Hybrid,
    allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Hybrid]
  }),
  eventType("reachZone", { title: "Reach Zone", defaultDriver: DRIVER.Hybrid, allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Hybrid] }),
  eventType("surviveDuration", {
    title: "Survive Duration",
    defaultCompletionMode: COMPLETION.Timeout,
    allowedCompletionModes: [COMPLETION.Timeout, COMPLETION.Condition, COMPLETION.Manual],
    defaultDriver: DRIVER.Timer,
    allowedDrivers: [DRIVER.Timer, DRIVER.Frame, DRIVER.Hybrid]
  }),
  eventType("timingWindow", {
    title: "Timing Window",
    defaultCompletionMode: COMPLETION.Condition,
    allowedCompletionModes: [COMPLETION.Condition, COMPLETION.Event, COMPLETION.Manual],
    defaultDriver: DRIVER.Frame,
    allowedDrivers: [DRIVER.Frame, DRIVER.Hybrid]
  }),
  eventType("routeFollow", { title: "Route Follow", defaultDriver: DRIVER.Hybrid, allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Hybrid] }),
  eventType("cargoPickup", { title: "Cargo Pickup", defaultDriver: DRIVER.Hybrid, allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Hybrid] }),
  eventType("vehicleControl", {
    title: "Vehicle Control",
    defaultCompletionMode: COMPLETION.Condition,
    allowedCompletionModes: [COMPLETION.Condition, COMPLETION.Event, COMPLETION.Manual],
    defaultDriver: DRIVER.Frame,
    allowedDrivers: [DRIVER.Frame, DRIVER.Event, DRIVER.Surface, DRIVER.Hybrid]
  }),
  eventType("waterHazardResponse", {
    title: "Water Hazard Response",
    defaultCompletionMode: COMPLETION.Condition,
    allowedCompletionModes: [COMPLETION.Condition, COMPLETION.Event, COMPLETION.Manual],
    defaultDriver: DRIVER.Hybrid,
    allowedDrivers: [DRIVER.Event, DRIVER.Surface, DRIVER.Frame, DRIVER.Hybrid]
  }),
  eventType("cameraBeat", {
    title: "Camera Beat",
    defaultCompletionMode: COMPLETION.Timeout,
    allowedCompletionModes: [COMPLETION.Timeout, COMPLETION.Manual],
    defaultDriver: DRIVER.Timer,
    allowedDrivers: [DRIVER.Timer, DRIVER.Frame, DRIVER.Hybrid]
  }),
  eventType("telemetryMark", {
    title: "Telemetry Mark",
    defaultCompletionMode: COMPLETION.Manual,
    allowedCompletionModes: [COMPLETION.Manual],
    defaultDriver: DRIVER.Manual,
    allowedDrivers: [DRIVER.Manual]
  }),
  eventType("frameCondition", {
    title: "Frame Condition",
    defaultCompletionMode: COMPLETION.Condition,
    allowedCompletionModes: [COMPLETION.Condition, COMPLETION.Manual],
    defaultDriver: DRIVER.Frame,
    allowedDrivers: [DRIVER.Frame, DRIVER.Hybrid],
    requiredDrivers: [DRIVER.Frame]
  })
].map(defineSequenceNodeType));

export function createDefaultSequenceNodeLibrary() {
  return createSequenceNodeLibrary(BuiltInSequenceNodeTypes);
}
