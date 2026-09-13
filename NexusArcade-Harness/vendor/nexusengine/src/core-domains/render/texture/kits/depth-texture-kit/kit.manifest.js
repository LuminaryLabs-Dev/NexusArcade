import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "depth-texture-kit",
  responsibility: "Own logical depth-stencil Texture views with exact aspect, format, and subresource qualification.",
  domainPath: "n:render:texture",
  apiName: "renderDepthTextures",
  requires: ["n:render:texture", "render:texture-resource", "render:texture-format"],
  provides: ["render:depth-texture"],
  module: "./src/core-domains/render/texture/kits/depth-texture-kit/index.js",
  exportName: "createDepthTextureKit",
  publicSubpath: "./domains/render/texture/depth",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
