import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "type-analysis-kit",
  responsibility: "Run typed compiler diagnostics without emitting or mutating source.",
  domainPath: "n:build:analysis",
  apiName: "typeAnalysis",
  requires: ["n:build:analysis"],
  provides: ["build:type-analysis"],
  module: "./src/core-domains/build/analysis/kits/type-analysis-kit/index.js",
  exportName: "createTypeAnalysisKit",
  publicSubpath: "./domains/build/analysis/type-analysis",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
