import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "toolchain-build-domain",
  domainPath: "n:build:toolchain",
  parentDomainPath: "n:build",
  label: "Toolchain",
  responsibility: "Own immutable toolchain sources, discovery, approved provisioning, isolated stages, and process execution.",
  owns: ["Own immutable toolchain sources, discovery, approved provisioning, isolated stages, and process execution."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:toolchain"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
