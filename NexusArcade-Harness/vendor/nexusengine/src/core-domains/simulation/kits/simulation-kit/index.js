import { createDomainKit } from "../../../domain-kit.js";
import { createSimulationResolutionExtension } from "./resolution.js";
import {
  createActionWindowService,
  createPressureService,
  createResourceService
} from "./services.js";

export * from "./timers.js";
export * from "./resources.js";
export * from "./pressure.js";
export * from "./objectives.js";
export * from "./checkpoints.js";
export * from "./hazards.js";
export * from "./resolution.js";
export * from "./services.js";

export function createSimulationKit(config = {}) {
  const resolutionEnabled = config.resolution === true;
  const resolution = resolutionEnabled ? createSimulationResolutionExtension(config.resolutionConfig ?? {}) : null;
  const customCreateApi = config.createApi;
  const customInitWorld = config.initWorld;
  const customInstall = config.install;
  const apiName = config.apiName ?? "simulation";
  const servicesByWorld = new WeakMap();

  const baseServices = ["resource meters", "pressure channels", "timers", "cooldowns", "objectives", "routes", "checkpoints", "hazards", "action windows"];
  const services = [
    ...(config.services ?? []),
    "resources",
    "pressure",
    "windows",
    ...(resolutionEnabled ? ["step-resolution", "proposal-collection", "observation-collection", "committed-frame"] : [])
  ];

  function promotedServicesSystem(world) {
    const promoted = servicesByWorld.get(world);
    if (!promoted) return;
    const delta = Math.max(0, Number(world.__nexusClock?.delta ?? 0));
    promoted.resources.tick(delta);
    promoted.pressure.tick(delta);
    promoted.windows.tick(delta);
  }

  return createDomainKit({
    ...config,
    manifestId: "simulation-state-kit",
    id: config.id ?? "simulation-state-kit",
    domain: "simulation",
    domainPath: config.domainPath ?? "n:simulation",
    apiName,
    purpose: resolutionEnabled
      ? "Deterministic resources, pressure, timers, action windows, objectives, routes, checkpoints, hazards, and authoritative per-tick simulation resolution."
      : "Deterministic resources, pressure, timers, action windows, objectives, routes, checkpoints, and hazards.",
    owns: [...baseServices, ...(resolutionEnabled ? ["authoritative simulation step resolution", "committed simulation frame"] : []), ...(config.owns ?? [])],
    doesNotOwn: ["game-specific loop fiction", "rendering", "raw input", "physics backend implementation", ...(config.doesNotOwn ?? [])],
    services,
    resources: { ...(config.resources ?? {}), ...(resolution?.resources ?? {}) },
    events: { ...(config.events ?? {}), ...(resolution?.events ?? {}) },
    systems: [
      ...(config.systems ?? []),
      ...(resolution?.systems ?? []),
      { phase: config.promotedServicesPhase ?? "simulate", name: "simulationPromotedServicesSystem", system: promotedServicesSystem }
    ],
    initWorld(context) {
      customInitWorld?.(context);
      resolution?.initWorld?.(context);
    },
    createApi(context) {
      const emit = (service) => (type, payload) => context.baseApi.emit("updated", { service, type, payload });
      const resources = createResourceService({
        ...(config.resourceService ?? {}),
        resources: config.resourceMeters ?? config.resourceService?.resources ?? [],
        onEvent: emit("resources")
      });
      const pressure = createPressureService({
        ...(config.pressureService ?? {}),
        channels: config.pressureChannels ?? config.pressureService?.channels ?? [],
        onEvent: emit("pressure")
      });
      const windows = createActionWindowService({
        ...(config.windowService ?? {}),
        windows: config.actionWindows ?? config.windowService?.windows ?? [],
        onEvent: emit("windows")
      });
      servicesByWorld.set(context.world, { resources, pressure, windows });

      const customApi = customCreateApi?.(context) ?? {};
      const resolutionApi = resolution?.createApi?.(context) ?? {};

      function serviceSnapshot() {
        return { resources: resources.getSnapshot(), pressure: pressure.getSnapshot(), windows: windows.getSnapshot() };
      }

      const api = {
        ...customApi,
        ...resolutionApi,
        resources,
        pressure,
        windows,
        getSnapshot() { return { ...context.baseApi.getSnapshot(), services: serviceSnapshot() }; },
        loadSnapshot(snapshot = {}) {
          const base = context.baseApi.loadSnapshot(snapshot);
          if (snapshot.services?.resources) resources.loadSnapshot(snapshot.services.resources);
          if (snapshot.services?.pressure) pressure.loadSnapshot(snapshot.services.pressure);
          if (snapshot.services?.windows) windows.loadSnapshot(snapshot.services.windows);
          return { ...base, services: serviceSnapshot() };
        },
        reset(payload = {}) {
          const base = context.baseApi.reset(payload);
          resources.reset(payload.resources ?? {});
          pressure.reset(payload.pressure ?? {});
          windows.reset(payload.windows ?? {});
          resolutionApi.reset?.(payload.resolution);
          return { ...base, services: serviceSnapshot() };
        }
      };
      return api;
    },
    install(context) {
      customInstall?.(context);
    },
    metadata: {
      ...(config.metadata ?? {}),
      piecesFirst: true,
      resolutionEnabled,
      rendererAgnostic: true,
      promotedServices: ["generic-resource-loop-kit", "generic-pressure-loop-kit", "generic-action-window-kit"]
    }
  });
}
