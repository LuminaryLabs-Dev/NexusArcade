import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "proof-build-domain",
  domainPath: "n:build:proof",
  parentDomainPath: "n:build",
  label: "Proof",
  responsibility: "Own project immutability, runtime parity, and target validation evidence.",
  owns: ["Own project immutability, runtime parity, and target validation evidence."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:proof"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
