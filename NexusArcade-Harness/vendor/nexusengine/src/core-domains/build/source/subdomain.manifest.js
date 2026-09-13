import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "source-build-domain",
  domainPath: "n:build:source",
  parentDomainPath: "n:build",
  label: "Source",
  responsibility: "Own read-only project source, immutable dependency identities, content caches, fingerprints, and module graphs.",
  owns: ["Own read-only project source, immutable dependency identities, content caches, fingerprints, and module graphs."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:source"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
