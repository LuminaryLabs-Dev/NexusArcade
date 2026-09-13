import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "indirect-buffer-kit",
  responsibility: "Own logical Indirect Buffer command ranges with exact type, count, stride, alignment, and range validation.",
  domainPath: "n:render:buffer",
  apiName: "renderIndirectBuffers",
  requires: ["n:render:buffer", "render:buffer-resource"],
  provides: ["render:indirect-buffer"],
  module: "./src/core-domains/render/buffer/kits/indirect-buffer-kit/index.js",
  exportName: "createIndirectBufferKit",
  publicSubpath: "./domains/render/buffer/indirect",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
