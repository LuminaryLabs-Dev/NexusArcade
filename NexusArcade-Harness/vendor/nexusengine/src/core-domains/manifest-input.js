const objectSchema = Object.freeze({ type: "object", additionalProperties: true });

export function domainNode({ id, domainPath, parentDomainPath = null, label, responsibility, owns, forbiddenResponsibilities, requires = [], optional = [], provides, proofReferences = [], proofStatus = "proven", stateId = `${id}-state`, status = "stable-candidate" }) {
  if (!["proven", "pending", "rejected"].includes(proofStatus)) {
    throw new TypeError(`${domainPath} proofStatus must be proven, pending, or rejected.`);
  }
  if (proofStatus === "proven" && !proofReferences.length) {
    throw new TypeError(`${domainPath} requires explicit proof references.`);
  }
  return {
    identity: { id, domainPath, parentDomainPath, label, status },
    ownership: { responsibility, owns, forbiddenResponsibilities },
    ownedState: [{
      id: stateId,
      description: `Serializable ${label} state and registry records.`,
      schema: objectSchema,
      persistence: "snapshot",
      owner: id
    }],
    inputs: requires.map((token) => ({ id: token, description: `${label} required capability.` })),
    systems: [{ id: `${domainPath}:lifecycle`, description: `Install, validate, snapshot, reset, and replay ${label} behavior.` }],
    outputs: provides.map((token) => ({ id: token, description: `${label} provided capability.` })),
    lifecycle: {
      install: `Create one ${label} state owner and public API.`,
      duplicateInstall: `Return the installed ${label} API without duplicate state or systems.`,
      reset: `Restore the configured ${label} baseline.`,
      snapshot: `Serialize ${label} state and descriptors.`,
      replay: `Reapply equivalent ${label} inputs deterministically.`
    },
    dependencies: { requires, optional },
    settingsSchema: objectSchema,
    proof: {
      status: proofStatus,
      references: proofReferences,
      consumers: [
        { id: `${id}-direct-consumer`, description: `Direct ${label} contract fixture.` },
        { id: `${id}-installed-consumer`, description: `Installed ${label} composition fixture.` }
      ]
    }
  };
}

export function atomicKit({ id, responsibility, domainPath, apiName, requires = [], provides, module, exportName, publicSubpath, proofReferences = [], proofStatus = "proven", version = "0.0.4", status = "stable-candidate", kind = "domain-service-kit", environments = ["browser", "node", "worker"] }) {
  if (!["proven", "pending", "rejected"].includes(proofStatus)) {
    throw new TypeError(`${id} proofStatus must be proven, pending, or rejected.`);
  }
  if (proofStatus === "proven" && !proofReferences.length) {
    throw new TypeError(`${id} requires explicit proof references.`);
  }
  return {
    id,
    version,
    status,
    kind,
    responsibility,
    atomic: true,
    productNeutral: true,
    determinism: "deterministic",
    domainPath,
    parentDomainPath: domainPath.includes(":", 2) ? domainPath.slice(0, domainPath.lastIndexOf(":")) : null,
    apiName,
    requires,
    provides,
    composes: [],
    idempotency: {
      key: "kit-id-and-manifest-content",
      duplicateInstall: "Return the installed API for matching content; reject changed content for the same id."
    },
    reset: { supported: true, semantics: "Restore the configured baseline without duplicate state or systems." },
    snapshot: { supported: true, schema: objectSchema },
    environments,
    settingsSchema: objectSchema,
    source: { module, exportName, publicSubpath },
    proof: {
      status: proofStatus,
      references: proofReferences,
      consumers: [
        { id: `${id}-direct-consumer`, description: "Direct API contract fixture." },
        { id: `${id}-installed-consumer`, description: "Installed Domain composition fixture." }
      ]
    }
  };
}

export function manifestShell({ root, subdomains = [], publicEntry, publicEntries = [], publicKits = [], providers = [], adapters = [] }) {
  return {
    ...root,
    subdomains,
    publicEntry,
    publicEntries,
    publicKits,
    providers,
    adapters
  };
}
