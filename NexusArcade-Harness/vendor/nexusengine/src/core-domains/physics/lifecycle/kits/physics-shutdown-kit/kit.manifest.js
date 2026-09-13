import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-shutdown-kit",
  responsibility: "Own deterministic provider shutdown requests and completion receipts.",
  domainPath: "n:physics:lifecycle",
  apiName: "physicsShutdown",
  requires: ["physics:installation", "physics:startup"],
  provides: ["physics:shutdown"],
  module: "./src/core-domains/physics/lifecycle/kits/physics-shutdown-kit/index.js",
  exportName: "createPhysicsShutdownKit",
  publicSubpath: "./domains/physics/lifecycle/shutdown",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
