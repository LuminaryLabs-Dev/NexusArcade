import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "build-receipt-kit",
  responsibility: "Persist aggregate and per-target exactly-once Build receipts.",
  domainPath: "n:build:orchestration",
  apiName: "buildReceipt",
  requires: ["n:build:orchestration"],
  provides: ["build:build-receipt"],
  module: "./src/core-domains/build/orchestration/kits/build-receipt-kit/index.js",
  exportName: "createBuildReceiptKit",
  publicSubpath: "./domains/build/orchestration/build-receipt",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
