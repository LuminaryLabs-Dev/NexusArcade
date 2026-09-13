import { defineRuntimeKit } from "../../../../runtime-kit.js";
import {
  createSequenceNodePlan,
  validateSequenceNode
} from "./sequence-node-runtime.js";

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function kitId(kit) {
  return typeof kit === "string" ? kit : kit?.id;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function installSequenceNodeKits(engine, rootOrPlan, kitRegistry = {}, options = {}) {
  const runtime = options.runtime ?? engine?.sequenceNodeRuntime;
  const library = options.library ?? runtime?.getLibrary?.();
  const plan = rootOrPlan?.requiredKits ? rootOrPlan : createSequenceNodePlan(rootOrPlan, library);
  const specs = [];
  const installed = [];
  const skipped = [];
  const missing = [];
  const warnings = [];

  if (!rootOrPlan?.requiredKits) {
    for (const node of plan.nodes ?? []) specs.push(...(node.kits ?? []));
  }

  for (const id of plan.requiredKits ?? []) specs.push(id);

  for (const spec of specs) {
    const id = kitId(spec);
    if (!id) continue;

    if (engine?.kits?.some((kit) => kit.id === id || kit.provides?.includes(id))) {
      skipped.push(id);
      continue;
    }

    const factory = kitRegistry?.[id];
    if (!factory) {
      missing.push(id);
      warnings.push(`Missing SequenceNode kit: ${id}`);
      continue;
    }

    const config = typeof spec === "object" ? spec.config ?? {} : {};
    const kit = typeof factory === "function" ? factory(config) : factory;

    if (kit?.install && !kit.systems && !kit.components && !kit.resources && !kit.events) {
      kit.install(engine, config);
    } else {
      engine?.installKit?.(kit, config);
    }

    installed.push(id);
  }

  return {
    installed: unique(installed),
    skipped: unique(skipped),
    missing: unique(missing),
    warnings
  };
}

export function deploySequenceNode(engine, root, options = {}) {
  if (!engine?.sequenceNodeRuntime) {
    throw new TypeError("deploySequenceNode expects an engine with sequenceNodeRuntime.");
  }

  const runtime = engine.sequenceNodeRuntime;
  const library = options.library ?? runtime.getLibrary();
  if (options.library) runtime.setLibrary(options.library);
  if (options.kitRegistry) runtime.setKitRegistry(options.kitRegistry);

  const validation = validateSequenceNode(root, library, {
    kitRegistry: options.kitRegistry ?? runtime.getKitRegistry?.(),
    eventSourcesKnown: true,
    frameBridge: options.bindFrameDriver !== false
  });
  const plan = createSequenceNodePlan(root, library, options);
  const kitResult = options.installKits === false
    ? { installed: [], skipped: [], missing: [], warnings: [] }
    : installSequenceNodeKits(engine, plan, options.kitRegistry ?? runtime.getKitRegistry?.() ?? {}, { runtime, library });

  runtime.mount(root, options.mountOptions ?? {});

  if (options.bindSurfaces) runtime.bindEngineSurfaces(options);
  if (options.bindFrameDriver !== false) runtime.bindFrameDriver(options);
  if (options.autoStart) {
    for (const node of asArray(root)) {
      if (node?.id) runtime.start(node.id);
    }
  }

  return { runtime, plan, validation, kitResult };
}

export function createSequenceNodeKit(config = {}) {
  const sequenceNodes = Object.freeze(asArray(config.nodes ?? config.sequenceNodes));
  const sequenceNodeTypes = Object.freeze(asArray(config.types ?? config.sequenceNodeTypes));
  const sequenceNodeSubscriptions = Object.freeze(asArray(config.subscriptions ?? config.sequenceNodeSubscriptions));
  const sequenceNodeOptions = Object.freeze({
    ...(config.sequenceNodeOptions ?? {}),
    ...(config.autoStart !== undefined ? { autoStart: config.autoStart } : {}),
    ...(config.bindSurfaces !== undefined ? { bindSurfaces: config.bindSurfaces } : {}),
    ...(config.bindFrameDriver !== undefined ? { bindFrameDriver: config.bindFrameDriver } : {})
  });

  return defineRuntimeKit({
    id: config.id ?? "sequence-node-kit",
    provides: config.provides ?? [config.id ?? "sequence-node-kit"],
    requires: config.requires ?? [],
    sequenceNodes,
    sequenceNodeTypes,
    sequenceNodeSubscriptions,
    sequenceNodeOptions,
    install({ engine, kit, options }) {
      const runtime = engine.sequenceNodeRuntime;
      if (config.library) runtime?.setLibrary(config.library);
      if (config.kitRegistry) runtime?.setKitRegistry(config.kitRegistry);
      config.install?.({ engine, kit, options, runtime });
    }
  });
}
