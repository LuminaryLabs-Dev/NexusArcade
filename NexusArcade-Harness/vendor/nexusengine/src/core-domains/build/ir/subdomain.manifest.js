import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "ir-build-domain",
  domainPath: "n:build:ir",
  parentDomainPath: "n:build",
  label: "IR",
  responsibility: "Own serializable Kit IR, Execution IR, validation, and source lineage maps.",
  owns: ["Own serializable Kit IR, Execution IR, validation, and source lineage maps."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:ir"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
