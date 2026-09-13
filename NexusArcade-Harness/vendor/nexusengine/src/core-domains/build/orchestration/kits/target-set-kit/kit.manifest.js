import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "target-set-kit",
  responsibility: "Normalize repeated target flags into one sorted unique set.",
  domainPath: "n:build:orchestration",
  apiName: "targetSet",
  requires: ["n:build"],
  provides: ["n:build:orchestration", "build:target-set"],
  module: "./src/core-domains/build/orchestration/kits/target-set-kit/index.js",
  exportName: "createTargetSetKit",
  publicSubpath: "./domains/build/orchestration/target-set",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
