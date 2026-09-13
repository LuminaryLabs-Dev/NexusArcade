import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "epa-penetration-kit",
  responsibility: "Expand an intersecting GJK simplex into deterministic convex penetration witnesses.",
  domainPath: "n:physics:detection",
  apiName: "physicsEpaPenetration",
  requires: ["n:physics", "n:physics:shape", "physics:gjk"],
  provides: ["physics:epa"],
  module: "./src/core-domains/physics/detection/kits/epa-penetration-kit/index.js",
  exportName: "createEpaPenetrationKit",
  publicSubpath: "./domains/physics/detection/epa",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
