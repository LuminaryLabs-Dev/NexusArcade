import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "shadow-texture-kit",
  responsibility: "Own provider-neutral shadow-readable depth views without owning authored shadow policy or execution.",
  domainPath: "n:render:texture",
  apiName: "renderShadowTextures",
  requires: ["n:render:texture", "render:texture-resource", "render:depth-texture"],
  provides: ["render:shadow-texture"],
  module: "./src/core-domains/render/texture/kits/shadow-texture-kit/index.js",
  exportName: "createShadowTextureKit",
  publicSubpath: "./domains/render/texture/shadow",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
