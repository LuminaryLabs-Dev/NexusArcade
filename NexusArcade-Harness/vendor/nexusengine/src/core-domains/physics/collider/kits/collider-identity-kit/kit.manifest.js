import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collider-identity-kit",
  responsibility: "Normalize stable portable Physics collider identity, tags, and metadata.",
  domainPath: "n:physics:collider",
  apiName: "physicsColliderIdentity",
  requires: ["n:physics"],
  provides: ["n:physics:collider", "physics:collider-identity"],
  module: "./src/core-domains/physics/collider/kits/collider-identity-kit/index.js",
  exportName: "createColliderIdentityKit",
  publicSubpath: "./domains/physics/collider/identity",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
