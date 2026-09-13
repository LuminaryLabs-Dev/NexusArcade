import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "effect-analysis-kit",
  responsibility: "Classify ambient capabilities and unsupported dynamic effects from AST nodes.",
  domainPath: "n:build:analysis",
  apiName: "effectAnalysis",
  requires: ["n:build:analysis"],
  provides: ["build:effect-analysis"],
  module: "./src/core-domains/build/analysis/kits/effect-analysis-kit/index.js",
  exportName: "createEffectAnalysisKit",
  publicSubpath: "./domains/build/analysis/effect-analysis",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
