import { CORE_DOMAIN_CATALOG, CORE_REGISTRY_SHA256 } from "./catalog.js";

const contractsById = new Map(CORE_DOMAIN_CATALOG.kits.map((record) => [record.id, record]));

function assertMatching(value, expected, label) {
  if (value !== undefined && value !== null && value !== expected) {
    throw new TypeError(`${label} must match its Core manifest: expected ${expected}, received ${value}.`);
  }
}

export function getManifestKitContract(id) {
  return contractsById.get(String(id ?? "")) ?? null;
}

export function applyManifestKitContract(config = {}) {
  const contract = getManifestKitContract(config.manifestId ?? config.id);
  if (!contract) return config;

  assertMatching(config.id, contract.id, `${contract.id}.id`);
  assertMatching(config.domainPath, contract.domainPath, `${contract.id}.domainPath`);
  assertMatching(config.parentDomainPath, contract.parentDomainPath, `${contract.id}.parentDomainPath`);
  assertMatching(config.apiName, contract.apiName, `${contract.id}.apiName`);

  return {
    ...config,
    id: contract.id,
    version: contract.version,
    stability: contract.status,
    domainPath: contract.domainPath,
    parentDomainPath: contract.parentDomainPath ?? undefined,
    apiName: contract.apiName,
    requires: [...contract.requires],
    provides: [...contract.provides],
    metadata: {
      ...(config.metadata ?? {}),
      manifestSchema: contract.schema,
      manifestKind: contract.kind,
      manifestEnvironments: [...contract.environments],
      manifestSource: { ...contract.source },
      manifestFingerprint: `sha256:${CORE_REGISTRY_SHA256}`
    }
  };
}
