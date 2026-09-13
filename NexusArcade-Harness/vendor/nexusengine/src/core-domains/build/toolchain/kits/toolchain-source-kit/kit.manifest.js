import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "toolchain-source-kit",
  responsibility: "Own immutable official toolchain and native dependency source records.",
  domainPath: "n:build:toolchain",
  apiName: "toolchainSource",
  requires: ["n:build"],
  provides: ["n:build:toolchain", "build:toolchain-source"],
  module: "./src/core-domains/build/toolchain/kits/toolchain-source-kit/index.js",
  exportName: "createToolchainSourceKit",
  publicSubpath: "./domains/build/toolchain/toolchain-source",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
