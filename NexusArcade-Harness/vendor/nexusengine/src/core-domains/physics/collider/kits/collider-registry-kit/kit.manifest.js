import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collider-registry-kit",
  responsibility: "Own portable collider records, revisions, reference validation, and exact-once mutations.",
  domainPath: "n:physics:collider",
  apiName: "physicsColliderRegistry",
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:body-registry",
    "physics:shape-registry",
    "physics:material-registry",
    "physics:collider-identity",
    "physics:collider-attachment",
    "physics:collider-pose",
    "physics:collider-material",
    "physics:collider-filter",
    "physics:sensor-collider",
    "physics:trigger-collider",
    "physics:collider-lifecycle"
  ],
  provides: ["n:physics:collider", "physics:collider", "physics:collider-registry"],
  module: "./src/core-domains/physics/collider/kits/collider-registry-kit/index.js",
  exportName: "createColliderRegistryKit",
  publicSubpath: "./domains/physics/collider/registry",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
