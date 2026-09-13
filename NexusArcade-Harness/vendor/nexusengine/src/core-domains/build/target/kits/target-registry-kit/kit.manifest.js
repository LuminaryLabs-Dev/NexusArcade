import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "target-registry-kit",
  responsibility: "Register explicit target providers and reject collisions.",
  domainPath: "n:build:target",
  apiName: "targetRegistry",
  requires: ["n:build"],
  provides: ["n:build:target", "build:target-registry"],
  module: "./src/core-domains/build/target/kits/target-registry-kit/index.js",
  exportName: "createTargetRegistryKit",
  publicSubpath: "./domains/build/target/target-registry",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
