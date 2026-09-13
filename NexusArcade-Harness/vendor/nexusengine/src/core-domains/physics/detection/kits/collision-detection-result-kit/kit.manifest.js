import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collision-detection-result-kit",
  responsibility: "Normalize finite portable collision results and stable result ordering.",
  domainPath: "n:physics:detection",
  apiName: "physicsCollisionDetectionResult",
  requires: ["n:physics"],
  provides: ["physics:collision-detection-result"],
  module: "./src/core-domains/physics/detection/kits/collision-detection-result-kit/index.js",
  exportName: "createCollisionDetectionResultKit",
  publicSubpath: "./domains/physics/detection/result",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
