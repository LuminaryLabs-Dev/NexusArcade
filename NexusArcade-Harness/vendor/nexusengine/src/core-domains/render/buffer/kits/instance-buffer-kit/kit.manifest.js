import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "instance-buffer-kit",
  responsibility: "Own logical Instance Buffer views with exact resource, layout, count, and range validation.",
  domainPath: "n:render:buffer",
  apiName: "renderInstanceBuffers",
  requires: ["n:render:buffer", "render:buffer-resource", "render:buffer-layout"],
  provides: ["render:instance-buffer"],
  module: "./src/core-domains/render/buffer/kits/instance-buffer-kit/index.js",
  exportName: "createInstanceBufferKit",
  publicSubpath: "./domains/render/buffer/instance",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
