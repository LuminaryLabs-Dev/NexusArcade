import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-provider-contract-kit",
  responsibility: "Describe and validate backend Physics providers without owning a concrete solver.",
  domainPath: "n:physics:contracts",
  apiName: "physicsProviderContract",
  requires: ["n:physics"],
  provides: ["physics:provider-contract"],
  module: "./src/core-domains/physics/contracts/kits/physics-provider-contract-kit/index.js",
  exportName: "createPhysicsProviderContractKit",
  publicSubpath: "./domains/physics/provider-contract",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
