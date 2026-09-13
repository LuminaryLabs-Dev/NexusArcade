import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "ir-validation-kit",
  responsibility: "Reject invalid, cyclic, unsupported, or incomplete IR.",
  domainPath: "n:build:ir",
  apiName: "irValidation",
  requires: ["n:build:ir"],
  provides: ["build:ir-validation"],
  module: "./src/core-domains/build/ir/kits/ir-validation-kit/index.js",
  exportName: "createIrValidationKit",
  publicSubpath: "./domains/build/ir/ir-validation",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
