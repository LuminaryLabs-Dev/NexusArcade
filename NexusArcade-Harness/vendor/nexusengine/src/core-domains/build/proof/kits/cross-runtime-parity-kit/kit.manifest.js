import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "cross-runtime-parity-kit",
  responsibility: "Compare canonical replay outputs across target runtimes.",
  domainPath: "n:build:proof",
  apiName: "crossRuntimeParity",
  requires: ["n:build:proof"],
  provides: ["build:cross-runtime-parity"],
  module: "./src/core-domains/build/proof/kits/cross-runtime-parity-kit/index.js",
  exportName: "createCrossRuntimeParityKit",
  publicSubpath: "./domains/build/proof/cross-runtime-parity",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
