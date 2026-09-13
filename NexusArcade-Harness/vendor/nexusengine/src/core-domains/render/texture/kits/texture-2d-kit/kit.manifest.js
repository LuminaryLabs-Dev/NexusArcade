import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-2d-kit",
  responsibility: "Own logical 2D Texture views with exact identity and mip-range validation.",
  domainPath: "n:render:texture",
  apiName: "renderTexture2DViews",
  requires: ["n:render:texture", "render:texture-resource"],
  provides: ["render:texture-2d"],
  module: "./src/core-domains/render/texture/kits/texture-2d-kit/index.js",
  exportName: "createTexture2DKit",
  publicSubpath: "./domains/render/texture/2d",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
