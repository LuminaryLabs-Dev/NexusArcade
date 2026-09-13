import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "limit-constraint-kit",
  responsibility: "Normalize portable linear and angular limit constraint descriptors.",
  domainPath: "n:physics:constraints",
  apiName: "physicsLimitConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:limit-constraint"],
  module: "./src/core-domains/physics/constraints/kits/limit-constraint-kit/index.js",
  exportName: "createLimitConstraintKit",
  publicSubpath: "./domains/physics/constraints/limit",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
