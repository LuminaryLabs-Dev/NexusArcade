import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "artifact-integrity-kit",
  responsibility: "Verify every artifact file against SHA-256.",
  domainPath: "n:build:artifact",
  apiName: "artifactIntegrity",
  requires: ["n:build:artifact"],
  provides: ["build:artifact-integrity"],
  module: "./src/core-domains/build/artifact/kits/artifact-integrity-kit/index.js",
  exportName: "createArtifactIntegrityKit",
  publicSubpath: "./domains/build/artifact/artifact-integrity",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
