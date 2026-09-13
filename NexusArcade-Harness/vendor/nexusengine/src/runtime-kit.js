import { registerDomainPathForKit } from "./domain-path.js";

function objectValues(input) {
  return input && typeof input === "object" ? Object.values(input) : [];
}

function normalizeSystemEntry(entry) {
  if (typeof entry === "function") {
    return { phase: "simulate", system: entry, name: entry.name || "anonymousSystem" };
  }

  if (!entry || typeof entry !== "object" || typeof entry.system !== "function") {
    throw new TypeError("Runtime kit systems must be functions or { phase, system } entries.");
  }

  return {
    phase: entry.phase ?? "simulate",
    system: entry.system,
    name: entry.name ?? entry.system.name ?? "anonymousSystem"
  };
}

function normalizeTokenList(value, fieldName, kitId) {
  if (value === undefined || value === null) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];
  return values.map((entry) => {
    if (typeof entry !== "string" || entry.trim().length === 0) {
      throw new TypeError(`Runtime kit ${kitId} has an invalid ${fieldName} entry.`);
    }
    return entry;
  });
}

function kitFingerprint(kit) {
  const value = kit?.metadata?.contentFingerprint ?? kit?.metadata?.manifestFingerprint ?? null;
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value) ? value : null;
}

function findInstalledKit(engine, kit) {
  if (!Array.isArray(engine.kits)) engine.kits = [];
  if (engine.kits.includes(kit)) return kit;
  return engine.kits.find((entry) => entry?.id === kit.id) ?? null;
}

export function defineRuntimeKit(config = {}) {
  const kit = {
    id: config.id ?? "runtime-kit",
    components: config.components ?? {},
    resources: config.resources ?? {},
    events: config.events ?? {},
    systems: (config.systems ?? []).map(normalizeSystemEntry),
    shaders: config.shaders ?? [],
    materials: config.materials ?? [],
    sequences: config.sequences ?? [],
    subscriptions: config.subscriptions ?? [],
    sequenceNodes: Object.freeze([...(config.sequenceNodes ?? [])]),
    sequenceNodeTypes: Object.freeze([...(config.sequenceNodeTypes ?? [])]),
    sequenceNodeSubscriptions: Object.freeze([...(config.sequenceNodeSubscriptions ?? [])]),
    sequenceNodeOptions: Object.freeze({ ...(config.sequenceNodeOptions ?? {}) }),
    requires: normalizeTokenList(config.requires, "requires", config.id ?? "runtime-kit"),
    provides: normalizeTokenList(config.provides, "provides", config.id ?? "runtime-kit"),
    bindings: Object.freeze({ ...(config.bindings ?? {}) }),
    initWorld: config.initWorld,
    install: config.install,
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  };

  return Object.freeze(kit);
}

export function validateRuntimeKit(kit) {
  if (!kit || typeof kit !== "object") {
    throw new TypeError("validateRuntimeKit expects a runtime kit object.");
  }

  for (const definition of objectValues(kit.components)) {
    if (definition.kind !== "component") {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid component definition.`);
    }
  }

  for (const definition of objectValues(kit.resources)) {
    if (definition.kind !== "resource") {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid resource definition.`);
    }
  }

  for (const definition of objectValues(kit.events)) {
    if (definition.kind !== "event") {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid event definition.`);
    }
  }

  for (const entry of kit.systems ?? []) {
    if (!entry.phase || typeof entry.system !== "function") {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid system entry.`);
    }
  }

  for (const token of kit.requires ?? []) {
    if (typeof token !== "string" || token.trim().length === 0) {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid requires entry.`);
    }
  }

  for (const token of kit.provides ?? []) {
    if (typeof token !== "string" || token.trim().length === 0) {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid provides entry.`);
    }
  }

  for (const [field, value] of [
    ["sequenceNodes", kit.sequenceNodes],
    ["sequenceNodeTypes", kit.sequenceNodeTypes],
    ["sequenceNodeSubscriptions", kit.sequenceNodeSubscriptions]
  ]) {
    if (value !== undefined && !Array.isArray(value)) {
      throw new TypeError(`Runtime kit ${kit.id} has an invalid ${field} field.`);
    }
  }

  if (kit.sequenceNodeOptions !== undefined && (!kit.sequenceNodeOptions || typeof kit.sequenceNodeOptions !== "object" || Array.isArray(kit.sequenceNodeOptions))) {
    throw new TypeError(`Runtime kit ${kit.id} has an invalid sequenceNodeOptions field.`);
  }

  return kit;
}

export function installRuntimeKit(engine, kit, options = {}) {
  validateRuntimeKit(kit);

  if (!engine || !engine.scheduler || !engine.world) {
    throw new TypeError("installRuntimeKit expects a NexusEngine engine.");
  }

  const installed = findInstalledKit(engine, kit);
  if (installed) {
    if (installed === kit) return installed;
    const installedFingerprint = kitFingerprint(installed);
    const incomingFingerprint = kitFingerprint(kit);
    if (installedFingerprint && installedFingerprint === incomingFingerprint) return installed;
    throw new TypeError(`Runtime kit ${kit.id} is already installed with different content.`);
  }

  if (kit.metadata?.kind === "domain-service-kit") {
    if (!engine.domainServiceKits || typeof engine.domainServiceKits !== "object") {
      engine.domainServiceKits = {};
    }
    const installedProvides = new Set(engine.kits.flatMap((entry) => entry.provides ?? []));
    const missing = (kit.requires ?? []).filter((token) => !installedProvides.has(token));
    if (missing.length) {
      throw new TypeError(`Domain service kit ${kit.id} requires missing token(s): ${missing.join(", ")}.`);
    }
    registerDomainPathForKit(engine, kit);
    engine.domainServiceKits[kit.id] = kit.metadata;
  } else if (kit.metadata?.domainPath) {
    registerDomainPathForKit(engine, kit);
  }

  engine.kit = kit;

  if (!engine.kitBindings || typeof engine.kitBindings !== "object") {
    engine.kitBindings = {};
  }
  for (const [name, binding] of Object.entries(kit.bindings ?? {})) {
    engine.kitBindings[name] = binding;
  }

  engine.kits.push(kit);

  if (typeof kit.initWorld === "function") {
    kit.initWorld({ engine, world: engine.world, kit, options });
  }

  for (const shader of kit.shaders ?? []) {
    engine.shaderRegistry?.register(shader);
  }

  for (const material of kit.materials ?? []) {
    engine.materialRegistry?.register(material);
  }

  for (const entry of kit.systems ?? []) {
    engine.scheduler.addSystem(entry.phase, entry.system);
  }

  if (engine.sequenceRuntime && kit.sequences?.length) {
    if (engine.sequenceRuntime.appendGraph) {
      engine.sequenceRuntime.appendGraph(kit.sequences);
    } else {
      engine.sequenceRuntime.setGraph(kit.sequences);
    }
    for (const subscription of kit.subscriptions ?? []) {
      engine.sequenceRuntime.addSubscription(subscription);
    }
  }

  if (engine.sequenceNodeRuntime) {
    if (kit.sequenceNodeTypes?.length) {
      engine.sequenceNodeRuntime.registerTypes(kit.sequenceNodeTypes);
    }

    if (kit.sequenceNodes?.length) {
      engine.sequenceNodeRuntime.appendGraph(kit.sequenceNodes, kit.sequenceNodeOptions ?? {});
    }

    for (const subscription of kit.sequenceNodeSubscriptions ?? []) {
      engine.sequenceNodeRuntime.addSubscription(subscription);
    }

    if (kit.sequenceNodeOptions?.bindFrameDriver) {
      engine.sequenceNodeRuntime.bindFrameDriver(kit.sequenceNodeOptions);
    }

    if (kit.sequenceNodeOptions?.bindSurfaces) {
      engine.sequenceNodeRuntime.bindEngineSurfaces(kit.sequenceNodeOptions);
    }

    if (kit.sequenceNodeOptions?.autoStart) {
      for (const node of kit.sequenceNodes ?? []) {
        if (node?.id) engine.sequenceNodeRuntime.start(node.id);
      }
    }
  }

  if (typeof kit.install === "function") {
    kit.install({ engine, world: engine.world, kit, options });
  }

  return kit;
}
