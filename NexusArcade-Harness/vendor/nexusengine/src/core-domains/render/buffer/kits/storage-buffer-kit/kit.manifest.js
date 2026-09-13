import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "storage-buffer-kit",
  responsibility: "Own logical Storage Buffer ranges with explicit access, layout, element-count, and range validation.",
  domainPath: "n:render:buffer",
  apiName: "renderStorageBuffers",
  requires: ["n:render:buffer", "render:buffer-resource", "render:buffer-layout"],
  provides: ["render:storage-buffer"],
  module: "./src/core-domains/render/buffer/kits/storage-buffer-kit/index.js",
  exportName: "createStorageBufferKit",
  publicSubpath: "./domains/render/buffer/storage",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
