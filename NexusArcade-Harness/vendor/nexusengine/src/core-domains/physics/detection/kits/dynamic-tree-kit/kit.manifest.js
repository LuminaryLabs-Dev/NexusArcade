import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "dynamic-tree-kit",
  responsibility: "Build and query deterministic immutable AABB trees from portable proxies.",
  domainPath: "n:physics:detection",
  apiName: "physicsDynamicTree",
  requires: ["n:physics", "physics:broad-phase-pair"],
  provides: ["physics:dynamic-tree"],
  module: "./src/core-domains/physics/detection/kits/dynamic-tree-kit/index.js",
  exportName: "createDynamicTreeKit",
  publicSubpath: "./domains/physics/detection/dynamic-tree",
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
