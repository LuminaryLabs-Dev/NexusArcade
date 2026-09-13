import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collider-pose-kit",
  responsibility: "Normalize provider-neutral collider-local position and orientation descriptors.",
  domainPath: "n:physics:collider",
  apiName: "physicsColliderPose",
  requires: ["n:physics"],
  provides: ["n:physics:collider", "physics:collider-pose"],
  module: "./src/core-domains/physics/collider/kits/collider-pose-kit/index.js",
  exportName: "createColliderPoseKit",
  publicSubpath: "./domains/physics/collider/pose",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
