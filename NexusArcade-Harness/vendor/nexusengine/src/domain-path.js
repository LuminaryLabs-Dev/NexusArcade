export const DOMAIN_PATH_NAMESPACE = "n";
export const DOMAIN_PATH_PATTERN = /^n(?::[a-z][a-z0-9-]*)+$/;

const DOMAIN_PATH_REGISTRY_KEY = "__nexusDomainPathRegistry";
const DOMAIN_PATH_CONTROLS_KEY = "__nexusDomainPathControlsInstalled";

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function ensureEngine(engine) {
  if (!engine || typeof engine !== "object") {
    throw new TypeError("Domain path registry expects a NexusEngine engine.");
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

export function isDomainPath(value) {
  return typeof value === "string" && DOMAIN_PATH_PATTERN.test(value.trim().toLowerCase());
}

export function normalizeDomainPath(value, fieldName = "domainPath") {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Domain path registry requires a non-empty ${fieldName}.`);
  }

  const path = value.trim().toLowerCase();
  if (!DOMAIN_PATH_PATTERN.test(path)) {
    throw new TypeError(`Domain path registry has an invalid ${fieldName}: ${value}.`);
  }

  return path;
}

function normalizeOptionalDomainPath(value, fieldName) {
  if (value === undefined || value === null || value === "") return undefined;
  return normalizeDomainPath(value, fieldName);
}

function normalizeOwnerKitId(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError("Domain path registry requires a non-empty ownerKitId.");
  }
  return value.trim();
}

function createDomainPathRecord(entry = {}) {
  if (!isObject(entry)) {
    throw new TypeError("registerPath expects a path record object.");
  }

  const path = normalizeDomainPath(entry.path ?? entry.domainPath, "path");
  const parentPath = normalizeOptionalDomainPath(entry.parentPath ?? entry.parentDomainPath, "parentPath");
  const ownerKitId = normalizeOwnerKitId(entry.ownerKitId ?? entry.ownerId ?? entry.kitId);

  if (parentPath) {
    if (parentPath === path) {
      throw new TypeError(`Domain path ${path} cannot use itself as parentPath.`);
    }
    if (!path.startsWith(`${parentPath}:`)) {
      throw new TypeError(`Domain path ${path} must be nested under parentPath ${parentPath}.`);
    }
  }

  return Object.freeze({
    path,
    parentPath,
    ownerKitId,
    ownerKitIds: Object.freeze([ownerKitId]),
    sharedOwnership: entry.sharedOwnership === true,
    domain: entry.domain,
    status: entry.status ?? entry.stability,
    version: entry.version,
    metadata: Object.freeze({ ...(entry.metadata ?? {}) })
  });
}

export function createDomainPathRegistry() {
  const records = new Map();

  function register(entry) {
    const record = createDomainPathRecord(entry);
    const existing = records.get(record.path);

    const differentOwner = existing && existing.ownerKitId !== record.ownerKitId && !existing.ownerKitIds?.includes(record.ownerKitId);
    const canShare = differentOwner
      && existing.sharedOwnership === true
      && record.sharedOwnership === true
      && existing.parentPath === record.parentPath;

    if (differentOwner && !canShare) {
      throw new TypeError(`Domain path ${record.path} is already registered to kit ${existing.ownerKitId}.`);
    }

    const ownerKitIds = Object.freeze([
      ...new Set([...(existing?.ownerKitIds ?? []), record.ownerKitId])
    ].sort());

    const next = Object.freeze({
      ...(existing ?? {}),
      ...record,
      ownerKitId: existing?.ownerKitId ?? record.ownerKitId,
      ownerKitIds,
      sharedOwnership: existing?.sharedOwnership === true || record.sharedOwnership === true,
      metadata: Object.freeze({
        ...(existing?.metadata ?? {}),
        ...(record.metadata ?? {})
      })
    });

    records.set(record.path, next);
    return next;
  }

  function get(path) {
    return records.get(normalizeDomainPath(path, "path")) ?? null;
  }

  function list() {
    return Array.from(records.values()).sort((a, b) => a.path.localeCompare(b.path));
  }

  function ownerOf(path) {
    return get(path)?.ownerKitId ?? null;
  }

  function ownersOf(path) {
    return [...(get(path)?.ownerKitIds ?? [])];
  }

  return Object.freeze({ register, get, list, ownerOf, ownersOf });
}

export function ensureDomainPathRegistry(engine) {
  ensureEngine(engine);
  if (!engine[DOMAIN_PATH_REGISTRY_KEY]) {
    defineHidden(engine, DOMAIN_PATH_REGISTRY_KEY, createDomainPathRegistry());
  }
  return engine[DOMAIN_PATH_REGISTRY_KEY];
}

export function installDomainPathControls(engine) {
  const namespace = ensureNamespace(engine);
  const registry = ensureDomainPathRegistry(engine);

  if (engine[DOMAIN_PATH_CONTROLS_KEY]) {
    return registry;
  }

  defineReservedMethod(namespace, "registerPath", (entry) => registry.register(entry), "domain path registration");
  defineReservedMethod(namespace, "path", (path) => registry.get(path), "domain path lookup");
  defineReservedMethod(namespace, "paths", () => registry.list(), "domain path listing");
  defineReservedMethod(namespace, "ownerOf", (path) => registry.ownerOf(path), "domain path ownership lookup");
  defineReservedMethod(namespace, "ownersOf", (path) => registry.ownersOf(path), "domain path membership lookup");
  defineHidden(engine, DOMAIN_PATH_CONTROLS_KEY, true);

  return registry;
}

export function registerDomainPathForKit(engine, kit) {
  if (!kit?.metadata?.domainPath) {
    return null;
  }

  const registry = installDomainPathControls(engine);
  const metadata = kit.metadata ?? {};

  return registry.register({
    path: metadata.domainPath,
    parentPath: metadata.parentDomainPath,
    ownerKitId: kit.id,
    sharedOwnership: metadata.manifestSchema === "nexusengine.atomic-kit-manifest/2",
    domain: metadata.domain,
    status: metadata.stability,
    version: metadata.version,
    metadata: {
      apiName: metadata.apiName,
      apiPath: metadata.apiPath,
      kind: metadata.kind,
      namespace: metadata.namespace
    }
  });
}
