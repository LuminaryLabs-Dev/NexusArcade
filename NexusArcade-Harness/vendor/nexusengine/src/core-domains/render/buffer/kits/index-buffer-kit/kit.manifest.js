import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "index-buffer-kit",
  responsibility: "Own logical Index Buffer views with exact resource, format, count, alignment, and range validation.",
  domainPath: "n:render:buffer",
  apiName: "renderIndexBuffers",
  requires: ["n:render:buffer", "render:buffer-resource"],
  provides: ["render:index-buffer"],
  module: "./src/core-domains/render/buffer/kits/index-buffer-kit/index.js",
  exportName: "createIndexBufferKit",
  publicSubpath: "./domains/render/buffer/index",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
