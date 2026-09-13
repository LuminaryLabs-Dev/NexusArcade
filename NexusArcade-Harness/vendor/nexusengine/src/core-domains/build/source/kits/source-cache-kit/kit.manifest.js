import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "source-cache-kit",
  responsibility: "Store and verify immutable source bytes by SHA-256.",
  domainPath: "n:build:source",
  apiName: "sourceCache",
  requires: ["n:build:source"],
  provides: ["build:source-cache"],
  module: "./src/core-domains/build/source/kits/source-cache-kit/index.js",
  exportName: "createSourceCacheKit",
  publicSubpath: "./domains/build/source/source-cache",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
