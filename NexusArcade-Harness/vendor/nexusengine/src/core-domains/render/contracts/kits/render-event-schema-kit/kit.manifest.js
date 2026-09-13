import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-event-schema-kit",
  responsibility: "Validate and normalize ordered portable Render lifecycle and execution events.",
  domainPath: "n:render:contracts",
  apiName: "renderEventSchema",
  requires: ["n:render"],
  provides: ["render:event-schema"],
  module: "./src/core-domains/render/contracts/kits/render-event-schema-kit/index.js",
  exportName: "createRenderEventSchemaKit",
  publicSubpath: "./domains/render/event-schema",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
