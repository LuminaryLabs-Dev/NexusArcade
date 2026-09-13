import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "broad-phase-kit",
  responsibility: "Own canonical Detection discovery and deterministic broad-phase strategy selection.",
  domainPath: "n:physics:detection",
  apiName: "physicsBroadPhase",
  requires: [
    "n:physics",
    "n:physics:shape",
    "n:physics:collider",
    "physics:spatial-partition",
    "physics:broad-phase-pair",
    "physics:dynamic-tree",
    "physics:sweep-and-prune"
  ],
  provides: ["n:physics:detection", "physics:broad-phase"],
  module: "./src/core-domains/physics/detection/kits/broad-phase-kit/index.js",
  exportName: "createBroadPhaseKit",
  publicSubpath: "./domains/physics/detection/broad-phase",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
