import { defineBuildSubdomainManifest } from "../../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "target-android-xr-build-domain",
  domainPath: "n:build:target:android-xr",
  parentDomainPath: "n:build:target",
  label: "Android XR Target",
  responsibility: "Own Android ARM64 OpenXR host generation, Gradle packaging, and APK validation.",
  owns: ["Own Android ARM64 OpenXR host generation, Gradle packaging, and APK validation."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build:target"],
  provides: ["n:build:target:android-xr"],
  proofReferences: ["scripts/prove-native-package.mjs","src/core-domains/build/tests/openxr-package-source.mjs"]
});

export default subdomainManifest;
