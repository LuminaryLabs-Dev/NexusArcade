import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "classification-build-domain",
  domainPath: "n:build:classification",
  parentDomainPath: "n:build",
  label: "Classification",
  responsibility: "Own whole-Kit portability, capability resolution, and fallback selection.",
  owns: ["Own whole-Kit portability, capability resolution, and fallback selection."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:classification"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
