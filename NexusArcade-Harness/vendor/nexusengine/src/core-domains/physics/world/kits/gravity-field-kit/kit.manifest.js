import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "gravity-field-kit",
  responsibility: "Own portable deterministic uniform and point-gravity field records and sampling.",
  domainPath: "n:physics:world",
  apiName: "physicsGravityField",
  requires: ["n:physics", "physics:state-schema", "physics:command-schema", "physics:event-schema"],
  provides: ["n:physics:world", "physics:gravity-field"],
  module: "./src/core-domains/physics/world/kits/gravity-field-kit/index.js",
  exportName: "createGravityFieldKit",
  publicSubpath: "./domains/physics/world/gravity-field",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
