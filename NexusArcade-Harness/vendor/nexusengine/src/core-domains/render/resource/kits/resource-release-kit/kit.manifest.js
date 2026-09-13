import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-release-kit",
  responsibility: "Record exact Render resource release requests, provider receipts, and failures after reference safety checks.",
  domainPath: "n:render:resource",
  apiName: "renderResourceReleases",
  requires: ["n:render:resource", "render:resource-identity", "render:resource-reference", "render:device-lifecycle"],
  provides: ["render:resource-release"],
  module: "./src/core-domains/render/resource/kits/resource-release-kit/index.js",
  exportName: "createResourceReleaseKit",
  publicSubpath: "./domains/render/resource/release",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
