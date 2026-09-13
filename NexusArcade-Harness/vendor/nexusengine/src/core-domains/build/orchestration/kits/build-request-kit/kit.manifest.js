import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "build-request-kit",
  responsibility: "Normalize one project, profile, options, and target set.",
  domainPath: "n:build:orchestration",
  apiName: "buildRequest",
  requires: ["n:build:orchestration"],
  provides: ["build:build-request"],
  module: "./src/core-domains/build/orchestration/kits/build-request-kit/index.js",
  exportName: "createBuildRequestKit",
  publicSubpath: "./domains/build/orchestration/build-request",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
