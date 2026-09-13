import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "sensor-collider-kit",
  responsibility: "Normalize non-solving sensor semantics independently from collision detection and event dispatch.",
  domainPath: "n:physics:collider",
  apiName: "physicsSensorCollider",
  requires: ["n:physics"],
  provides: ["n:physics:collider", "physics:sensor-collider"],
  module: "./src/core-domains/physics/collider/kits/sensor-collider-kit/index.js",
  exportName: "createSensorColliderKit",
  publicSubpath: "./domains/physics/collider/sensor",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
