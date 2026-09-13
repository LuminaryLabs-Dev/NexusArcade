import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "narrow-phase-kit",
  responsibility: "Dispatch supported analytic and convex algorithms into one portable collision result.",
  domainPath: "n:physics:detection",
  apiName: "physicsNarrowPhase",
  requires: [
    "n:physics",
    "n:physics:shape",
    "n:physics:collider",
    "physics:shape-intersection",
    "physics:gjk",
    "physics:epa",
    "physics:collision-detection-result"
  ],
  provides: ["physics:narrow-phase"],
  module: "./src/core-domains/physics/detection/kits/narrow-phase-kit/index.js",
  exportName: "createNarrowPhaseKit",
  publicSubpath: "./domains/physics/detection/narrow-phase",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
