import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "source-fingerprint-kit",
  responsibility: "Create the canonical SHA-256 project fingerprint.",
  domainPath: "n:build:source",
  apiName: "sourceFingerprint",
  requires: ["n:build:source"],
  provides: ["build:source-fingerprint"],
  module: "./src/core-domains/build/source/kits/source-fingerprint-kit/index.js",
  exportName: "createSourceFingerprintKit",
  publicSubpath: "./domains/build/source/source-fingerprint",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
