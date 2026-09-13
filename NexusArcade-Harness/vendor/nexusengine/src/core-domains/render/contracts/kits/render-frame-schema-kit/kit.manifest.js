import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-frame-schema-kit",
  responsibility: "Validate and normalize portable Render frame execution records.",
  domainPath: "n:render:contracts",
  apiName: "renderFrameSchema",
  requires: ["n:render"],
  provides: ["render:frame-schema"],
  module: "./src/core-domains/render/contracts/kits/render-frame-schema-kit/index.js",
  exportName: "createRenderFrameSchemaKit",
  publicSubpath: "./domains/render/frame-schema",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
