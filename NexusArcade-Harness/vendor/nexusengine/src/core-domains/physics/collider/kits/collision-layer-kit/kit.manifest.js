import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collision-layer-kit",
  responsibility: "Normalize one bounded provider-neutral collision layer.",
  domainPath: "n:physics:collider",
  apiName: "physicsCollisionLayer",
  requires: ["n:physics"],
  provides: ["n:physics:collider", "physics:collision-layer"],
  module: "./src/core-domains/physics/collider/kits/collision-layer-kit/index.js",
  exportName: "createCollisionLayerKit",
  publicSubpath: "./domains/physics/collider/layer",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
