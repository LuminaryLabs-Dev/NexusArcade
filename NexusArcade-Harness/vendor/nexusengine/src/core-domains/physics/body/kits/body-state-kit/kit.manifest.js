import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-state-kit",
  responsibility: "Compose atomic portable body descriptors into one coherent provider-neutral body state.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyState",
  requires: [
    "n:physics",
    "physics:body-identity",
    "physics:body-type",
    "physics:body-pose",
    "physics:body-velocity",
    "physics:body-force",
    "physics:body-mass",
    "physics:body-inertia",
    "physics:body-damping",
    "physics:body-sleep",
    "physics:body-lifecycle"
  ],
  provides: ["n:physics:body", "physics:body-state"],
  module: "./src/core-domains/physics/body/kits/body-state-kit/index.js",
  exportName: "createBodyStateKit",
  publicSubpath: "./domains/physics/body/state",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

