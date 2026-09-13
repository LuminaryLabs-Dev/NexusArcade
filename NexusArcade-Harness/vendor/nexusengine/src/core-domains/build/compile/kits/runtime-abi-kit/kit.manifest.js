import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "runtime-abi-kit",
  responsibility: "Define the stable native runtime handle and batch-operation ABI.",
  domainPath: "n:build:compile",
  apiName: "runtimeAbi",
  requires: ["n:build:ir"],
  provides: ["n:build:compile", "build:runtime-abi"],
  module: "./src/core-domains/build/compile/kits/runtime-abi-kit/index.js",
  exportName: "createRuntimeAbiKit",
  publicSubpath: "./domains/build/compile/runtime-abi",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
