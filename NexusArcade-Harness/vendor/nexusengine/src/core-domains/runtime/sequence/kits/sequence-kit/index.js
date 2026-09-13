import { defineDomainServiceKit } from "../../../../manifest-domain-service-kit.js";

export * from "../../runtime/sequence-node-kit.js";
export * from "../../runtime/sequence-node-library.js";
export * from "../../runtime/sequence-node-runtime.js";
export * from "../../runtime/sequence-runtime.js";

export const SEQUENCE_CORE_KIT_VERSION = "0.1.0";

function bind(method, owner) {
  return typeof method === "function" ? method.bind(owner) : undefined;
}

function appendGraph(runtime, graph) {
  if (typeof runtime?.appendGraph === "function") {
    return runtime.appendGraph(graph);
  }
  return runtime?.setGraph?.(graph);
}

export function createSequenceKit(config = {}) {
  return defineDomainServiceKit({
    manifestId: "runtime-sequence-kit",
    id: config.id ?? "runtime-sequence-kit",
    domain: "sequence",
    domainPath: "n:runtime:sequence",
    parentDomainPath: "n:runtime",
    apiName: config.apiName ?? "sequence",
    visibility: config.visibility ?? "public",
    stability: config.stability ?? "stable",
    version: config.version ?? SEQUENCE_CORE_KIT_VERSION,
    requires: ["n:runtime:realtime", ...(config.requires ?? [])],
    provides: config.provides ?? [],
    services: config.services ?? [
      "runtime",
      "graph",
      "node",
      "event",
      "subscription",
      "driver"
    ],
    metadata: {
      name: "Sequence Core Kit",
      summary: "Default core domain facade for authored sequence runtime, sequence nodes, events, subscriptions, and frame driving.",
      layer: "core-domain",
      status: "stable",
      ownsLoop: false,
      snapshotPolicy: "sequence-runtime-state",
      resetPolicy: "explicit-sequence-reset",
      descriptors: ["sequence.runtime", "sequence.node-runtime"],
      tags: ["core", "sequence", "orchestration", "authoring"],
      ...(config.metadata ?? {})
    },
    createApi({ engine }) {
      const sequenceRuntime = engine.sequenceRuntime;
      const sequenceNodeRuntime = engine.sequenceNodeRuntime;

      return Object.freeze({
        getRuntime() {
          return sequenceRuntime;
        },
        getNodeRuntime() {
          return sequenceNodeRuntime;
        },
        tick: bind(sequenceRuntime?.tick, sequenceRuntime),
        setGraph: bind(sequenceRuntime?.setGraph, sequenceRuntime),
        appendGraph(graph) {
          return appendGraph(sequenceRuntime, graph);
        },
        addSubscription: bind(sequenceRuntime?.addSubscription, sequenceRuntime),
        dispatch: bind(sequenceNodeRuntime?.dispatch, sequenceNodeRuntime),
        dispatchNodeEvent: bind(sequenceNodeRuntime?.dispatch, sequenceNodeRuntime),
        startNode: bind(sequenceNodeRuntime?.start, sequenceNodeRuntime),
        mountNode: bind(sequenceNodeRuntime?.mount, sequenceNodeRuntime),
        registerNodeType: bind(sequenceNodeRuntime?.registerType, sequenceNodeRuntime),
        bindSurfaces: bind(sequenceNodeRuntime?.bindEngineSurfaces, sequenceNodeRuntime),
        bindFrameDriver: bind(sequenceNodeRuntime?.bindFrameDriver, sequenceNodeRuntime),
        frame: bind(sequenceNodeRuntime?.frame, sequenceNodeRuntime)
      });
    }
  });
}
