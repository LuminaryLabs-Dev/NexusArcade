import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-lifecycle-kit",
  responsibility: "Own the portable lifecycle state of exact Render resource identities using explicit upload and release receipts.",
  domainPath: "n:render:resource",
  apiName: "renderResourceLifecycle",
  requires: [
    "n:render:resource",
    "render:resource-identity",
    "render:resource-reference",
    "render:resource-state",
    "render:resource-integrity",
    "render:resource-upload",
    "render:resource-release"
  ],
  provides: ["render:resource-lifecycle"],
  module: "./src/core-domains/render/resource/kits/resource-lifecycle-kit/index.js",
  exportName: "createResourceLifecycleKit",
  publicSubpath: "./domains/render/resource/lifecycle",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
