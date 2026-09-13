import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "spatial-partition-kit",
  responsibility: "Own exact-once portable broad-phase proxy records and deterministic bounds queries.",
  domainPath: "n:physics:detection",
  apiName: "physicsSpatialPartition",
  requires: ["n:physics", "n:physics:shape", "n:physics:collider"],
  provides: ["physics:spatial-partition"],
  module: "./src/core-domains/physics/detection/kits/spatial-partition-kit/index.js",
  exportName: "createSpatialPartitionKit",
  publicSubpath: "./domains/physics/detection/spatial-partition",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
