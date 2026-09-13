import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "wind-field-kit",
  responsibility: "Own portable deterministic physical flow-velocity field records and sampling.",
  domainPath: "n:physics:world",
  apiName: "physicsWindField",
  requires: ["n:physics", "physics:state-schema", "physics:command-schema", "physics:event-schema"],
  provides: ["n:physics:world", "physics:wind-field"],
  module: "./src/core-domains/physics/world/kits/wind-field-kit/index.js",
  exportName: "createWindFieldKit",
  publicSubpath: "./domains/physics/world/wind-field",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
