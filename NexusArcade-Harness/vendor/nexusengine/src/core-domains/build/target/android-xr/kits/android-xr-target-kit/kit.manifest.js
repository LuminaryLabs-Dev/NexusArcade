import { defineBuildAtomicKitManifest } from "../../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "android-xr-target-kit",
  responsibility: "Own Android ARM64 lifecycle, SDK/NDK, Gradle, APK, and OpenXR binding stages.",
  domainPath: "n:build:target:android-xr",
  apiName: "androidXrTarget",
  requires: ["n:build:target:openxr", "build:openxr-input", "build:openxr-render", "n:build:compile", "n:build:toolchain"],
  provides: ["n:build:target:android-xr", "build:android-xr-target"],
  module: "./src/core-domains/build/target/android-xr/kits/android-xr-target-kit/index.js",
  exportName: "createAndroidXrTargetKit",
  publicSubpath: "./domains/build/target/android-xr/android-xr-target",
  proofReferences: ["scripts/prove-native-package.mjs","src/core-domains/build/tests/openxr-package-source.mjs"]
});

export default kitManifest;
