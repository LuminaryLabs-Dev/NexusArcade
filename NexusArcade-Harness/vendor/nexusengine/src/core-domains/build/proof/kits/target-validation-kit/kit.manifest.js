import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "target-validation-kit",
  responsibility: "Require target-specific executable artifact validation.",
  domainPath: "n:build:proof",
  apiName: "targetValidation",
  requires: ["n:build:proof"],
  provides: ["build:target-validation"],
  module: "./src/core-domains/build/proof/kits/target-validation-kit/index.js",
  exportName: "createTargetValidationKit",
  publicSubpath: "./domains/build/proof/target-validation",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
