import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-reset-kit",
  responsibility: "Reset composed Physics lifecycle state atomically through public capability APIs.",
  domainPath: "n:physics:lifecycle",
  apiName: "physicsReset",
  requires: ["physics:installation", "physics:startup", "physics:step", "physics:shutdown"],
  provides: ["physics:reset"],
  module: "./src/core-domains/physics/lifecycle/kits/physics-reset-kit/index.js",
  exportName: "createPhysicsResetKit",
  publicSubpath: "./domains/physics/lifecycle/reset",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
