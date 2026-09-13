import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-state-schema-kit",
  responsibility: "Validate and normalize portable Physics snapshots for deterministic replay.",
  domainPath: "n:physics:contracts",
  apiName: "physicsStateSchema",
  requires: ["n:physics"],
  provides: ["physics:state-schema"],
  module: "./src/core-domains/physics/contracts/kits/physics-state-schema-kit/index.js",
  exportName: "createPhysicsStateSchemaKit",
  publicSubpath: "./domains/physics/state-schema",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
