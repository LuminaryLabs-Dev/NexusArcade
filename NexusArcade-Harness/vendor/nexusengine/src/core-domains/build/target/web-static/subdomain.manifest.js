import { defineBuildSubdomainManifest } from "../../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "target-web-static-build-domain",
  domainPath: "n:build:target:web-static",
  parentDomainPath: "n:build:target",
  label: "Web Static Target",
  responsibility: "Own self-contained static Web artifact materialization.",
  owns: ["Own self-contained static Web artifact materialization."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build:target"],
  provides: ["n:build:target:web-static"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
