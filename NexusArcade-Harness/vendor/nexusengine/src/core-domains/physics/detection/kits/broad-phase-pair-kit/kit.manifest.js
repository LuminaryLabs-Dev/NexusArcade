import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "broad-phase-pair-kit",
  responsibility: "Normalize, filter, deduplicate, and stably order broad-phase pairs.",
  domainPath: "n:physics:detection",
  apiName: "physicsBroadPhasePair",
  requires: ["n:physics", "n:physics:collider"],
  provides: ["physics:broad-phase-pair"],
  module: "./src/core-domains/physics/detection/kits/broad-phase-pair-kit/index.js",
  exportName: "createBroadPhasePairKit",
  publicSubpath: "./domains/physics/detection/broad-phase-pair",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
