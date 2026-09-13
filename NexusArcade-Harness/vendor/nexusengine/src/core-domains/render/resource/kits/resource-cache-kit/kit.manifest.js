import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-cache-kit",
  responsibility: "Index reusable provider resources by exact portable content identity and deterministic access order.",
  domainPath: "n:render:resource",
  apiName: "renderResourceCache",
  requires: ["n:render:resource", "render:resource-identity", "render:resource-integrity"],
  provides: ["render:resource-cache"],
  module: "./src/core-domains/render/resource/kits/resource-cache-kit/index.js",
  exportName: "createResourceCacheKit",
  publicSubpath: "./domains/render/resource/cache",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
