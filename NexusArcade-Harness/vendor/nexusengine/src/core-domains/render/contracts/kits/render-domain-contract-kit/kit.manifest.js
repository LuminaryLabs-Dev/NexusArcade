import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-domain-contract-kit",
  responsibility: "Expose the canonical backend-neutral Render ownership and execution-contract boundary.",
  domainPath: "n:render",
  apiName: "render",
  requires: ["n:runtime"],
  provides: ["n:render", "n:render:contracts", "render:domain-contract"],
  module: "./src/core-domains/render/contracts/kits/render-domain-contract-kit/index.js",
  exportName: "createRenderDomainContractKit",
  publicSubpath: "./domains/render/contract",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
