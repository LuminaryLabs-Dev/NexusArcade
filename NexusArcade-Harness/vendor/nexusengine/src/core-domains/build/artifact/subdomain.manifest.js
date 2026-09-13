import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "artifact-build-domain",
  domainPath: "n:build:artifact",
  parentDomainPath: "n:build",
  label: "Artifact",
  responsibility: "Own content-addressed artifact caches, manifests, integrity, and external output.",
  owns: ["Own content-addressed artifact caches, manifests, integrity, and external output."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:artifact"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
