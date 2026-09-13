import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "trigger-collider-kit",
  responsibility: "Normalize event-selection semantics for a sensor-backed trigger collider.",
  domainPath: "n:physics:collider",
  apiName: "physicsTriggerCollider",
  requires: ["n:physics", "physics:sensor-collider"],
  provides: ["n:physics:collider", "physics:trigger-collider"],
  module: "./src/core-domains/physics/collider/kits/trigger-collider-kit/index.js",
  exportName: "createTriggerColliderKit",
  publicSubpath: "./domains/physics/collider/trigger",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
