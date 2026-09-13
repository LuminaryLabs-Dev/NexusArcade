import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-resource-kit",
  responsibility: "Own exact logical Texture records derived from canonical Render Resource identities and portable formats.",
  domainPath: "n:render:texture",
  apiName: "renderTextures",
  requires: ["n:render:resource", "render:resource-identity", "render:resource-lifecycle", "render:texture-format"],
  provides: ["n:render:texture", "render:texture-resource"],
  module: "./src/core-domains/render/texture/kits/texture-resource-kit/index.js",
  exportName: "createTextureResourceKit",
  publicSubpath: "./domains/render/texture/resource",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
