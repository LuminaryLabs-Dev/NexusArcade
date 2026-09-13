import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collider-filter-kit",
  responsibility: "Normalize provider-neutral collider layer, mask, group, and exclusion descriptors.",
  domainPath: "n:physics:collider",
  apiName: "physicsColliderFilter",
  requires: ["n:physics", "physics:collision-layer", "physics:collision-mask", "physics:collision-group"],
  provides: ["n:physics:collider", "physics:collider-filter"],
  module: "./src/core-domains/physics/collider/kits/collider-filter-kit/index.js",
  exportName: "createColliderFilterKit",
  publicSubpath: "./domains/physics/collider/filter",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
