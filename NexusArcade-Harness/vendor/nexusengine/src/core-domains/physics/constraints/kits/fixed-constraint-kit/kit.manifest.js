import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "fixed-constraint-kit",
  responsibility: "Normalize portable fixed constraint descriptors without provider or solver execution.",
  domainPath: "n:physics:constraints",
  apiName: "physicsFixedConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:fixed-constraint"],
  module: "./src/core-domains/physics/constraints/kits/fixed-constraint-kit/index.js",
  exportName: "createFixedConstraintKit",
  publicSubpath: "./domains/physics/constraints/fixed",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
