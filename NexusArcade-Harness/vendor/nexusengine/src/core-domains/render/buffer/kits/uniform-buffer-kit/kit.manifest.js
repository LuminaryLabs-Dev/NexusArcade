import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "uniform-buffer-kit",
  responsibility: "Own logical Uniform Buffer ranges with exact layout, size, and explicit dynamic-alignment validation.",
  domainPath: "n:render:buffer",
  apiName: "renderUniformBuffers",
  requires: ["n:render:buffer", "render:buffer-resource", "render:buffer-layout"],
  provides: ["render:uniform-buffer"],
  module: "./src/core-domains/render/buffer/kits/uniform-buffer-kit/index.js",
  exportName: "createUniformBufferKit",
  publicSubpath: "./domains/render/buffer/uniform",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
