import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "target-build-domain",
  domainPath: "n:build:target",
  parentDomainPath: "n:build",
  label: "Target",
  responsibility: "Own target registration and target-specific build providers.",
  owns: ["Own target registration and target-specific build providers."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:target"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
