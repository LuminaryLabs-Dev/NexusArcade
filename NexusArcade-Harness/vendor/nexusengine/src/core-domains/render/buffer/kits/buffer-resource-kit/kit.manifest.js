import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "buffer-resource-kit",
  responsibility: "Own portable logical Buffer records, exact content revisions, and bounded provider update receipts.",
  domainPath: "n:render:buffer",
  apiName: "renderBuffers",
  requires: ["n:render:resource", "render:resource-identity", "render:resource-lifecycle", "render:device-queue"],
  provides: ["n:render:buffer", "render:buffer-resource"],
  module: "./src/core-domains/render/buffer/kits/buffer-resource-kit/index.js",
  exportName: "createBufferResourceKit",
  publicSubpath: "./domains/render/buffer/resource",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
