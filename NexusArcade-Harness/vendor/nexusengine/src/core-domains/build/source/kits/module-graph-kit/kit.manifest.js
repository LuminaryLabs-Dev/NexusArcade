import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "module-graph-kit",
  responsibility: "Build a deterministic AST-derived module graph.",
  domainPath: "n:build:source",
  apiName: "moduleGraph",
  requires: ["n:build:source"],
  provides: ["build:module-graph"],
  module: "./src/core-domains/build/source/kits/module-graph-kit/index.js",
  exportName: "createModuleGraphKit",
  publicSubpath: "./domains/build/source/module-graph",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
