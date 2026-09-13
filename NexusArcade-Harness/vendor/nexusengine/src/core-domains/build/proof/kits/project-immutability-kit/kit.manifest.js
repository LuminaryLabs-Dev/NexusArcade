import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "project-immutability-kit",
  responsibility: "Compare before and after project fingerprints byte-for-byte.",
  domainPath: "n:build:proof",
  apiName: "projectImmutability",
  requires: ["n:build:source"],
  provides: ["n:build:proof", "build:project-immutability"],
  module: "./src/core-domains/build/proof/kits/project-immutability-kit/index.js",
  exportName: "createProjectImmutabilityKit",
  publicSubpath: "./domains/build/proof/project-immutability",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
