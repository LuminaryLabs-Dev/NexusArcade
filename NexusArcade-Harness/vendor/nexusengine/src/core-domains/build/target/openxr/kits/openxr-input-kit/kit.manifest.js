import { defineBuildAtomicKitManifest } from "../../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "openxr-input-kit",
  responsibility: "Own OpenXR action sets, bindings, haptics, and input snapshots.",
  domainPath: "n:build:target:openxr",
  apiName: "openxrInput",
  requires: ["n:build:target:openxr"],
  provides: ["build:openxr-input"],
  module: "./src/core-domains/build/target/openxr/kits/openxr-input-kit/index.js",
  exportName: "createOpenXrInputKit",
  publicSubpath: "./domains/build/target/openxr/openxr-input",
  proofReferences: ["src/core-domains/build/tests/openxr-package-source.mjs","scripts/prove-native-package.mjs"]
});

export default kitManifest;
