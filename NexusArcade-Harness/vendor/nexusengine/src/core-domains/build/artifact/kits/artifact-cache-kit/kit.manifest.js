import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "artifact-cache-kit",
  responsibility: "Reuse successful immutable target artifacts by plan identity.",
  domainPath: "n:build:artifact",
  apiName: "artifactCache",
  requires: ["n:build:artifact"],
  provides: ["build:artifact-cache"],
  module: "./src/core-domains/build/artifact/kits/artifact-cache-kit/index.js",
  exportName: "createArtifactCacheKit",
  publicSubpath: "./domains/build/artifact/artifact-cache",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
