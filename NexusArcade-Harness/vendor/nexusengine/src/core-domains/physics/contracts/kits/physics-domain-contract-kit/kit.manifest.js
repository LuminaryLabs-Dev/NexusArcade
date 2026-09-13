import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-domain-contract-kit",
  responsibility: "Expose the canonical backend-neutral Physics ownership and contract boundary.",
  domainPath: "n:physics",
  apiName: "physics",
  requires: ["n:runtime"],
  provides: ["n:physics", "n:physics:contracts", "physics:domain-contract"],
  module: "./src/core-domains/physics/contracts/kits/physics-domain-contract-kit/index.js",
  exportName: "createPhysicsDomainContractKit",
  publicSubpath: "./domains/physics/contract",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
