import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "mipmap-kit",
  responsibility: "Own explicit portable Texture mip-chain plans with exact contiguous levels and source identities.",
  domainPath: "n:render:texture",
  apiName: "renderTextureMipmaps",
  requires: ["n:render:texture", "render:texture-resource"],
  provides: ["render:texture-mipmap"],
  module: "./src/core-domains/render/texture/kits/mipmap-kit/index.js",
  exportName: "createMipmapKit",
  publicSubpath: "./domains/render/texture/mipmap",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
