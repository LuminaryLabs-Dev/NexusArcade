import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-world-kit",
  responsibility: "Own immutable Physics world records and compose public field, scale, and region capabilities into read-only samples.",
  domainPath: "n:physics:world",
  apiName: "physicsWorld",
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:world-settings",
    "physics:gravity-field",
    "physics:force-field",
    "physics:wind-field",
    "physics:time-scale",
    "physics:simulation-region"
  ],
  provides: ["n:physics:world", "physics:world", "physics:world-registry"],
  module: "./src/core-domains/physics/world/kits/physics-world-kit/index.js",
  exportName: "createPhysicsWorldKit",
  publicSubpath: "./domains/physics/world/registry",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
