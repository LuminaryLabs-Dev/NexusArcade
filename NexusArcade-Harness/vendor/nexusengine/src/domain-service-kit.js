import { installDomainAddressability, normalizeDomainApiVisibility, registerDomainApiForKit } from "./domain-api.js";
import { normalizeDomainPath } from "./domain-path.js";
import { defineRuntimeKit, validateRuntimeKit } from "./runtime-kit.js";

export const DOMAIN_SERVICE_NAMESPACE = "n";
export const DOMAIN_SERVICE_METADATA_KIND = "domain-service-kit";

const TOKEN_PATTERN = /^[a-z][a-z0-9-]*(?::[a-z][a-z0-9-]*)+$/;
const SLUG_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function normalizeSlug(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Domain service kit requires a non-empty ${fieldName}.`);
  }
  const slug = value.trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug)) {
    throw new TypeError(`Domain service kit has an invalid ${fieldName}: ${value}.`);
  }
  return slug;
}

function toPascal(slug) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

function toCamel(slug) {
  const pascal = toPascal(slug);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function normalizeToken(token, fieldName) {
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new TypeError(`Domain service kit has an invalid ${fieldName} token.`);
  }
  const next = token.trim();
  if (!TOKEN_PATTERN.test(next)) {
    throw new TypeError(`Domain service kit has a malformed ${fieldName} token: ${token}.`);
  }
  return next;
}

function normalizeTokenList(value, fieldName) {
  if (value === undefined || value === null) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map((entry) => normalizeToken(entry, fieldName));
}

function unique(values) {
  return Array.from(new Set(values));
}

function assertNoDuplicateKeys(base = {}, extension = {}, fieldName) {
  const duplicates = Object.keys(extension).filter((key) => Object.prototype.hasOwnProperty.call(base, key));
  if (duplicates.length) {
    throw new TypeError(`Domain service kit extension has duplicate ${fieldName}: ${duplicates.join(", ")}.`);
  }
}

function systemName(entry) {
  if (typeof entry === "function") return entry.name || "anonymousSystem";
  return entry?.name ?? entry?.system?.name ?? "anonymousSystem";
}

function assertNoDuplicateSystems(baseSystems = [], extensionSystems = []) {
  const baseNames = new Set(baseSystems.map(systemName));
  const duplicates = extensionSystems.map(systemName).filter((name) => baseNames.has(name));
  if (duplicates.length) {
    throw new TypeError(`Domain service kit extension has duplicate system names: ${duplicates.join(", ")}.`);
  }
}

function normalizeOptionalDomainPath(value, fieldName) {
  if (value === undefined || value === null || value === "") return undefined;
  return normalizeDomainPath(value, fieldName);
}

function assertParentDomainPath(domainPath, parentDomainPath) {
  if (!parentDomainPath) return;
  if (domainPath === parentDomainPath) {
    throw new TypeError(`Domain service kit domainPath ${domainPath} cannot equal parentDomainPath.`);
  }
  if (!domainPath.startsWith(`${parentDomainPath}:`)) {
    throw new TypeError(`Domain service kit domainPath ${domainPath} must be nested under parentDomainPath ${parentDomainPath}.`);
  }
}

export function createDomainServiceToken(domain, service) {
  const normalizedDomain = normalizeSlug(domain, "domain");
  if (service === undefined || service === null) {
    return `${DOMAIN_SERVICE_NAMESPACE}:${normalizedDomain}`;
  }
  return `${DOMAIN_SERVICE_NAMESPACE}:${normalizedDomain}:${normalizeSlug(service, "service")}`;
}

export function isDomainServiceKit(kit) {
  return Boolean(
    kit &&
    typeof kit === "object" &&
    kit.metadata?.kind === DOMAIN_SERVICE_METADATA_KIND &&
    kit.metadata?.namespace === DOMAIN_SERVICE_NAMESPACE
  );
}

export function validateDomainServiceKit(kit) {
  validateRuntimeKit(kit);
  if (!isDomainServiceKit(kit)) {
    throw new TypeError("validateDomainServiceKit expects a domain service kit.");
  }
  normalizeSlug(kit.metadata.domain, "metadata.domain");
  normalizeDomainPath(kit.metadata.domainPath, "metadata.domainPath");
  const parentDomainPath = normalizeOptionalDomainPath(kit.metadata.parentDomainPath, "metadata.parentDomainPath");
  if (kit.metadata.apiPath !== undefined) {
    normalizeDomainPath(kit.metadata.apiPath, "metadata.apiPath");
  }
  normalizeDomainApiVisibility(kit.metadata.visibility ?? "public");
  assertParentDomainPath(kit.metadata.domainPath, parentDomainPath);
  if (typeof kit.metadata.stability !== "string" || kit.metadata.stability.trim().length === 0) {
    throw new TypeError(`Domain service kit ${kit.id} requires metadata.stability.`);
  }
  if (typeof kit.metadata.version !== "string" || kit.metadata.version.trim().length === 0) {
    throw new TypeError(`Domain service kit ${kit.id} requires metadata.version.`);
  }
  for (const token of [...(kit.provides ?? []), ...(kit.requires ?? [])]) {
    normalizeToken(token, "capability");
  }
  return kit;
}

function buildMetadata(config, domain, id, apiName) {
  const sourceMetadata = config.metadata ?? {};
  const stability = config.stability ?? sourceMetadata.stability;
  const version = config.version ?? sourceMetadata.version;
  if (typeof stability !== "string" || stability.trim().length === 0) {
    throw new TypeError(`Domain service kit ${id} requires stability.`);
  }
  if (typeof version !== "string" || version.trim().length === 0) {
    throw new TypeError(`Domain service kit ${id} requires version.`);
  }

  const domainPath = normalizeDomainPath(
    config.domainPath ?? sourceMetadata.domainPath ?? createDomainServiceToken(domain),
    "domainPath"
  );
  const parentDomainPath = normalizeOptionalDomainPath(
    config.parentDomainPath ?? sourceMetadata.parentDomainPath,
    "parentDomainPath"
  );
  assertParentDomainPath(domainPath, parentDomainPath);
  const apiSlug = apiName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const apiPath = normalizeOptionalDomainPath(
    config.apiPath ?? sourceMetadata.apiPath ?? `${domainPath}:api:${apiSlug}`,
    "apiPath"
  );
  const visibility = normalizeDomainApiVisibility(
    config.visibility ?? config.apiVisibility ?? sourceMetadata.visibility ?? sourceMetadata.apiVisibility ?? "public"
  );

  return {
    ...sourceMetadata,
    kind: DOMAIN_SERVICE_METADATA_KIND,
    namespace: DOMAIN_SERVICE_NAMESPACE,
    domain,
    domainPath,
    parentDomainPath,
    apiName,
    apiPath,
    visibility,
    stability: stability.trim(),
    version: version.trim(),
    execution: Object.freeze({
      mode: "linear",
      asyncReady: config.asyncReady !== false,
      serializableState: config.serializableState !== false,
      inputs: Object.freeze([...(config.inputs ?? sourceMetadata.execution?.inputs ?? [])]),
      outputs: Object.freeze([...(config.outputs ?? sourceMetadata.execution?.outputs ?? [])]),
      snapshot: config.snapshot ?? sourceMetadata.execution?.snapshot ?? "required",
      reset: config.reset ?? sourceMetadata.execution?.reset ?? "required"
    })
  };
}

function wrapInstall(config, domain, apiName) {
  return function installDomainServiceKit(context) {
    const { engine } = context;
    installDomainAddressability(engine);
    if (Object.prototype.hasOwnProperty.call(engine.n, apiName)) {
      throw new TypeError(`Domain service kit ${config.id ?? domain} cannot overwrite engine.n.${apiName}.`);
    }

    const api = typeof config.createApi === "function" ? config.createApi(context) : undefined;
    if (api !== undefined) {
      engine.n[apiName] = api;
    }

    const result = typeof config.install === "function" ? config.install(context) : undefined;
    if (api === undefined && result !== undefined) {
      engine.n[apiName] = result;
    }

    registerDomainApiForKit(engine, context.kit ?? { id: config.id ?? domain, metadata: {} }, apiName);
  };
}

export function defineDomainServiceKit(config = {}) {
  if (!isObject(config)) {
    throw new TypeError("defineDomainServiceKit expects a config object.");
  }

  const domain = normalizeSlug(config.domain, "domain");
  const id = config.id ?? `${DOMAIN_SERVICE_NAMESPACE}-${domain}-kit`;
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new TypeError(`Domain service kit ${domain} requires a stable id.`);
  }
  const apiName = config.apiName ?? toCamel(domain);
  if (typeof apiName !== "string" || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(apiName)) {
    throw new TypeError(`Domain service kit ${id} has an invalid apiName.`);
  }

  const metadata = buildMetadata(config, domain, id, apiName);
  const provides = unique(normalizeTokenList(config.provides, "provides"));
  const requires = unique(normalizeTokenList(config.requires, "requires"));

  const kit = defineRuntimeKit({
    ...config,
    id,
    provides,
    requires,
    metadata,
    install: wrapInstall({ ...config, id }, domain, apiName)
  });

  return validateDomainServiceKit(kit);
}

export function extendDomainServiceKit(baseKit, extensionConfig = {}) {
  validateDomainServiceKit(baseKit);
  if (!isObject(extensionConfig)) {
    throw new TypeError("extendDomainServiceKit expects an extension config object.");
  }

  assertNoDuplicateKeys(baseKit.components, extensionConfig.components, "components");
  assertNoDuplicateKeys(baseKit.resources, extensionConfig.resources, "resources");
  assertNoDuplicateKeys(baseKit.events, extensionConfig.events, "events");
  assertNoDuplicateKeys(baseKit.bindings, extensionConfig.bindings, "bindings");
  assertNoDuplicateSystems(baseKit.systems, extensionConfig.systems ?? []);

  return defineDomainServiceKit({
    ...extensionConfig,
    id: extensionConfig.id ?? `${baseKit.id}-extension`,
    domain: extensionConfig.domain ?? baseKit.metadata.domain,
    domainPath: extensionConfig.domainPath ?? baseKit.metadata.domainPath,
    parentDomainPath: extensionConfig.parentDomainPath ?? baseKit.metadata.parentDomainPath,
    apiPath: extensionConfig.apiPath ?? baseKit.metadata.apiPath,
    visibility: extensionConfig.visibility ?? baseKit.metadata.visibility,
    apiName: extensionConfig.apiName ?? `${baseKit.metadata.apiName}Extension`,
    stability: extensionConfig.stability ?? baseKit.metadata.stability,
    version: extensionConfig.version ?? baseKit.metadata.version,
    components: { ...baseKit.components, ...(extensionConfig.components ?? {}) },
    resources: { ...baseKit.resources, ...(extensionConfig.resources ?? {}) },
    events: { ...baseKit.events, ...(extensionConfig.events ?? {}) },
    systems: [...(baseKit.systems ?? []), ...(extensionConfig.systems ?? [])],
    shaders: [...(baseKit.shaders ?? []), ...(extensionConfig.shaders ?? [])],
    materials: [...(baseKit.materials ?? []), ...(extensionConfig.materials ?? [])],
    sequences: [...(baseKit.sequences ?? []), ...(extensionConfig.sequences ?? [])],
    subscriptions: [...(baseKit.subscriptions ?? []), ...(extensionConfig.subscriptions ?? [])],
    sequenceNodes: [...(baseKit.sequenceNodes ?? []), ...(extensionConfig.sequenceNodes ?? [])],
    sequenceNodeTypes: [...(baseKit.sequenceNodeTypes ?? []), ...(extensionConfig.sequenceNodeTypes ?? [])],
    sequenceNodeSubscriptions: [...(baseKit.sequenceNodeSubscriptions ?? []), ...(extensionConfig.sequenceNodeSubscriptions ?? [])],
    requires: unique([...(baseKit.requires ?? []), ...normalizeTokenList(extensionConfig.requires, "requires")]),
    provides: unique([...(baseKit.provides ?? []), ...normalizeTokenList(extensionConfig.provides, "provides")]),
    bindings: { ...baseKit.bindings, ...(extensionConfig.bindings ?? {}) },
    metadata: {
      ...(baseKit.metadata ?? {}),
      ...(extensionConfig.metadata ?? {}),
      extends: baseKit.id
    },
    initWorld(context) {
      baseKit.initWorld?.(context);
      extensionConfig.initWorld?.(context);
    },
    install(context) {
      baseKit.install?.(context);
      extensionConfig.install?.(context);
    }
  });
}
