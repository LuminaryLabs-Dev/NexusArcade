import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "artifact-output-kit",
  responsibility: "Publish immutable artifacts only outside source projects.",
  domainPath: "n:build:artifact",
  apiName: "artifactOutput",
  requires: ["n:build:artifact"],
  provides: ["build:artifact-output"],
  module: "./src/core-domains/build/artifact/kits/artifact-output-kit/index.js",
  exportName: "createArtifactOutputKit",
  publicSubpath: "./domains/build/artifact/artifact-output",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
