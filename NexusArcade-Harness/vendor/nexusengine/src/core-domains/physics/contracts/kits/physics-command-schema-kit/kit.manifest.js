import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-command-schema-kit",
  responsibility: "Define deterministic, exact-once Physics command envelopes.",
  domainPath: "n:physics:contracts",
  apiName: "physicsCommandSchema",
  requires: ["n:physics"],
  provides: ["physics:command-schema"],
  module: "./src/core-domains/physics/contracts/kits/physics-command-schema-kit/index.js",
  exportName: "createPhysicsCommandSchemaKit",
  publicSubpath: "./domains/physics/command-schema",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
