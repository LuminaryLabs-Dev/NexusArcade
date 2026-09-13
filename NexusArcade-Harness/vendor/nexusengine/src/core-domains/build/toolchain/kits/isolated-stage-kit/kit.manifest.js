import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "isolated-stage-kit",
  responsibility: "Create content-addressed build stages outside projects.",
  domainPath: "n:build:toolchain",
  apiName: "isolatedStage",
  requires: ["n:build:toolchain"],
  provides: ["build:isolated-stage"],
  module: "./src/core-domains/build/toolchain/kits/isolated-stage-kit/index.js",
  exportName: "createIsolatedStageKit",
  publicSubpath: "./domains/build/toolchain/isolated-stage",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
