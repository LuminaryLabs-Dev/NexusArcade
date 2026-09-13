import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "texture-stream-kit",
  responsibility: "Own exact Texture subresource stream requests and portable provider completion or failure receipts.",
  domainPath: "n:render:texture",
  apiName: "renderTextureStreams",
  requires: ["n:render:texture", "render:texture-resource", "render:texture-format", "render:texture-mipmap", "render:buffer-resource", "render:resource-lifecycle", "render:device-queue"],
  provides: ["render:texture-stream"],
  module: "./src/core-domains/render/texture/kits/texture-stream-kit/index.js",
  exportName: "createTextureStreamKit",
  publicSubpath: "./domains/render/texture/stream",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
