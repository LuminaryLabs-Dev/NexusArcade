import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-integrity-kit",
  responsibility: "Record portable integrity comparisons for exact Render resource identities.",
  domainPath: "n:render:resource",
  apiName: "renderResourceIntegrity",
  requires: ["n:render:resource", "render:resource-identity"],
  provides: ["render:resource-integrity"],
  module: "./src/core-domains/render/resource/kits/resource-integrity-kit/index.js",
  exportName: "createResourceIntegrityKit",
  publicSubpath: "./domains/render/resource/integrity",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
