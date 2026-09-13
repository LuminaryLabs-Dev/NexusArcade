import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-pass-schema-kit",
  responsibility: "Validate and normalize resolved provider-facing Render pass records without owning Presentation graph planning.",
  domainPath: "n:render:contracts",
  apiName: "renderPassSchema",
  requires: ["n:render"],
  provides: ["render:pass-schema"],
  module: "./src/core-domains/render/contracts/kits/render-pass-schema-kit/index.js",
  exportName: "createRenderPassSchemaKit",
  publicSubpath: "./domains/render/pass-schema",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
