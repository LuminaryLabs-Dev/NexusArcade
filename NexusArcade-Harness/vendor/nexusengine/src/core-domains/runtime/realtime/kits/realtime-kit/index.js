import { defineDomainServiceKit } from "../../../../manifest-domain-service-kit.js";

export const REALTIME_CORE_KIT_VERSION = "0.1.0";

function bind(method, owner) {
  return typeof method === "function" ? method.bind(owner) : undefined;
}

export function createRealtimeKit(config = {}) {
  return defineDomainServiceKit({
    manifestId: "realtime-runtime-kit",
    id: config.id ?? "realtime-runtime-kit",
    domain: "realtime",
    domainPath: "n:runtime:realtime",
    parentDomainPath: "n:runtime",
    apiName: config.apiName ?? "realtime",
    visibility: config.visibility ?? "public",
    stability: config.stability ?? "stable",
    version: config.version ?? REALTIME_CORE_KIT_VERSION,
    services: config.services ?? [
      "world",
      "scheduler",
      "clock",
      "tick",
      "events",
      "resources",
      "components",
      "surfaces",
      "tick-context",
      "tick-commit"
    ],
    provides: config.provides ?? [],
    requires: config.requires ?? [],
    metadata: {
      name: "Realtime Core Kit",
      summary: "Default core domain facade for deterministic world, scheduler, clock, tick, events, resources, components, surfaces, tick context, and committed tick records.",
      layer: "core-domain",
      status: "stable",
      ownsLoop: true,
      snapshotPolicy: "engine-world-resource-ledger",
      resetPolicy: "host-or-test-explicit-reset",
      descriptors: ["realtime.clock", "realtime.scheduler", "realtime.world", "realtime.tick-context", "realtime.tick-commit"],
      tags: ["core", "realtime", "scheduler", "tick"],
      rendererAgnosticTick: true,
      ...(config.metadata ?? {})
    },
    createApi({ engine, world }) {
      return Object.freeze({
        tick: bind(engine.tick, engine),
        step: bind(engine.step, engine),
        getWorld() {
          return world;
        },
        getScheduler() {
          return engine.scheduler;
        },
        getClock() {
          return engine.clock;
        },
        getRenderer() {
          return engine.renderer;
        },
        getCurrentTickContext() {
          return engine.getCurrentTickContext?.() ?? null;
        },
        getLastTickCommit() {
          return engine.getLastTickCommit?.() ?? null;
        },
        isTicking() {
          return engine.isTicking?.() === true;
        },
        getPhases() {
          return engine.scheduler?.phases ?? [];
        },
        getSurfaceCounts() {
          return {
            event: engine.__nexusSurfaceRegistry?.event?.length ?? 0,
            resource: engine.__nexusSurfaceRegistry?.resource?.length ?? 0,
            query: engine.__nexusSurfaceRegistry?.query?.length ?? 0,
            lifecycle: engine.__nexusSurfaceRegistry?.lifecycle?.length ?? 0
          };
        },
        registerSurface: bind(engine.registerSurface, engine),
        unregisterSurface: bind(engine.unregisterSurface, engine),
        eventSurface: bind(engine.eventSurface, engine),
        resourceSurface: bind(engine.resourceSurface, engine),
        querySurface: bind(engine.querySurface, engine),
        lifecycleSurface: bind(engine.lifecycleSurface, engine)
      });
    }
  });
}
