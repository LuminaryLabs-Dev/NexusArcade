import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-format-kit",
  responsibility: "Own portable Texture format aspects, block layout, and provider-neutral capability declarations.",
  domainPath: "n:render:texture",
  apiName: "renderTextureFormats",
  requires: ["n:render:resource"],
  provides: ["render:texture-format"],
  module: "./src/core-domains/render/texture/kits/texture-format-kit/index.js",
  exportName: "createTextureFormatKit",
  publicSubpath: "./domains/render/texture/format",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
