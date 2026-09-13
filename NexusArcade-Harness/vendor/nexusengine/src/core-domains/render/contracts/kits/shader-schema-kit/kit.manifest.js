import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "shader-schema-kit",
  responsibility: "Validate and normalize portable shader-interface records shared by Render providers.",
  domainPath: "n:render:contracts",
  apiName: "renderShaderSchema",
  requires: ["n:render"],
  provides: ["render:shader-schema"],
  module: "./src/core-domains/render/contracts/kits/shader-schema-kit/index.js",
  exportName: "createShaderSchemaKit",
  publicSubpath: "./domains/render/shader-schema",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
