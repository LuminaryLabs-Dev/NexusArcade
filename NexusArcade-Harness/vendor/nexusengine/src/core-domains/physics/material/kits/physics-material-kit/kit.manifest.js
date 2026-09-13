import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-material-kit",
  responsibility: "Own immutable portable physical material records and exact-once registry mutations.",
  domainPath: "n:physics:material",
  apiName: "physicsMaterial",
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:friction-material",
    "physics:restitution-material",
    "physics:density-material",
    "physics:surface-material",
    "physics:material-combine-policy"
  ],
  provides: ["n:physics:material", "physics:material", "physics:material-registry"],
  module: "./src/core-domains/physics/material/kits/physics-material-kit/index.js",
  exportName: "createPhysicsMaterialKit",
  publicSubpath: "./domains/physics/material/registry",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
