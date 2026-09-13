import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "vertex-buffer-kit",
  responsibility: "Own logical Vertex Buffer views with exact resource, layout, count, and range validation.",
  domainPath: "n:render:buffer",
  apiName: "renderVertexBuffers",
  requires: ["n:render:buffer", "render:buffer-resource", "render:buffer-layout"],
  provides: ["render:vertex-buffer"],
  module: "./src/core-domains/render/buffer/kits/vertex-buffer-kit/index.js",
  exportName: "createVertexBufferKit",
  publicSubpath: "./domains/render/buffer/vertex",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
