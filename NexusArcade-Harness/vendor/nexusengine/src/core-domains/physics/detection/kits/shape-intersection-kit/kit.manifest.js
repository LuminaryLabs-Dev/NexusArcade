import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "shape-intersection-kit",
  responsibility: "Resolve exact analytic primitive and convex-plane shape intersections.",
  domainPath: "n:physics:detection",
  apiName: "physicsShapeIntersection",
  requires: ["n:physics", "n:physics:shape", "physics:collision-detection-result"],
  provides: ["physics:shape-intersection"],
  module: "./src/core-domains/physics/detection/kits/shape-intersection-kit/index.js",
  exportName: "createShapeIntersectionKit",
  publicSubpath: "./domains/physics/detection/shape-intersection",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
