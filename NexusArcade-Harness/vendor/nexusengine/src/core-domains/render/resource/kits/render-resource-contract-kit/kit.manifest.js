import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-resource-contract-kit",
  responsibility: "Define portable Render execution-resource identity, lifecycle, operation, and provider receipt contracts.",
  domainPath: "n:render:resource",
  apiName: "renderResourceContract",
  requires: ["n:render", "render:resource-schema", "render:device-contract"],
  provides: ["n:render:resource", "render:resource-contract"],
  module: "./src/core-domains/render/resource/kits/render-resource-contract-kit/index.js",
  exportName: "createRenderResourceContractKit",
  publicSubpath: "./domains/render/resource/contract",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
