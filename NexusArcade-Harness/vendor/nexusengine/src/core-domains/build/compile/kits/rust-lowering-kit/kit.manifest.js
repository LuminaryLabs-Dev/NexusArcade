import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "rust-lowering-kit",
  responsibility: "Lower supported Execution IR into deterministic Rust source.",
  domainPath: "n:build:compile",
  apiName: "rustLowering",
  requires: ["n:build:compile"],
  provides: ["build:rust-lowering"],
  module: "./src/core-domains/build/compile/kits/rust-lowering-kit/index.js",
  exportName: "createRustLoweringKit",
  publicSubpath: "./domains/build/compile/rust-lowering",
  proofReferences: ["src/core-domains/build/tests/native-lowering.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
