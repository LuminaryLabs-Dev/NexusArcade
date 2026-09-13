import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "kit-ir-kit",
  responsibility: "Create serializable high-level Kit IR with source lineage.",
  domainPath: "n:build:ir",
  apiName: "kitIr",
  requires: ["n:build:analysis"],
  provides: ["n:build:ir", "build:kit-ir"],
  module: "./src/core-domains/build/ir/kits/kit-ir-kit/index.js",
  exportName: "createKitIrKit",
  publicSubpath: "./domains/build/ir/kit-ir",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
