import { defineEvent, defineResource } from "../ecs.js";
import { defineDomainServiceKit } from "../domain-service-kit.js";
import { createOperationReceipt, operationRequestHash } from "../foundation/idempotency-ledger.js";
import { cloneSerializableState } from "../foundation/serializable-state.js";
import { sha256Integrity } from "../foundation/sha256.js";
import { applyManifestKitContract } from "./manifest-kit-contract.js";

const DEFAULT_EVENT_NAMES = Object.freeze([
  "configured",
  "updated",
  "reset",
  "snapshotLoaded",
  "descriptorChanged"
]);

function clone(value) {
  if (value === undefined) return undefined;
  return structuredClone(value);
}

function stableFingerprintValue(value, stack = new WeakSet()) {
  if (typeof value === "function") return { $function: Function.prototype.toString.call(value) };
  if (value === undefined) return { $undefined: true };
  if (value === null || typeof value !== "object") return value;
  if (stack.has(value)) throw new TypeError("Domain Kit configuration cannot contain cycles.");
  stack.add(value);
  const result = Array.isArray(value)
    ? value.map((entry) => stableFingerprintValue(entry, stack))
    : Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableFingerprintValue(value[key], stack)]));
  stack.delete(value);
  return result;
}

function contentFingerprint(config, domain, apiName) {
  const payload = stableFingerprintValue({
    manifestFingerprint: config.metadata?.manifestFingerprint ?? null,
    id: config.id ?? `n-${domain}-kit`,
    domain,
    domainPath: config.domainPath ?? `n:${domain}`,
    apiName,
    version: config.version ?? "0.0.4",
    requires: config.requires ?? [],
    provides: config.provides ?? [],
    config: config.config ?? {},
    initialState: config.initialState ?? {},
    descriptors: config.descriptors ?? {},
    policies: config.policies ?? {},
    adapters: config.adapters ?? {}
  });
  return sha256Integrity(JSON.stringify(payload));
}

function cloneSerializableObject(value = {}) {
  return clone(Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry !== "function")));
}

function createPolicyDescriptors(policies = {}) {
  return Object.fromEntries(Object.entries(policies).map(([id, policy]) => [id, {
    id,
    kind: typeof policy,
    configurable: true
  }]));
}

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toPascal(slug) {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toCamel(slug) {
  const pascal = toPascal(slug);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function normalizeDomain(domain) {
  if (typeof domain !== "string" || domain.trim().length === 0) {
    throw new TypeError("createDomainKit requires a non-empty domain.");
  }
  const next = domain.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(next) || next.startsWith("core-")) {
    throw new TypeError(`Domain Kit must use a semantic slug without the retired core- prefix: ${domain}`);
  }
  return next;
}

function createState(config, extra = {}) {
  const now = Number(extra.sequence ?? 0);
  return {
    id: config.id ?? `${config.domain}-state`,
    domain: config.domain,
    version: config.version ?? "0.0.4",
    config: cloneSerializableState(config.config ?? {}),
    descriptors: cloneSerializableState(config.descriptors ?? {}),
    policies: createPolicyDescriptors(config.policies ?? {}),
    adapters: Object.keys(config.adapters ?? {}),
    metadata: cloneSerializableObject(config.metadata ?? {}),
    sequence: now,
    lastEvent: null,
    ...cloneSerializableState(config.initialState ?? {})
  };
}

function normalizeEvents(domain, eventNames = DEFAULT_EVENT_NAMES) {
  const prefix = domain.replaceAll("-", ".");
  return Object.fromEntries(
    eventNames.map((eventName) => [
      toPascal(eventName),
      defineEvent(`${prefix}.${eventName}`)
    ])
  );
}

function mergeState(state, patch = {}, eventName = "updated") {
  const { policies, ...serializablePatch } = patch;
  const next = {
    ...state,
    ...clone(serializablePatch),
    sequence: Number(state?.sequence ?? 0) + 1,
    lastEvent: eventName
  };
  if (patch.config) next.config = { ...(state.config ?? {}), ...clone(patch.config) };
  if (patch.descriptors) next.descriptors = { ...(state.descriptors ?? {}), ...clone(patch.descriptors) };
  if (policies) next.policies = { ...(state.policies ?? {}), ...createPolicyDescriptors(policies) };
  return next;
}

export function createDomainDescriptor(domain, config = {}) {
  const normalizedDomain = normalizeDomain(domain);
  return Object.freeze({
    domain: normalizedDomain,
    id: config.id ?? `n-${normalizedDomain}-kit`,
    apiName: config.apiName ?? toCamel(normalizedDomain),
    version: config.version ?? "0.0.4",
    stability: config.stability ?? "stable-candidate",
    owns: Object.freeze([...(config.owns ?? [])]),
    doesNotOwn: Object.freeze([...(config.doesNotOwn ?? [])]),
    services: Object.freeze([...(config.services ?? [])]),
    adapters: Object.freeze(Object.keys(config.adapters ?? {})),
    metadata: Object.freeze(cloneSerializableObject(config.metadata ?? {}))
  });
}

export function createDomainKit(config = {}) {
  config = applyManifestKitContract(config);
  const domain = normalizeDomain(config.domain);
  const apiName = config.apiName ?? toCamel(domain);
  const descriptor = createDomainDescriptor(domain, { ...config, apiName });
  const State = defineResource(`${domain.replaceAll("-", ".")}.state`);
  const events = normalizeEvents(domain, config.eventNames);
  const stateConfig = { ...config, domain, apiName };

  return defineDomainServiceKit({
    id: config.id ?? `n-${domain}-kit`,
    domain,
    domainPath: config.domainPath,
    parentDomainPath: config.parentDomainPath,
    apiPath: config.apiPath,
    visibility: config.visibility ?? config.apiVisibility,
    apiName,
    services: ["state", "descriptors", "config", ...(config.services ?? [])],
    requires: config.requires ?? [],
    provides: config.provides ?? [],
    stability: config.stability ?? "stable-candidate",
    version: config.version ?? "0.0.4",
    resources: { State, ...(config.resources ?? {}) },
    events: { ...events, ...(config.events ?? {}) },
    systems: config.systems ?? [],
    metadata: {
      purpose: config.purpose ?? `${domain} capability domain`,
      capabilityDomain: true,
      descriptor,
      ...cloneSerializableObject(config.metadata ?? {}),
      contentFingerprint: contentFingerprint(config, domain, apiName)
    },
    initWorld({ world }) {
      world.setResource(State, createState(stateConfig));
      config.initWorld?.({ world, State, events, descriptor, config: stateConfig });
    },
    createApi({ engine, world }) {
      const readState = () => world.getResource(State);
      const getState = () => cloneSerializableState(readState());
      const setState = (next, eventName = "updated", payload = {}) => {
        const portable = cloneSerializableState(next);
        if (JSON.stringify(readState()) === JSON.stringify(portable)) return getState();
        world.setResource(State, portable);
        const event = events[toPascal(eventName)] ?? events.Updated;
        if (event) world.emit(event, { domain, state: clone(portable), ...clone(payload) });
        return clone(portable);
      };

      const applyCommand = (command, execute) => {
        if (!isObject(command)) throw new TypeError(`${domain} command must be an object.`);
        const operationId = String(command.operationId ?? "").trim();
        if (!operationId) throw new TypeError(`${domain} command requires operationId.`);
        if (typeof execute !== "function") throw new TypeError(`${domain} command requires an executor.`);
        const request = cloneSerializableState(command);
        const requestHash = operationRequestHash(request);
        const current = getState();
        const receipts = current.operationReceipts ?? {};
        const existing = receipts[operationId];
        if (existing) {
          if (existing.requestHash !== requestHash) {
            throw new TypeError(`${domain} operation ${operationId} was already applied with different content.`);
          }
          return clone(existing);
        }
        const outcome = execute(clone(current), clone(request)) ?? {};
        if (!isObject(outcome)) throw new TypeError(`${domain} command executor must return an object.`);
        const revision = Number(current.sequence ?? 0) + 1;
        const receipt = createOperationReceipt({
          operationId,
          request,
          kitId: descriptor.id,
          revision,
          result: outcome.result ?? null
        });
        const patch = cloneSerializableState(outcome.patch ?? {});
        const commandEvents = (outcome.events ?? []).map((eventRecord) => {
          const event = events[toPascal(eventRecord?.name)];
          if (!event) throw new TypeError(`${domain} command referenced unknown event ${eventRecord?.name}.`);
          return { event, payload: cloneSerializableState(eventRecord.payload ?? {}) };
        });
        const next = mergeState(current, {
          ...patch,
          operationReceipts: { ...receipts, [operationId]: receipt }
        }, outcome.eventName ?? "updated");
        setState(next, outcome.eventName ?? "updated", {
          ...(outcome.payload ?? {}),
          receipt
        });
        for (const eventRecord of commandEvents) {
          world.emit(eventRecord.event, { domain, receipt, ...eventRecord.payload });
        }
        return clone(receipt);
      };

      const api = {
        descriptor,
        getState,
        applyCommand,
        getSnapshot() {
          return clone(getState());
        },
        loadSnapshot(snapshot = {}) {
          if (!isObject(snapshot)) throw new TypeError(`${domain} snapshot must be an object.`);
          const next = { ...createState(stateConfig), ...cloneSerializableState(snapshot) };
          return setState(next, "snapshotLoaded");
        },
        reset(payload = {}) {
          return setState(createState(stateConfig), "reset", { payload: isObject(payload) ? clone(payload) : {} });
        },
        configure(patch = {}) {
          return setState(mergeState(getState(), { config: patch }, "configured"), "configured", { patch });
        },
        update(patch = {}, eventName = "updated") {
          return setState(mergeState(getState(), patch, eventName), eventName, { patch });
        },
        getConfig() {
          return clone(getState()?.config ?? {});
        },
        getDescriptors(type) {
          const descriptors = getState()?.descriptors ?? {};
          return type ? clone(descriptors[type] ?? {}) : clone(descriptors);
        },
        setDescriptor(type, id, descriptorValue = {}) {
          const state = getState();
          const descriptors = clone(state?.descriptors ?? {});
          descriptors[type] = { ...(descriptors[type] ?? {}), [id]: clone(descriptorValue) };
          return setState(mergeState(state, { descriptors }, "descriptorChanged"), "descriptorChanged", { type, id });
        },
        getPolicy(name) {
          return config.policies?.[name] ?? clone(getState()?.policies?.[name]);
        },
        emit(eventName, payload = {}) {
          const event = events[toPascal(eventName)] ?? events.Updated;
          if (!event) return null;
          world.emit(event, { domain, ...clone(payload) });
          return event;
        }
      };

      return typeof config.createApi === "function"
        ? { ...api, ...config.createApi({ engine, world, State, events, descriptor, baseApi: api }) }
        : api;
    },
    install: config.install
  });
}
