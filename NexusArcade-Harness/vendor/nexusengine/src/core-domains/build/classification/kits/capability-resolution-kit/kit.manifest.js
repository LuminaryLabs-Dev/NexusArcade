import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "capability-resolution-kit",
  responsibility: "Resolve target capabilities and exact reviewed substitutions.",
  domainPath: "n:build:classification",
  apiName: "capabilityResolution",
  requires: ["n:build:classification"],
  provides: ["build:capability-resolution"],
  module: "./src/core-domains/build/classification/kits/capability-resolution-kit/index.js",
  exportName: "createCapabilityResolutionKit",
  publicSubpath: "./domains/build/classification/capability-resolution",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
