import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-target-texture-kit",
  responsibility: "Own logical color attachment Texture views with exact format and subresource qualification.",
  domainPath: "n:render:texture",
  apiName: "renderTargetTextures",
  requires: ["n:render:texture", "render:texture-resource", "render:texture-format"],
  provides: ["render:target-texture"],
  module: "./src/core-domains/render/texture/kits/render-target-texture-kit/index.js",
  exportName: "createRenderTargetTextureKit",
  publicSubpath: "./domains/render/texture/render-target",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
