import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-cube-kit",
  responsibility: "Own logical Cube Texture views with exact identity, six-face, and mip-range validation.",
  domainPath: "n:render:texture",
  apiName: "renderTextureCubeViews",
  requires: ["n:render:texture", "render:texture-resource"],
  provides: ["render:texture-cube"],
  module: "./src/core-domains/render/texture/kits/texture-cube-kit/index.js",
  exportName: "createTextureCubeKit",
  publicSubpath: "./domains/render/texture/cube",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
