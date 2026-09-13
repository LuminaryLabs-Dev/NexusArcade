import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "gjk-detection-kit",
  responsibility: "Determine convex support-shape separation or intersection with deterministic GJK simplex evolution.",
  domainPath: "n:physics:detection",
  apiName: "physicsGjkDetection",
  requires: ["n:physics", "n:physics:shape"],
  provides: ["physics:gjk"],
  module: "./src/core-domains/physics/detection/kits/gjk-detection-kit/index.js",
  exportName: "createGjkDetectionKit",
  publicSubpath: "./domains/physics/detection/gjk",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
