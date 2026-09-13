import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "portability-classifier-kit",
  responsibility: "Classify each whole module and composition as native, native-adapter, JavaScript, or unsupported.",
  domainPath: "n:build:classification",
  apiName: "portabilityClassifier",
  requires: ["n:build:ir"],
  provides: ["n:build:classification", "build:portability-classifier"],
  module: "./src/core-domains/build/classification/kits/portability-classifier-kit/index.js",
  exportName: "createPortabilityClassifierKit",
  publicSubpath: "./domains/build/classification/portability-classifier",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
