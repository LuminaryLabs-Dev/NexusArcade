import {
  installDomainPathControls,
  normalizeDomainPath
} from "./domain-path.js";

export const DOMAIN_API_VISIBILITIES = Object.freeze(["public", "internal", "editor-safe"]);

const DOMAIN_API_REGISTRY_SLOT = "__nexusDomainApiRegistry";
const DOMAIN_API_CONTROLS_SLOT = "__nexusDomainApiControlsInstalled";
const API_NAME_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function ensureEngine(engine) {
  if (!engine || typeof engine !== "object") {
    throw new TypeError("Domain API registry expects a NexusEngine engine.");
  }
  return engine;
}

function ensureNamespace(engine) {
  ensureEngine(engine);
  if (!engine.n || typeof engine.n !== "object" || Array.isArray(engine.n)) {
    engine.n = {};
  }
  return engine.n;
}

function defineHidden(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    enumerable: false,
    configurable: false,
    writable: false
  });
}

function defineReservedMethod(target, name, value, ownerLabel) {
  if (Object.prototype.hasOwnProperty.call(target, name)) {
    throw new TypeError(`engine.n.${name} is reserved for ${ownerLabel}.`);
  }
  defineHidden(target, name, value);
}

export function normalizeDomainApiName(value, fieldName = "apiName") {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Domain API registry requires a non-empty ${fieldName}.`);
  }

  const name = value.trim();
  if (!API_NAME_PATTERN.test(name)) {
    throw new TypeError(`Domain API registry has an invalid ${fieldName}: ${value}.`);
  }

  return name;
}

export function normalizeDomainApiVisibility(value = "public") {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("Domain API registry requires a non-empty visibility.");
  }

  const visibility = value.trim();
  if (!DOMAIN_API_VISIBILITIES.includes(visibility)) {
    throw new TypeError(`Domain API registry has an invalid visibility: ${value}.`);
  }

  return visibility;
}

function normalizeOwnerKitId(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("Domain API registry requires a non-empty ownerKitId.");
  }
  return value.trim();
}

function normalizeOptionalDomainPath(value, fieldName) {
  if (value === undefined || value === null || value === "") return undefined;
  return normalizeDomainPath(value, fieldName);
}

function createDomainApiRecord(entry = {}) {
  if (!isObject(entry)) {
    throw new TypeError("registerApi expects an API record object.");
  }

  return Object.freeze({
    name: normalizeDomainApiName(entry.name ?? entry.apiName, "name"),
    apiName: normalizeDomainApiName(entry.apiName ?? entry.name, "apiName"),
    apiPath: normalizeOptionalDomainPath(entry.apiPath, "apiPath"),
    domainPath: normalizeOptionalDomainPath(entry.domainPath, "domainPath"),
    ownerKitId: normalizeOwnerKitId(entry.ownerKitId ?? entry.ownerId ?? entry.kitId),
    visibility: normalizeDomainApiVisibility(entry.visibility ?? "public"),
    status: entry.status ?? entry.stability,
    version: entry.version,
    available: entry.available !== false,
    metadata: Object.freeze({ ...(entry.metadata ?? {}) })
  });
}

export function createDomainApiRegistry() {
  const recordsByName = new Map();
  const namesByPath = new Map();

  function register(entry) {
    const record = createDomainApiRecord(entry);
    const existing = recordsByName.get(record.name);

    if (existing && existing.ownerKitId !== record.ownerKitId) {
      throw new TypeError(`Domain API ${record.name} is already registered to kit ${existing.ownerKitId}.`);
    }

    if (record.apiPath) {
      const existingName = namesByPath.get(record.apiPath);
      if (existingName && existingName !== record.name) {
        throw new TypeError(`Domain API path ${record.apiPath} is already registered to API ${existingName}.`);
      }
    }

    const next = Object.freeze({
      ...(existing ?? {}),
      ...record,
      metadata: Object.freeze({
        ...(existing?.metadata ?? {}),
        ...(record.metadata ?? {})
      })
    });

    recordsByName.set(record.name, next);
    if (record.apiPath) namesByPath.set(record.apiPath, record.name);
    return next;
  }

  function get(name) {
    return recordsByName.get(normalizeDomainApiName(name, "name")) ?? null;
  }

  function list() {
    return Array.from(recordsByName.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  return Object.freeze({ register, get, list });
}

export function ensureDomainApiRegistry(engine) {
  ensureEngine(engine);
  if (!engine[DOMAIN_API_REGISTRY_SLOT]) {
    defineHidden(engine, DOMAIN_API_REGISTRY_SLOT, createDomainApiRegistry());
  }
  return engine[DOMAIN_API_REGISTRY_SLOT];
}

export function installDomainApiControls(engine) {
  const namespace = ensureNamespace(engine);
  const registry = ensureDomainApiRegistry(engine);

  if (engine[DOMAIN_API_CONTROLS_SLOT]) {
    return registry;
  }

  defineReservedMethod(namespace, "registerApi", (entry) => registry.register(entry), "domain API registration");
  defineReservedMethod(namespace, "api", (name) => registry.get(name), "domain API lookup");
  defineReservedMethod(namespace, "apis", () => registry.list(), "domain API listing");
  defineHidden(engine, DOMAIN_API_CONTROLS_SLOT, true);

  return registry;
}

export function installDomainAddressability(engine) {
  installDomainPathControls(engine);
  installDomainApiControls(engine);
  return engine.n;
}

export function registerDomainApiForKit(engine, kit, apiName) {
  if (!apiName || !Object.prototype.hasOwnProperty.call(engine?.n ?? {}, apiName)) {
    return null;
  }

  const registry = installDomainApiControls(engine);
  const metadata = kit?.metadata ?? {};

  return registry.register({
    name: apiName,
    apiName,
    apiPath: metadata.apiPath,
    domainPath: metadata.domainPath,
    ownerKitId: kit.id,
    visibility: metadata.visibility ?? metadata.apiVisibility ?? "public",
    status: metadata.stability,
    version: metadata.version,
    available: true,
    metadata: {
      domain: metadata.domain,
      kind: metadata.kind,
      namespace: metadata.namespace
    }
  });
}
