import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "continuous-collision-kit",
  responsibility: "Compute exact linear sphere-sphere time of impact and reject unsupported sweep pairs.",
  domainPath: "n:physics:detection",
  apiName: "physicsContinuousCollision",
  requires: ["n:physics", "n:physics:shape", "physics:collision-detection-result"],
  provides: ["physics:continuous-collision"],
  module: "./src/core-domains/physics/detection/kits/continuous-collision-kit/index.js",
  exportName: "createContinuousCollisionKit",
  publicSubpath: "./domains/physics/detection/continuous-collision",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
