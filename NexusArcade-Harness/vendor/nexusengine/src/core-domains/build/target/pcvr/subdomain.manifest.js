import { defineBuildSubdomainManifest } from "../../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "target-pcvr-build-domain",
  domainPath: "n:build:target:pcvr",
  parentDomainPath: "n:build:target",
  label: "PCVR Target",
  responsibility: "Own Windows x64 OpenXR host generation, executable packaging, and validation.",
  owns: ["Own Windows x64 OpenXR host generation, executable packaging, and validation."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build:target"],
  provides: ["n:build:target:pcvr"],
  proofReferences: ["scripts/prove-native-package.mjs","src/core-domains/build/tests/openxr-package-source.mjs"]
});

export default subdomainManifest;
