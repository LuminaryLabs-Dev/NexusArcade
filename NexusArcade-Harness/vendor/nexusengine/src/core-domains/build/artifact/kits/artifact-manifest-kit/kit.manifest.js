import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "artifact-manifest-kit",
  responsibility: "Create canonical per-target artifact manifests.",
  domainPath: "n:build:artifact",
  apiName: "artifactManifest",
  requires: ["n:build"],
  provides: ["n:build:artifact", "build:artifact-manifest"],
  module: "./src/core-domains/build/artifact/kits/artifact-manifest-kit/index.js",
  exportName: "createArtifactManifestKit",
  publicSubpath: "./domains/build/artifact/artifact-manifest",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
