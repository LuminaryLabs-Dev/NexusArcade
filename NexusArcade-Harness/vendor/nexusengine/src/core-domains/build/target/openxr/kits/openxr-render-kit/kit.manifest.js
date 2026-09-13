import { defineBuildAtomicKitManifest } from "../../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "openxr-render-kit",
  responsibility: "Own OpenXR views, swapchains, blend modes, and per-eye submission descriptors.",
  domainPath: "n:build:target:openxr",
  apiName: "openxrRender",
  requires: ["n:build:target:openxr"],
  provides: ["build:openxr-render"],
  module: "./src/core-domains/build/target/openxr/kits/openxr-render-kit/index.js",
  exportName: "createOpenXrRenderKit",
  publicSubpath: "./domains/build/target/openxr/openxr-render",
  proofReferences: ["src/core-domains/build/tests/openxr-package-source.mjs","scripts/prove-native-package.mjs"]
});

export default kitManifest;
