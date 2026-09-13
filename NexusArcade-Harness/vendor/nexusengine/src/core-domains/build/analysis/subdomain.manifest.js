import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "analysis-build-domain",
  domainPath: "n:build:analysis",
  parentDomainPath: "n:build",
  label: "Analysis",
  responsibility: "Own real syntax, type, effect, and dependency analysis for build inputs.",
  owns: ["Own real syntax, type, effect, and dependency analysis for build inputs."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:analysis"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
