import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-event-schema-kit",
  responsibility: "Define ordered, portable Physics event envelopes.",
  domainPath: "n:physics:contracts",
  apiName: "physicsEventSchema",
  requires: ["n:physics"],
  provides: ["physics:event-schema"],
  module: "./src/core-domains/physics/contracts/kits/physics-event-schema-kit/index.js",
  exportName: "createPhysicsEventSchemaKit",
  publicSubpath: "./domains/physics/event-schema",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
