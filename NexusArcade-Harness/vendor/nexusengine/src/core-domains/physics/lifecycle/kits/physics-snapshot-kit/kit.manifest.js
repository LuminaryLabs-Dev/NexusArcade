import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-snapshot-kit",
  responsibility: "Capture and atomically restore portable snapshots of composed Physics lifecycle state.",
  domainPath: "n:physics:lifecycle",
  apiName: "physicsSnapshot",
  requires: ["physics:installation", "physics:startup", "physics:step", "physics:shutdown", "physics:reset"],
  provides: ["physics:snapshot"],
  module: "./src/core-domains/physics/lifecycle/kits/physics-snapshot-kit/index.js",
  exportName: "createPhysicsSnapshotKit",
  publicSubpath: "./domains/physics/lifecycle/snapshot",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
