import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "dependency-analysis-kit",
  responsibility: "Prove relative and external dependency closure.",
  domainPath: "n:build:analysis",
  apiName: "dependencyAnalysis",
  requires: ["n:build:analysis"],
  provides: ["build:dependency-analysis"],
  module: "./src/core-domains/build/analysis/kits/dependency-analysis-kit/index.js",
  exportName: "createDependencyAnalysisKit",
  publicSubpath: "./domains/build/analysis/dependency-analysis",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
