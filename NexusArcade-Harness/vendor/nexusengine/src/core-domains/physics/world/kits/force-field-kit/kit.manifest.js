import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "force-field-kit",
  responsibility: "Own portable deterministic non-gravity force and acceleration field records and sampling.",
  domainPath: "n:physics:world",
  apiName: "physicsForceField",
  requires: ["n:physics", "physics:state-schema", "physics:command-schema", "physics:event-schema"],
  provides: ["n:physics:world", "physics:force-field"],
  module: "./src/core-domains/physics/world/kits/force-field-kit/index.js",
  exportName: "createForceFieldKit",
  publicSubpath: "./domains/physics/world/force-field",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
