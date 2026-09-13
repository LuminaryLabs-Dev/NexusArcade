import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-step-kit",
  responsibility: "Own deterministic Physics step requests, completion ordering, and provider-neutral frame receipts.",
  domainPath: "n:physics:lifecycle",
  apiName: "physicsStep",
  requires: ["physics:installation", "physics:startup", "physics:state-schema", "physics:command-schema", "physics:event-schema"],
  provides: ["physics:step"],
  module: "./src/core-domains/physics/lifecycle/kits/physics-step-kit/index.js",
  exportName: "createPhysicsStepKit",
  publicSubpath: "./domains/physics/lifecycle/step",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
