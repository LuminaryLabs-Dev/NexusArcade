import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "sweep-and-prune-kit",
  responsibility: "Generate deterministic broad-phase pairs by sorted-axis interval sweeping.",
  domainPath: "n:physics:detection",
  apiName: "physicsSweepAndPrune",
  requires: ["n:physics", "physics:broad-phase-pair"],
  provides: ["physics:sweep-and-prune"],
  module: "./src/core-domains/physics/detection/kits/sweep-and-prune-kit/index.js",
  exportName: "createSweepAndPruneKit",
  publicSubpath: "./domains/physics/detection/sweep-and-prune",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
