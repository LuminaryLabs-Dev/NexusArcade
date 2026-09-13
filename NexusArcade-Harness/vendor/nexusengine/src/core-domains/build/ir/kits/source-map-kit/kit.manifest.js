import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "source-map-kit",
  responsibility: "Map generated execution operations to source AST identities.",
  domainPath: "n:build:ir",
  apiName: "sourceMap",
  requires: ["n:build:ir"],
  provides: ["build:source-map"],
  module: "./src/core-domains/build/ir/kits/source-map-kit/index.js",
  exportName: "createSourceMapKit",
  publicSubpath: "./domains/build/ir/source-map",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
