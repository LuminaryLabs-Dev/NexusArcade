import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "buffer-layout-kit",
  responsibility: "Own explicit portable Buffer field formats, member offsets, alignments, and stride.",
  domainPath: "n:render:buffer",
  apiName: "renderBufferLayouts",
  requires: ["n:render:buffer", "render:buffer-resource"],
  provides: ["render:buffer-layout"],
  module: "./src/core-domains/render/buffer/kits/buffer-layout-kit/index.js",
  exportName: "createBufferLayoutKit",
  publicSubpath: "./domains/render/buffer/layout",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
