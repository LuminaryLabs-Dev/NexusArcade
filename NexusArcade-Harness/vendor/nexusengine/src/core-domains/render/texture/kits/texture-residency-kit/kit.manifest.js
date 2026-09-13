import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-residency-kit",
  responsibility: "Own desired and proven resident Texture subresources derived from completed stream receipts.",
  domainPath: "n:render:texture",
  apiName: "renderTextureResidency",
  requires: ["n:render:texture", "render:texture-resource", "render:texture-stream", "render:resource-lifecycle"],
  provides: ["render:texture-residency"],
  module: "./src/core-domains/render/texture/kits/texture-residency-kit/index.js",
  exportName: "createTextureResidencyKit",
  publicSubpath: "./domains/render/texture/residency",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
