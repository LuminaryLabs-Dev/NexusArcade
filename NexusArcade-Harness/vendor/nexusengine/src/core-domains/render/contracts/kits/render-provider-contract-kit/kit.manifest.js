import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-provider-contract-kit",
  responsibility: "Validate concrete Render providers without executing or retaining provider code or handles.",
  domainPath: "n:render:contracts",
  apiName: "renderProviderContract",
  requires: ["n:render"],
  provides: ["render:provider-contract"],
  module: "./src/core-domains/render/contracts/kits/render-provider-contract-kit/index.js",
  exportName: "createRenderProviderContractKit",
  publicSubpath: "./domains/render/provider-contract",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
