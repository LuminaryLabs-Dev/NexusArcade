import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "process-execution-kit",
  responsibility: "Run argument-array commands inside an allowed Build stage.",
  domainPath: "n:build:toolchain",
  apiName: "processExecution",
  requires: ["n:build:toolchain"],
  provides: ["build:process-execution"],
  module: "./src/core-domains/build/toolchain/kits/process-execution-kit/index.js",
  exportName: "createProcessExecutionKit",
  publicSubpath: "./domains/build/toolchain/process-execution",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
