import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "toolchain-provision-kit",
  responsibility: "Provision approved exact official sources on demand after integrity and license checks.",
  domainPath: "n:build:toolchain",
  apiName: "toolchainProvision",
  requires: ["n:build:toolchain", "build:source-cache"],
  provides: ["build:toolchain-provision"],
  module: "./src/core-domains/build/toolchain/kits/toolchain-provision-kit/index.js",
  exportName: "createToolchainProvisionKit",
  publicSubpath: "./domains/build/toolchain/toolchain-provision",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
