import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-array-kit",
  responsibility: "Own logical 2D Texture Array views with exact identity, layer-range, and mip-range validation.",
  domainPath: "n:render:texture",
  apiName: "renderTextureArrayViews",
  requires: ["n:render:texture", "render:texture-resource"],
  provides: ["render:texture-array"],
  module: "./src/core-domains/render/texture/kits/texture-array-kit/index.js",
  exportName: "createTextureArrayKit",
  publicSubpath: "./domains/render/texture/array",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
