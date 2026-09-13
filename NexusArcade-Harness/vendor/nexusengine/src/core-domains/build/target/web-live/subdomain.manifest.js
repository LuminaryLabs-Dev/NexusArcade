import { defineBuildSubdomainManifest } from "../../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "target-web-live-build-domain",
  domainPath: "n:build:target:web-live",
  parentDomainPath: "n:build:target",
  label: "Web Live Target",
  responsibility: "Own verified live ESM loading and content-hash browser caching.",
  owns: ["Own verified live ESM loading and content-hash browser caching."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build:target"],
  provides: ["n:build:target:web-live"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
