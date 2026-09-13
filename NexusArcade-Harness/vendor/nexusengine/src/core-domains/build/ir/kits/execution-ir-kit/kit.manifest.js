import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "execution-ir-kit",
  responsibility: "Create deterministic dependency-ordered Execution IR.",
  domainPath: "n:build:ir",
  apiName: "executionIr",
  requires: ["n:build:ir"],
  provides: ["build:execution-ir"],
  module: "./src/core-domains/build/ir/kits/execution-ir-kit/index.js",
  exportName: "createExecutionIrKit",
  publicSubpath: "./domains/build/ir/execution-ir",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
