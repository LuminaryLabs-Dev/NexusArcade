import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "toolchain-discovery-kit",
  responsibility: "Discover installed toolchains without shell evaluation.",
  domainPath: "n:build:toolchain",
  apiName: "toolchainDiscovery",
  requires: ["n:build:toolchain"],
  provides: ["build:toolchain-discovery"],
  module: "./src/core-domains/build/toolchain/kits/toolchain-discovery-kit/index.js",
  exportName: "createToolchainDiscoveryKit",
  publicSubpath: "./domains/build/toolchain/toolchain-discovery",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
