import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "compile-build-domain",
  domainPath: "n:build:compile",
  parentDomainPath: "n:build",
  label: "Compile",
  responsibility: "Own deterministic Rust lowering, JavaScript fallback descriptors, runtime ABI, and native link plans.",
  owns: ["Own deterministic Rust lowering, JavaScript fallback descriptors, runtime ABI, and native link plans."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:compile"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
