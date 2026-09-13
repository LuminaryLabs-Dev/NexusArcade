import { defineEvent, defineResource } from "../../../../ecs.js";

export const SimulationResolutionState = defineResource("core.simulation.resolution.state");
export const SimulationCommittedFrameState = defineResource("core.simulation.committed-frame.state");
export const SimulationResolutionLedger = defineResource("core.simulation.resolution.ledger");

export const SimulationStepCommitted = defineEvent("core.simulation.step.committed");
export const SimulationStepRejected = defineEvent("core.simulation.step.rejected");

const runtimes = new WeakMap();

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value, fallback, label) {
  const next = String(value ?? fallback ?? "").trim();
  if (!next) throw new TypeError(`${label} requires a non-empty value.`);
  return next;
}

function finite(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function orderEntries(left, right) {
  const orderDifference = finite(left.order, 0) - finite(right.order, 0);
  if (orderDifference !== 0) return orderDifference;
  const sourceDifference = String(left.source).localeCompare(String(right.source));
  if (sourceDifference !== 0) return sourceDifference;
  return String(left.id).localeCompare(String(right.id));
}

function createResolutionState() {
  return { step: null, proposals: [], observations: [], status: "idle" };
}

function createCommittedFrameState() {
  return { current: null };
}

function createResolutionLedger() {
  return { revision: 0, committedStepIds: [] };
}

function ensureRuntime(world) {
  if (!runtimes.has(world)) {
    runtimes.set(world, { engine: null, policy: null, observationSources: new Map() });
  }
  return runtimes.get(world);
}

function stepForTick(tickContext, ledger) {
  if (!tickContext?.tickId) throw new Error("Core Simulation resolution requires an active TickContext.");
  return Object.freeze({
    stepId: `simulation:${tickContext.tickId}`,
    tickId: tickContext.tickId,
    frame: tickContext.frame,
    delta: tickContext.delta,
    elapsed: tickContext.elapsed,
    predecessorRevision: finite(ledger?.revision, 0)
  });
}

function normalizeEntry(input = {}, kind, step) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError(`Simulation ${kind} must be an object.`);
  }
  const source = text(input.source, "anonymous", `Simulation ${kind} source`);
  const type = text(input.type, kind, `Simulation ${kind} type`);
  const id = text(input.id, `${step.stepId}:${source}:${type}`, `Simulation ${kind} id`);
  return {
    id,
    stepId: step.stepId,
    source,
    type,
    order: finite(input.order, 0),
    value: clone(input.value ?? input.payload ?? {})
  };
}

function ensureCurrentStep(world, tickContext) {
  const ledger = world.getResource(SimulationResolutionLedger) ?? createResolutionLedger();
  const current = world.getResource(SimulationResolutionState) ?? createResolutionState();
  if (current.step?.tickId === tickContext?.tickId) return current;
  const next = {
    step: stepForTick(tickContext, ledger),
    proposals: [],
    observations: [],
    status: "collecting"
  };
  world.setResource(SimulationResolutionState, next);
  return next;
}

function submitEntry(world, tickContext, input, kind) {
  const state = ensureCurrentStep(world, tickContext);
  if (state.status === "committed") throw new Error(`Simulation ${kind} cannot be submitted after commit.`);
  const field = kind === "proposal" ? "proposals" : "observations";
  const entry = normalizeEntry(input, kind, state.step);
  if (state[field].some((candidate) => candidate.id === entry.id)) return clone(entry);
  world.setResource(SimulationResolutionState, {
    ...state,
    [field]: [...state[field], entry]
  });
  return clone(entry);
}

function defaultPolicy() {
  return {
    id: "core-simulation-default-policy",
    version: 1,
    resolve({ proposals }) {
      return {
        outcome: "continue",
        accepted: { proposalIds: proposals.map((proposal) => proposal.id) },
        rejected: {},
        statePatch: { resources: [] },
        events: [],
        transition: null
      };
    }
  };
}

function normalizePolicy(policy) {
  if (!policy || typeof policy !== "object" || typeof policy.resolve !== "function") {
    throw new TypeError("Core Simulation resolution policy requires a resolve(context) function.");
  }
  return {
    id: text(policy.id, "simulation-policy", "Simulation policy id"),
    version: finite(policy.version, 1),
    resolve: policy.resolve
  };
}

function normalizeObservationSource(source) {
  if (!source || typeof source !== "object" || typeof source.observe !== "function") {
    throw new TypeError("Simulation observation source requires observe(context).");
  }
  return {
    id: text(source.id, null, "Observation source id"),
    order: finite(source.order, 0),
    observe: source.observe
  };
}

function applyStatePatch(world, statePatch = {}) {
  const writes = asArray(statePatch.resources ?? statePatch.resourceWrites);
  for (const write of writes) {
    if (!write?.resource || write.resource.kind !== "resource") {
      throw new TypeError("Simulation statePatch resource writes require a resource definition.");
    }
    world.setResource(write.resource, clone(write.value));
  }
}

function emitAcceptedEvents(world, events = []) {
  const summaries = [];
  for (const entry of asArray(events)) {
    if (!entry?.event || entry.event.kind !== "event") {
      throw new TypeError("Simulation result events require an event definition.");
    }
    const payload = clone(entry.payload ?? {});
    world.emit(entry.event, payload);
    summaries.push({ type: entry.event.name, payload });
  }
  return summaries;
}

function createCommittedFrame({ state, ledger, policy, result, eventSummaries }) {
  return deepFreeze({
    stepId: state.step.stepId,
    tickId: state.step.tickId,
    frame: state.step.frame,
    predecessorRevision: state.step.predecessorRevision,
    revision: finite(ledger.revision, 0) + 1,
    policy: { id: policy.id, version: policy.version },
    outcome: String(result?.outcome ?? "continue"),
    accepted: clone(result?.accepted ?? {}),
    rejected: clone(result?.rejected ?? {}),
    events: eventSummaries.map((entry) => clone(entry)),
    transition: clone(result?.transition ?? null),
    committed: true
  });
}

function resolveSimulationStep(world, tickContext) {
  const runtime = ensureRuntime(world);
  const state = ensureCurrentStep(world, tickContext);
  const ledger = world.getResource(SimulationResolutionLedger) ?? createResolutionLedger();

  if (ledger.committedStepIds.includes(state.step.stepId)) {
    world.emit(SimulationStepRejected, { stepId: state.step.stepId, reason: "duplicate-step" });
    world.setResource(SimulationResolutionState, createResolutionState());
    return;
  }

  const proposals = state.proposals.slice().sort(orderEntries);
  const observations = state.observations.slice();
  const sourceContext = {
    step: clone(state.step),
    tick: tickContext,
    proposals: clone(proposals),
    world,
    engine: runtime.engine
  };

  const sources = Array.from(runtime.observationSources.values())
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
  for (const source of sources) {
    for (const observation of asArray(source.observe(sourceContext))) {
      observations.push(normalizeEntry({
        ...observation,
        source: observation?.source ?? source.id,
        order: observation?.order ?? source.order
      }, "observation", state.step));
    }
  }
  observations.sort(orderEntries);

  const policy = runtime.policy ?? defaultPolicy();
  const previousFrame = world.getResource(SimulationCommittedFrameState)?.current ?? null;
  const result = policy.resolve({
    step: clone(state.step),
    tick: tickContext,
    previousFrame: clone(previousFrame),
    proposals: clone(proposals),
    observations: clone(observations),
    world,
    engine: runtime.engine
  }) ?? {};

  applyStatePatch(world, result.statePatch ?? {});
  const eventSummaries = emitAcceptedEvents(world, result.events ?? []);
  const committedFrame = createCommittedFrame({ state, ledger, policy, result, eventSummaries });
  const committedStepIds = [...ledger.committedStepIds, state.step.stepId].slice(-256);

  world.setResource(SimulationCommittedFrameState, { current: committedFrame });
  world.setResource(SimulationResolutionLedger, {
    revision: committedFrame.revision,
    committedStepIds
  });
  world.setResource(SimulationResolutionState, createResolutionState());
  world.emit(SimulationStepCommitted, clone(committedFrame));
}

export function createSimulationResolutionExtension(config = {}) {
  return {
    resources: {
      SimulationResolutionState,
      SimulationCommittedFrameState,
      SimulationResolutionLedger
    },
    events: {
      SimulationStepCommitted,
      SimulationStepRejected
    },
    systems: [{
      phase: "resolve",
      name: "simulationResolutionSystem",
      system: resolveSimulationStep
    }],
    initWorld({ world }) {
      ensureRuntime(world);
      world.setResource(SimulationResolutionState, createResolutionState());
      world.setResource(SimulationCommittedFrameState, createCommittedFrameState());
      world.setResource(SimulationResolutionLedger, createResolutionLedger());
    },
    createApi({ engine, world }) {
      const runtime = ensureRuntime(world);
      runtime.engine = engine;
      if (config.policy) runtime.policy = normalizePolicy(config.policy);

      return {
        submitProposal(proposal) {
          return submitEntry(world, engine.getCurrentTickContext?.() ?? world.__nexusTickContext, proposal, "proposal");
        },
        submitObservation(observation) {
          return submitEntry(world, engine.getCurrentTickContext?.() ?? world.__nexusTickContext, observation, "observation");
        },
        registerObservationSource(source) {
          const normalized = normalizeObservationSource(source);
          runtime.observationSources.set(normalized.id, normalized);
          return normalized.id;
        },
        unregisterObservationSource(id) {
          return runtime.observationSources.delete(String(id));
        },
        setResolutionPolicy(policy) {
          runtime.policy = normalizePolicy(policy);
          return { id: runtime.policy.id, version: runtime.policy.version };
        },
        getResolutionPolicy() {
          return runtime.policy ? { id: runtime.policy.id, version: runtime.policy.version } : null;
        },
        getResolutionState() {
          return clone(world.getResource(SimulationResolutionState) ?? createResolutionState());
        },
        getResolutionLedger() {
          return clone(world.getResource(SimulationResolutionLedger) ?? createResolutionLedger());
        },
        getCommittedFrame() {
          return clone(world.getResource(SimulationCommittedFrameState)?.current ?? null);
        },
        resetResolution() {
          world.setResource(SimulationResolutionState, createResolutionState());
          world.setResource(SimulationCommittedFrameState, createCommittedFrameState());
          world.setResource(SimulationResolutionLedger, createResolutionLedger());
          return true;
        }
      };
    }
  };
}
