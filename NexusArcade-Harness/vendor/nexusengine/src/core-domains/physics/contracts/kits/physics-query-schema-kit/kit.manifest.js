import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-query-schema-kit",
  responsibility: "Define read-only portable Physics query request and result envelopes.",
  domainPath: "n:physics:contracts",
  apiName: "physicsQuerySchema",
  requires: ["n:physics"],
  provides: ["physics:query-schema"],
  module: "./src/core-domains/physics/contracts/kits/physics-query-schema-kit/index.js",
  exportName: "createPhysicsQuerySchemaKit",
  publicSubpath: "./domains/physics/query-schema",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
