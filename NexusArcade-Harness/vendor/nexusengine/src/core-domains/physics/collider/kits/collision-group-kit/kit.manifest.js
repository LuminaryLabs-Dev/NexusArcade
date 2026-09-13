import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collision-group-kit",
  responsibility: "Normalize a named collision layer-and-mask policy descriptor.",
  domainPath: "n:physics:collider",
  apiName: "physicsCollisionGroup",
  requires: ["n:physics", "physics:collision-layer", "physics:collision-mask"],
  provides: ["n:physics:collider", "physics:collision-group"],
  module: "./src/core-domains/physics/collider/kits/collision-group-kit/index.js",
  exportName: "createCollisionGroupKit",
  publicSubpath: "./domains/physics/collider/group",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
