import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collider-lifecycle-kit",
  responsibility: "Normalize provider-neutral enabled and disabled collider lifecycle state and commands.",
  domainPath: "n:physics:collider",
  apiName: "physicsColliderLifecycle",
  requires: ["n:physics"],
  provides: ["n:physics:collider", "physics:collider-lifecycle"],
  module: "./src/core-domains/physics/collider/kits/collider-lifecycle-kit/index.js",
  exportName: "createColliderLifecycleKit",
  publicSubpath: "./domains/physics/collider/lifecycle",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
