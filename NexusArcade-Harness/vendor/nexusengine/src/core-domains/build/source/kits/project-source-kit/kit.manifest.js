import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "project-source-kit",
  responsibility: "Read a deterministic project inventory without following links or mutating source.",
  domainPath: "n:build:source",
  apiName: "projectSource",
  requires: [],
  provides: ["n:build", "n:build:source", "build:project-source"],
  module: "./src/core-domains/build/source/kits/project-source-kit/index.js",
  exportName: "createProjectSourceKit",
  publicSubpath: "./domains/build/source/project-source",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
