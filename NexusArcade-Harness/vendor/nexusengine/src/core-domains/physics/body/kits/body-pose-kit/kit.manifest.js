import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-pose-kit",
  responsibility: "Normalize body position and canonical quaternion orientation.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyPose",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-pose"],
  module: "./src/core-domains/physics/body/kits/body-pose-kit/index.js",
  exportName: "createBodyPoseKit",
  publicSubpath: "./domains/physics/body/pose",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

