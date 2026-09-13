import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "dependency-source-kit",
  responsibility: "Resolve exact dependency source identities and recursive lockfile closure.",
  domainPath: "n:build:source",
  apiName: "dependencySource",
  requires: ["n:build:source"],
  provides: ["build:dependency-source"],
  module: "./src/core-domains/build/source/kits/dependency-source-kit/index.js",
  exportName: "createDependencySourceKit",
  publicSubpath: "./domains/build/source/dependency-source",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
