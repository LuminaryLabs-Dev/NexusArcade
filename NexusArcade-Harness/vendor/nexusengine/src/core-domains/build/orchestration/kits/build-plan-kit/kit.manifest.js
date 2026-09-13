import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "build-plan-kit",
  responsibility: "Create the immutable deterministic multi-target plan hash.",
  domainPath: "n:build:orchestration",
  apiName: "buildPlan",
  requires: ["n:build:orchestration", "n:build:classification", "n:build:compile", "n:build:toolchain", "n:build:target"],
  provides: ["build:build-plan"],
  module: "./src/core-domains/build/orchestration/kits/build-plan-kit/index.js",
  exportName: "createBuildPlanKit",
  publicSubpath: "./domains/build/orchestration/build-plan",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
