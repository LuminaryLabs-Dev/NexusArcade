import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "cone-twist-constraint-kit",
  responsibility: "Normalize portable cone-twist constraint descriptors without provider or solver execution.",
  domainPath: "n:physics:constraints",
  apiName: "physicsConeTwistConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:cone-twist-constraint"],
  module: "./src/core-domains/physics/constraints/kits/cone-twist-constraint-kit/index.js",
  exportName: "createConeTwistConstraintKit",
  publicSubpath: "./domains/physics/constraints/cone-twist",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
