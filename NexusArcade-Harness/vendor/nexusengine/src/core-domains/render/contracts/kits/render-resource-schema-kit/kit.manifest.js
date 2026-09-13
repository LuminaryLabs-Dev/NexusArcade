import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-resource-schema-kit",
  responsibility: "Validate and normalize portable Render resource records without exposing backend handles.",
  domainPath: "n:render:contracts",
  apiName: "renderResourceSchema",
  requires: ["n:render"],
  provides: ["render:resource-schema"],
  module: "./src/core-domains/render/contracts/kits/render-resource-schema-kit/index.js",
  exportName: "createRenderResourceSchemaKit",
  publicSubpath: "./domains/render/resource-schema",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
