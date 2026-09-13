import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collision-mask-kit",
  responsibility: "Normalize a deterministic bounded collision-layer set and its portable bit value.",
  domainPath: "n:physics:collider",
  apiName: "physicsCollisionMask",
  requires: ["n:physics"],
  provides: ["n:physics:collider", "physics:collision-mask"],
  module: "./src/core-domains/physics/collider/kits/collision-mask-kit/index.js",
  exportName: "createCollisionMaskKit",
  publicSubpath: "./domains/physics/collider/mask",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
