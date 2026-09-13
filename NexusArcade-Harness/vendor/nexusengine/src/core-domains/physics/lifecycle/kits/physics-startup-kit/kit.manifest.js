import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-startup-kit",
  responsibility: "Own deterministic startup requests and provider-readiness receipts.",
  domainPath: "n:physics:lifecycle",
  apiName: "physicsStartup",
  requires: ["physics:installation", "physics:provider-contract"],
  provides: ["physics:startup"],
  module: "./src/core-domains/physics/lifecycle/kits/physics-startup-kit/index.js",
  exportName: "createPhysicsStartupKit",
  publicSubpath: "./domains/physics/lifecycle/startup",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
