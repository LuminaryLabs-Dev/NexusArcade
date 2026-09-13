import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "fallback-selection-kit",
  responsibility: "Select fail-closed whole-Kit fallback per target and profile.",
  domainPath: "n:build:classification",
  apiName: "fallbackSelection",
  requires: ["n:build:classification"],
  provides: ["build:fallback-selection"],
  module: "./src/core-domains/build/classification/kits/fallback-selection-kit/index.js",
  exportName: "createFallbackSelectionKit",
  publicSubpath: "./domains/build/classification/fallback-selection",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
