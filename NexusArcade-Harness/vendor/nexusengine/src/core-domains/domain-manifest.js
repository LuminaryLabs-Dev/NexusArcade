export const CORE_DOMAIN_MANIFEST_SCHEMA = "nexusengine.core-domain-manifest/2";
export const CORE_ATOMIC_KIT_MANIFEST_SCHEMA = "nexusengine.atomic-kit-manifest/2";

const clone = (value) => value === undefined ? undefined : structuredClone(value);
const asList = (value) => Array.isArray(value) ? value : value == null ? [] : [value];

function has(input, key, label) {
  if (!Object.hasOwn(input, key)) throw new TypeError(`${label} must declare ${key}.`);
  return input[key];
}

function text(value, label) {
  const result = String(value ?? "").trim();
  if (!result) throw new TypeError(`${label} requires a non-empty value.`);
  return result;
}

function identifier(value, label) {
  const result = text(value, label);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) {
    throw new TypeError(`${label} must use a lowercase semantic slug.`);
  }
  return result;
}

function contractIdentifier(value, label) {
  const result = text(value, label);
  if (!/^[a-z0-9]+(?:[.:-][a-z0-9-]+)*$/.test(result)) {
    throw new TypeError(`${label} must use a lowercase semantic contract identifier.`);
  }
  return result;
}

function domainPath(value, label) {
  const result = text(value, label);
  if (!/^n:[a-z0-9-]+(?::[a-z0-9-]+)*$/.test(result)) {
    throw new TypeError(`${label} must be a normalized n: domain path.`);
  }
  if (/^n:core(?:-|:|$)/.test(result)) {
    throw new TypeError(`${label} must be semantic and cannot use the retired n:core-* namespace.`);
  }
  return result;
}

function uniqueTextList(value, label, { allowEmpty = true } = {}) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  const result = [...new Set(value.map((entry, index) => text(entry, `${label}[${index}]`)))].sort();
  if (!allowEmpty && result.length === 0) throw new TypeError(`${label} cannot be empty.`);
  return Object.freeze(result);
}

function jsonSchema(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be a JSON Schema object.`);
  }
  if (value.type == null && value.$ref == null && value.anyOf == null && value.oneOf == null) {
    throw new TypeError(`${label} must declare type, $ref, anyOf, or oneOf.`);
  }
  return Object.freeze(clone(value));
}

function immediateParentPath(value) {
  const separator = value.lastIndexOf(":");
  return separator <= 1 ? null : value.slice(0, separator);
}

function assertImmediateParent(value, parentDomainPath, label) {
  const expected = immediateParentPath(value);
  if (parentDomainPath !== expected) {
    throw new TypeError(`${label} ${value} requires immediate parent ${expected ?? "null"}.`);
  }
}

function normalizeContractEntries(value, label) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  const ids = new Set();
  return Object.freeze(value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new TypeError(`${label}[${index}] must be an object.`);
    }
    const id = contractIdentifier(entry.id, `${label}[${index}].id`);
    if (ids.has(id)) throw new TypeError(`${label} contains duplicate id ${id}.`);
    ids.add(id);
    return Object.freeze({
      id,
      description: text(entry.description, `${label}[${index}].description`),
      schema: entry.schema == null ? null : jsonSchema(entry.schema, `${label}[${index}].schema`),
      deterministic: entry.deterministic == null ? true : Boolean(entry.deterministic)
    });
  }));
}

function normalizeOwnedState(value, label) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  const ids = new Set();
  return Object.freeze(value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new TypeError(`${label}[${index}] must be an object.`);
    }
    const id = identifier(entry.id, `${label}[${index}].id`);
    if (ids.has(id)) throw new TypeError(`${label} contains duplicate id ${id}.`);
    ids.add(id);
    return Object.freeze({
      id,
      description: text(entry.description, `${label}[${index}].description`),
      schema: jsonSchema(entry.schema, `${label}[${index}].schema`),
      persistence: String(entry.persistence ?? "snapshot"),
      owner: String(entry.owner ?? "domain")
    });
  }));
}

function normalizeLifecycle(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  return Object.freeze({
    install: text(value.install, `${label}.install`),
    duplicateInstall: text(value.duplicateInstall, `${label}.duplicateInstall`),
    reset: text(value.reset, `${label}.reset`),
    snapshot: text(value.snapshot, `${label}.snapshot`),
    replay: text(value.replay, `${label}.replay`)
  });
}

function normalizeProof(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  const status = String(value.status ?? "");
  if (!["proven", "pending", "rejected"].includes(status)) {
    throw new TypeError(`${label}.status must be proven, pending, or rejected.`);
  }
  const references = uniqueTextList(has(value, "references", label), `${label}.references`, { allowEmpty: status !== "proven" });
  const consumers = normalizeContractEntries(has(value, "consumers", label), `${label}.consumers`);
  if (status === "proven" && references.length === 0) {
    throw new TypeError(`${label}.references cannot be empty for proven behavior.`);
  }
  return Object.freeze({ status, references, consumers });
}

function normalizeDependencies(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  return Object.freeze({
    requires: uniqueTextList(has(value, "requires", label), `${label}.requires`),
    optional: uniqueTextList(has(value, "optional", label), `${label}.optional`)
  });
}

function normalizeIdentity(value, label, defaultParentDomainPath) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  const path = domainPath(value.domainPath, `${label}.domainPath`);
  const parentDomainPath = value.parentDomainPath === undefined
    ? defaultParentDomainPath
    : value.parentDomainPath == null
      ? null
      : domainPath(value.parentDomainPath, `${label}.parentDomainPath`);
  assertImmediateParent(path, parentDomainPath, label);
  return Object.freeze({
    id: identifier(value.id, `${label}.id`),
    domainPath: path,
    parentDomainPath,
    label: text(value.label, `${label}.label`),
    status: text(value.status, `${label}.status`)
  });
}

function normalizeOwnership(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object.`);
  }
  return Object.freeze({
    responsibility: text(value.responsibility, `${label}.responsibility`),
    owns: uniqueTextList(has(value, "owns", label), `${label}.owns`, { allowEmpty: false }),
    forbiddenResponsibilities: uniqueTextList(
      has(value, "forbiddenResponsibilities", label),
      `${label}.forbiddenResponsibilities`,
      { allowEmpty: false }
    )
  });
}

function normalizeDomainNode(input, label, defaultParentDomainPath = null) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError(`${label} must be an object.`);
  }
  const identity = normalizeIdentity(has(input, "identity", label), `${label}.identity`, defaultParentDomainPath);
  const ownership = normalizeOwnership(has(input, "ownership", label), `${label}.ownership`);
  const dependencies = normalizeDependencies(has(input, "dependencies", label), `${label}.dependencies`);
  return Object.freeze({
    identity,
    ownership,
    ownedState: normalizeOwnedState(has(input, "ownedState", label), `${label}.ownedState`),
    inputs: normalizeContractEntries(has(input, "inputs", label), `${label}.inputs`),
    systems: normalizeContractEntries(has(input, "systems", label), `${label}.systems`),
    outputs: normalizeContractEntries(has(input, "outputs", label), `${label}.outputs`),
    lifecycle: normalizeLifecycle(has(input, "lifecycle", label), `${label}.lifecycle`),
    dependencies,
    settingsSchema: jsonSchema(has(input, "settingsSchema", label), `${label}.settingsSchema`),
    proof: normalizeProof(has(input, "proof", label), `${label}.proof`)
  });
}

function normalizeProviderOrAdapter(value, label, allowedPaths) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  const ids = new Set();
  return Object.freeze(value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new TypeError(`${label}[${index}] must be an object.`);
    }
    const id = identifier(entry.id, `${label}[${index}].id`);
    if (ids.has(id)) throw new TypeError(`${label} contains duplicate id ${id}.`);
    ids.add(id);
    const ownerPath = domainPath(entry.domainPath, `${label}[${index}].domainPath`);
    if (!allowedPaths.has(ownerPath)) throw new TypeError(`${label}[${index}] references undeclared domain ${ownerPath}.`);
    return Object.freeze({
      id,
      domainPath: ownerPath,
      responsibility: text(entry.responsibility, `${label}[${index}].responsibility`),
      source: entry.source == null ? null : Object.freeze(clone(entry.source)),
      environments: uniqueTextList(entry.environments ?? [], `${label}[${index}].environments`),
      proofReferences: uniqueTextList(entry.proofReferences ?? [], `${label}[${index}].proofReferences`)
    });
  }));
}

function normalizePublicEntries(value, label, allowedPaths) {
  if (!Array.isArray(value)) throw new TypeError(`${label} must be an array.`);
  const subpaths = new Set();
  return Object.freeze(value.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new TypeError(`${label}[${index}] must be an object.`);
    }
    const ownerPath = domainPath(entry.domainPath, `${label}[${index}].domainPath`);
    if (!allowedPaths.has(ownerPath)) throw new TypeError(`${label}[${index}] references undeclared domain ${ownerPath}.`);
    const subpath = text(entry.subpath, `${label}[${index}].subpath`);
    if (subpaths.has(subpath)) throw new TypeError(`${label} contains duplicate subpath ${subpath}.`);
    subpaths.add(subpath);
    return Object.freeze({
      domainPath: ownerPath,
      subpath,
      module: text(entry.module, `${label}[${index}].module`)
    });
  }));
}

function normalizeAtomicKit(input, allowedPaths) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("Core atomic Kit must be an object.");
  }
  const id = identifier(input.id, "Core atomic Kit id");
  const ownerPath = domainPath(input.domainPath, `Core atomic Kit ${id} domainPath`);
  if (!allowedPaths.has(ownerPath)) throw new TypeError(`Core atomic Kit ${id} references undeclared domain ${ownerPath}.`);
  if (input.atomic !== true || input.productNeutral !== true) {
    throw new TypeError(`Core atomic Kit ${id} must explicitly declare atomic and productNeutral as true.`);
  }
  const source = has(input, "source", `Core atomic Kit ${id}`);
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new TypeError(`Core atomic Kit ${id}.source must be an object.`);
  }
  const idempotency = has(input, "idempotency", `Core atomic Kit ${id}`);
  const reset = has(input, "reset", `Core atomic Kit ${id}`);
  const snapshot = has(input, "snapshot", `Core atomic Kit ${id}`);
  return Object.freeze({
    schema: CORE_ATOMIC_KIT_MANIFEST_SCHEMA,
    id,
    version: text(input.version, `Core atomic Kit ${id} version`),
    status: text(input.status, `Core atomic Kit ${id} status`),
    kind: text(input.kind, `Core atomic Kit ${id} kind`),
    responsibility: text(input.responsibility, `Core atomic Kit ${id} responsibility`),
    atomic: true,
    productNeutral: true,
    determinism: text(input.determinism, `Core atomic Kit ${id} determinism`),
    domainPath: ownerPath,
    parentDomainPath: input.parentDomainPath == null ? null : domainPath(input.parentDomainPath, `Core atomic Kit ${id} parentDomainPath`),
    apiName: input.apiName == null ? null : text(input.apiName, `Core atomic Kit ${id} apiName`),
    requires: uniqueTextList(has(input, "requires", `Core atomic Kit ${id}`), `Core atomic Kit ${id}.requires`),
    provides: uniqueTextList(has(input, "provides", `Core atomic Kit ${id}`), `Core atomic Kit ${id}.provides`, { allowEmpty: false }),
    composes: uniqueTextList(has(input, "composes", `Core atomic Kit ${id}`), `Core atomic Kit ${id}.composes`),
    idempotency: Object.freeze({
      key: text(idempotency.key, `Core atomic Kit ${id}.idempotency.key`),
      duplicateInstall: text(idempotency.duplicateInstall, `Core atomic Kit ${id}.idempotency.duplicateInstall`)
    }),
    reset: Object.freeze({
      supported: Boolean(reset.supported),
      semantics: text(reset.semantics, `Core atomic Kit ${id}.reset.semantics`)
    }),
    snapshot: Object.freeze({
      supported: Boolean(snapshot.supported),
      schema: jsonSchema(snapshot.schema, `Core atomic Kit ${id}.snapshot.schema`)
    }),
    environments: uniqueTextList(has(input, "environments", `Core atomic Kit ${id}`), `Core atomic Kit ${id}.environments`, { allowEmpty: false }),
    settingsSchema: jsonSchema(has(input, "settingsSchema", `Core atomic Kit ${id}`), `Core atomic Kit ${id}.settingsSchema`),
    source: Object.freeze({
      module: text(source.module, `Core atomic Kit ${id}.source.module`),
      exportName: text(source.exportName, `Core atomic Kit ${id}.source.exportName`),
      publicSubpath: text(source.publicSubpath, `Core atomic Kit ${id}.source.publicSubpath`)
    }),
    proof: normalizeProof(has(input, "proof", `Core atomic Kit ${id}`), `Core atomic Kit ${id}.proof`)
  });
}

export function defineCoreDomainManifest(input = {}) {
  const root = normalizeDomainNode(input, "Core domain");
  const subdomains = asList(has(input, "subdomains", "Core domain")).map((entry, index) =>
    normalizeDomainNode(entry, `Core subdomain[${index}]`, root.identity.domainPath)
  );
  const allowedPaths = new Set([root.identity.domainPath, ...subdomains.map((entry) => entry.identity.domainPath)]);
  for (const subdomain of subdomains) {
    if (!allowedPaths.has(subdomain.identity.parentDomainPath)) {
      throw new TypeError(`Core subdomain ${subdomain.identity.domainPath} has undeclared parent ${subdomain.identity.parentDomainPath}.`);
    }
  }
  const publicKits = asList(has(input, "publicKits", "Core domain")).map((entry) => normalizeAtomicKit(entry, allowedPaths));
  const kitIds = new Set();
  const publicSubpaths = new Set();
  for (const kit of publicKits) {
    if (kitIds.has(kit.id)) throw new TypeError(`Duplicate Core atomic Kit id: ${kit.id}.`);
    if (publicSubpaths.has(kit.source.publicSubpath)) throw new TypeError(`Duplicate Core public subpath: ${kit.source.publicSubpath}.`);
    kitIds.add(kit.id);
    publicSubpaths.add(kit.source.publicSubpath);
  }
  return Object.freeze({
    schema: CORE_DOMAIN_MANIFEST_SCHEMA,
    ...root.identity,
    purpose: root.ownership.responsibility,
    ownership: root.ownership,
    ownedState: root.ownedState,
    inputs: root.inputs,
    systems: root.systems,
    outputs: root.outputs,
    lifecycle: root.lifecycle,
    dependencies: root.dependencies,
    requires: root.dependencies.requires,
    provides: Object.freeze(root.outputs.map((entry) => entry.id)),
    settingsSchema: root.settingsSchema,
    proof: root.proof,
    publicEntry: Object.freeze(clone(has(input, "publicEntry", "Core domain"))),
    publicEntries: normalizePublicEntries(input.publicEntries ?? [], "Core domain.publicEntries", allowedPaths),
    subdomains: Object.freeze(subdomains),
    publicKits: Object.freeze(publicKits),
    kits: Object.freeze(publicKits),
    providers: normalizeProviderOrAdapter(has(input, "providers", "Core domain"), "Core domain.providers", allowedPaths),
    adapters: normalizeProviderOrAdapter(has(input, "adapters", "Core domain"), "Core domain.adapters", allowedPaths)
  });
}

export function flattenCoreDomainManifests(manifests = []) {
  const domains = [];
  const kits = [];
  const domainPaths = new Set();
  const kitIds = new Set();
  const publicModules = new Map();
  for (const manifest of manifests) {
    if (manifest?.schema !== CORE_DOMAIN_MANIFEST_SCHEMA) {
      throw new TypeError("Core domain catalog contains an invalid manifest.");
    }
    const nodes = [manifest, ...manifest.subdomains];
    for (const node of nodes) {
      const identity = node.identity ?? node;
      const ownership = node.ownership;
      if (domainPaths.has(identity.domainPath)) throw new TypeError(`Core domain path collision: ${identity.domainPath}.`);
      domainPaths.add(identity.domainPath);
      domains.push(Object.freeze({
        id: identity.id,
        domainPath: identity.domainPath,
        parentDomainPath: identity.parentDomainPath,
        label: identity.label,
        status: identity.status,
        responsibility: ownership.responsibility,
        ownedMeaning: ownership.owns,
        forbiddenResponsibilities: ownership.forbiddenResponsibilities,
        ownedState: node.ownedState,
        inputs: node.inputs,
        systems: node.systems,
        outputs: node.outputs,
        lifecycle: node.lifecycle,
        requires: node.dependencies.requires,
        optionalDependencies: node.dependencies.optional,
        settingsSchema: node.settingsSchema,
        proof: node.proof
      }));
    }
    const entry = manifest.publicEntry;
    if (!entry || typeof entry !== "object") throw new TypeError(`Core domain ${manifest.id} requires publicEntry.`);
    const domainSubpath = text(entry.subpath, `Core domain ${manifest.id} publicEntry.subpath`);
    const domainModule = text(entry.module, `Core domain ${manifest.id} publicEntry.module`);
    if (publicModules.has(domainSubpath)) throw new TypeError(`Core public subpath collision: ${domainSubpath}.`);
    publicModules.set(domainSubpath, domainModule);
    for (const publicEntry of manifest.publicEntries ?? []) {
      const subpath = text(publicEntry.subpath, `Core domain ${manifest.id} publicEntries.subpath`);
      const module = text(publicEntry.module, `Core domain ${manifest.id} publicEntries.module`);
      if (publicModules.has(subpath)) throw new TypeError(`Core public subpath collision: ${subpath}.`);
      publicModules.set(subpath, module);
    }
    for (const kit of manifest.publicKits) {
      if (kitIds.has(kit.id)) throw new TypeError(`Core atomic Kit collision: ${kit.id}.`);
      if (publicModules.has(kit.source.publicSubpath)) throw new TypeError(`Core public subpath collision: ${kit.source.publicSubpath}.`);
      kitIds.add(kit.id);
      publicModules.set(kit.source.publicSubpath, kit.source.module);
      kits.push(kit);
    }
  }
  for (const domain of domains) {
    if (domain.parentDomainPath && !domainPaths.has(domain.parentDomainPath)) {
      throw new TypeError(`Core domain ${domain.domainPath} has undeclared parent ${domain.parentDomainPath}.`);
    }
  }
  return Object.freeze({
    schema: "nexusengine.core-domain-catalog/2",
    domains: Object.freeze(domains),
    kits: Object.freeze(kits),
    packageExports: Object.freeze(Object.fromEntries([...publicModules].sort(([left], [right]) => left.localeCompare(right))))
  });
}
