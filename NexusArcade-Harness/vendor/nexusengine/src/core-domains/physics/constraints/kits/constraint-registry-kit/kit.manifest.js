import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "constraint-registry-kit",
  responsibility: "Own deterministic portable constraint records, terminal break state, and exact-once mutations.",
  domainPath: "n:physics:constraints",
  apiName: "physicsConstraintRegistry",
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:body-registry",
    "physics:ball-socket-constraint",
    "physics:cone-twist-constraint",
    "physics:distance-constraint",
    "physics:drive-constraint",
    "physics:fixed-constraint",
    "physics:hinge-constraint",
    "physics:limit-constraint",
    "physics:motor-constraint",
    "physics:slider-constraint",
    "physics:spring-constraint",
    "physics:constraint-break"
  ],
  provides: ["n:physics:constraints", "physics:constraint", "physics:constraint-registry"],
  module: "./src/core-domains/physics/constraints/kits/constraint-registry-kit/index.js",
  exportName: "createConstraintRegistryKit",
  publicSubpath: "./domains/physics/constraints/registry",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
