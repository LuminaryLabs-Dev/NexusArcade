import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "build-approval-kit",
  responsibility: "Require approval for the exact unchanged plan hash.",
  domainPath: "n:build:orchestration",
  apiName: "buildApproval",
  requires: ["build:build-plan"],
  provides: ["build:build-approval"],
  module: "./src/core-domains/build/orchestration/kits/build-approval-kit/index.js",
  exportName: "createBuildApprovalKit",
  publicSubpath: "./domains/build/orchestration/build-approval",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
