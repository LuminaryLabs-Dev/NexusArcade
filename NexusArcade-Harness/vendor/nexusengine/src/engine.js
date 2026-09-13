import {
  createWorld,
  createScheduler
} from "./ecs.js";
import { installRuntimeKit } from "./runtime-kit.js";
import { createSequenceNodeRuntime } from "./core-domains/runtime/sequence/runtime/sequence-node-runtime.js";
import { createSequenceRuntime } from "./core-domains/runtime/sequence/runtime/sequence-runtime.js";
import {
  createEventSurface,
  createLifecycleSurface,
  createQuerySurface,
  createResourceSurface
} from "./core-domains/runtime/realtime/contracts/surfaces.js";
import { createRealtimeKit } from "./core-domains/runtime/realtime/kits/realtime-kit/index.js";
import { createSequenceKit } from "./core-domains/runtime/sequence/kits/sequence-kit/index.js";
import { createRuntimeLifecycleKit } from "./core-domains/runtime/kits/runtime-lifecycle-kit/index.js";
import { createTickContextScheduler } from "./core-domains/runtime/realtime/contracts/tick-context-scheduler.js";

function assertSurface(surface) {
  if (!surface || typeof surface.subscribe !== "function" || typeof surface.publish !== "function") {
    throw new TypeError("Expected a subscribable surface.");
  }
}

function number(value, fallback) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function array(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function defaultDomainKits(options) {
  if (options.domainKits === false) return [];
  if (Array.isArray(options.domainKits)) return options.domainKits;
  return [
    createRuntimeLifecycleKit(options.runtime ?? {}),
    createRealtimeKit(options.realtime ?? {}),
    createSequenceKit(options.sequence ?? {})
  ];
}

function groupRecords(records, kind, keySelector) {
  const grouped = new Map();
  for (const record of records) {
    if (record.kind !== kind) continue;
    const key = keySelector(record);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  }
  return grouped;
}

function reconcileQuerySurface(surface, world) {
  const nextMembers = new Set(world.query(...surface.components));
  const previousMembers = surface.members ?? new Set();
  const entered = [];
  const exited = [];

  for (const entity of nextMembers) if (!previousMembers.has(entity)) entered.push(entity);
  for (const entity of previousMembers) if (!nextMembers.has(entity)) exited.push(entity);

  const initialized = surface.initialized === true;
  surface.members = nextMembers;
  surface.initialized = true;

  if (!initialized && entered.length === 0 && exited.length === 0) return null;
  if (entered.length === 0 && exited.length === 0) return null;

  return {
    kind: "query",
    label: surface.label,
    components: surface.components.slice(),
    current: Array.from(nextMembers),
    entered,
    exited
  };
}

function publishSurfaceBatch(surface, batch, context) {
  if (batch === null || batch === undefined) return;
  if (Array.isArray(batch) && batch.length === 0) return;
  if (batch.kind === "query" && batch.entered.length === 0 && batch.exited.length === 0) return;
  surface.publish(batch, context);
}

function stableUnique(values) {
  return Array.from(new Set(values)).sort((left, right) => String(left).localeCompare(String(right)));
}

function createDirtySummary(journal = []) {
  const resources = [];
  const components = [];
  const entitiesAdded = [];
  const entitiesRemoved = [];

  for (const record of journal) {
    if (record.kind === "resource") resources.push(record.resource?.name ?? String(record.resource ?? ""));
    if (record.kind === "component") {
      components.push(`${record.entity}:${record.component?.name ?? String(record.component ?? "")}`);
    }
    if (record.kind === "entity" && record.action === "add") entitiesAdded.push(record.entity);
    if (record.kind === "entity" && record.action === "remove") entitiesRemoved.push(record.entity);
  }

  return Object.freeze({
    resources: Object.freeze(stableUnique(resources)),
    components: Object.freeze(stableUnique(components)),
    entitiesAdded: Object.freeze(stableUnique(entitiesAdded)),
    entitiesRemoved: Object.freeze(stableUnique(entitiesRemoved))
  });
}

export function createEngine(options = {}) {
  const world = options.world ?? createWorld();
  const scheduler = createTickContextScheduler(options.scheduler ?? createScheduler());
  const clock = options.clock ?? { delta: 1 / 60, elapsed: 0, frame: 0 };
  const renderer = options.renderer ?? null;
  const shaderRegistry = options.shaderRegistry ?? null;
  const materialRegistry = options.materialRegistry ?? null;
  const registry = { event: [], resource: [], query: [], lifecycle: [] };
  const tickOptions = options.tick && typeof options.tick === "object" ? options.tick : {};
  const maxDelta = Math.max(0, number(tickOptions.maxDelta, 1 / 15));
  const rejectReentry = tickOptions.rejectReentry !== false;
  const tickState = {
    running: false,
    current: null,
    lastCommit: null,
    revision: Math.max(0, Math.floor(number(tickOptions.initialRevision, clock.frame ?? 0)))
  };

  function registerSurface(surface) {
    assertSurface(surface);
    if (!registry[surface.kind]) throw new Error(`Unsupported surface kind: ${surface.kind}`);
    registry[surface.kind].push(surface);
    return surface;
  }

  function unregisterSurface(surface) {
    assertSurface(surface);
    if (!registry[surface.kind]) return false;
    const index = registry[surface.kind].indexOf(surface);
    if (index === -1) return false;
    registry[surface.kind].splice(index, 1);
    surface.dispose();
    return true;
  }

  function eventSurface(eventDefinition, surfaceOptions = {}) {
    return registerSurface(createEventSurface(eventDefinition, surfaceOptions));
  }

  function resourceSurface(resourceDefinition, surfaceOptions = {}) {
    return registerSurface(createResourceSurface(resourceDefinition, surfaceOptions));
  }

  function querySurface(components, surfaceOptions = {}) {
    return registerSurface(createQuerySurface(components, surfaceOptions));
  }

  function lifecycleSurface(surfaceOptions = {}) {
    return registerSurface(createLifecycleSurface(surfaceOptions));
  }

  function tick(delta = clock.delta) {
    if (tickState.running) {
      if (rejectReentry) throw new Error("NexusEngine tick re-entry is not allowed.");
      return world;
    }

    const requestedDelta = number(delta, clock.delta ?? 1 / 60);
    const nextDelta = Math.min(maxDelta, Math.max(0, requestedDelta));
    clock.delta = nextDelta;
    clock.elapsed = number(clock.elapsed, 0) + nextDelta;
    clock.frame = number(clock.frame, 0) + 1;
    tickState.revision += 1;

    const tickContext = Object.freeze({
      tickId: `tick:${tickState.revision}`,
      frame: clock.frame,
      revision: tickState.revision,
      delta: clock.delta,
      elapsed: clock.elapsed
    });

    tickState.running = true;
    tickState.current = tickContext;
    world.__nexusClock = clock;
    world.__nexusTickContext = tickContext;
    world.__nexusRenderer = renderer;

    try {
      const lifecycleBatch = [{
        kind: "lifecycle",
        topic: "tick",
        stage: "start",
        tickId: tickContext.tickId,
        revision: tickContext.revision,
        frame: clock.frame,
        delta: clock.delta,
        elapsed: clock.elapsed
      }];
      let journal = [];

      scheduler.run(world, {
        onPhaseStart(phaseName) {
          lifecycleBatch.push({
            kind: "lifecycle",
            topic: "phase",
            stage: "start",
            phase: phaseName,
            tickId: tickContext.tickId,
            revision: tickContext.revision,
            frame: clock.frame,
            delta: clock.delta,
            elapsed: clock.elapsed
          });
        },
        onPhaseEnd(phaseName) {
          lifecycleBatch.push({
            kind: "lifecycle",
            topic: "phase",
            stage: "end",
            phase: phaseName,
            tickId: tickContext.tickId,
            revision: tickContext.revision,
            frame: clock.frame,
            delta: clock.delta,
            elapsed: clock.elapsed
          });
        },
        onDrain({ journal: drainedJournal }) {
          journal = drainedJournal.slice();
        }
      }, tickContext);

      const journalContext = {
        engine,
        world,
        scheduler,
        clock,
        tickContext,
        tickId: tickContext.tickId,
        revision: tickContext.revision,
        frame: clock.frame,
        delta: clock.delta,
        elapsed: clock.elapsed
      };

      const eventGroups = groupRecords(journal, "event", (record) => record.event.name);
      const resourceGroups = groupRecords(journal, "resource", (record) => record.resource.name);
      const lifecycleRecords = journal
        .filter((record) => record.kind === "component" || record.kind === "entity")
        .map((record) => ({ ...record, kind: "lifecycle", topic: record.kind }));

      for (const surface of registry.event) {
        publishSurfaceBatch(surface, eventGroups.get(surface.event.name) ?? null, journalContext);
      }
      for (const surface of registry.resource) {
        publishSurfaceBatch(surface, resourceGroups.get(surface.resource.name) ?? null, journalContext);
      }
      for (const surface of registry.query) {
        publishSurfaceBatch(surface, reconcileQuerySurface(surface, world), journalContext);
      }

      lifecycleBatch.push(...lifecycleRecords);
      lifecycleBatch.push({
        kind: "lifecycle",
        topic: "tick",
        stage: "end",
        tickId: tickContext.tickId,
        revision: tickContext.revision,
        frame: clock.frame,
        delta: clock.delta,
        elapsed: clock.elapsed,
        entityCount: world.entityCount
      });

      for (const surface of registry.lifecycle) {
        const topics = surface.topics ?? [];
        const batch = topics.length > 0
          ? lifecycleBatch.filter((record) => topics.includes(record.topic))
          : lifecycleBatch.slice();
        publishSurfaceBatch(surface, batch, journalContext);
      }

      if (engine.sequenceRuntime) engine.sequenceRuntime.tick(clock.delta);
      if (engine.sequenceNodeRuntime && engine.driveSequenceNodesWithTick !== false) {
        engine.sequenceNodeRuntime.frame({
          source: "engine",
          payload: { delta: clock.delta, elapsed: clock.elapsed, frame: clock.frame },
          frame: clock.frame,
          delta: clock.delta,
          elapsed: clock.elapsed,
          meta: { engine, world, clock, tickContext }
        });
      }

      const simulationApi = engine.n?.simulation;
      const committedSimulation = simulationApi?.getCommittedFrame?.() ?? null;
      tickState.lastCommit = Object.freeze({
        tickId: tickContext.tickId,
        frame: tickContext.frame,
        revision: tickContext.revision,
        delta: tickContext.delta,
        elapsed: tickContext.elapsed,
        simulation: committedSimulation ? Object.freeze({
          stepId: committedSimulation.stepId ?? null,
          revision: committedSimulation.revision ?? null,
          outcome: committedSimulation.outcome ?? "continue"
        }) : null,
        dirty: createDirtySummary(journal),
        committed: true
      });

      return world;
    } finally {
      tickState.current = null;
      tickState.running = false;
      world.__nexusTickContext = null;
    }
  }

  const engine = {
    world,
    scheduler,
    clock,
    renderer,
    shaderRegistry,
    materialRegistry,
    __nexusSurfaceRegistry: registry,
    kit: null,
    kits: [],
    kitBindings: {},
    sequenceRuntime: options.sequenceRuntime ?? createSequenceRuntime(),
    sequenceNodeRuntime: options.sequenceNodeRuntime ?? createSequenceNodeRuntime({
      library: options.sequenceNodeLibrary,
      kitRegistry: options.sequenceKitRegistry,
      historyLimit: options.sequenceNodeHistoryLimit
    }),
    sequenceKitRegistry: { ...(options.sequenceKitRegistry ?? {}) },
    driveSequenceNodesWithTick: options.driveSequenceNodesWithTick ?? true,
    registerSurface,
    unregisterSurface,
    eventSurface,
    resourceSurface,
    querySurface,
    lifecycleSurface,
    installKit(kit, kitOptions = options) {
      return installRuntimeKit(engine, kit, kitOptions);
    },
    dispatchSequenceEvent(eventOrType, payload = {}, meta = {}) {
      return engine.sequenceNodeRuntime.dispatch(eventOrType, payload, meta);
    },
    startSequenceNode(id, payload = {}) {
      return engine.sequenceNodeRuntime.start(id, payload);
    },
    mountSequenceNode(nodeOrNodes, mountOptions = {}) {
      return engine.sequenceNodeRuntime.mount(nodeOrNodes, mountOptions);
    },
    registerSequenceNodeType(typeDefinition) {
      return engine.sequenceNodeRuntime.registerType(typeDefinition);
    },
    bindSequenceNodeSurfaces(planOrOptions = {}) {
      return engine.sequenceNodeRuntime.bindEngineSurfaces(planOrOptions);
    },
    bindSequenceNodeFrameDriver(frameOptions = {}) {
      return engine.sequenceNodeRuntime.bindFrameDriver(frameOptions);
    },
    getLastTickCommit() {
      return clone(tickState.lastCommit);
    },
    getCurrentTickContext() {
      return tickState.current;
    },
    isTicking() {
      return tickState.running;
    },
    tick
  };

  for (const surface of options.surfaces ?? []) registerSurface(surface);

  engine.sequenceRuntime.bind(engine);
  engine.sequenceNodeRuntime.bind(engine);

  for (const kit of defaultDomainKits(options)) engine.installKit(kit, options);

  if (options.sequenceNodes) engine.sequenceNodeRuntime.mount(options.sequenceNodes);
  if (options.bindSequenceNodeSurfaces) {
    engine.sequenceNodeRuntime.bindEngineSurfaces(options.bindSequenceNodeSurfaces);
  }
  if (options.autoStartSequenceNodes) {
    for (const node of array(options.sequenceNodes)) {
      if (node?.id) engine.sequenceNodeRuntime.start(node.id);
    }
  }

  for (const kit of options.kits ?? []) engine.installKit(kit, options);
  if (options.kit) engine.installKit(options.kit, options);

  return engine;
}
