import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "spring-constraint-kit",
  responsibility: "Normalize portable linear and angular spring constraint descriptors.",
  domainPath: "n:physics:constraints",
  apiName: "physicsSpringConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:spring-constraint"],
  module: "./src/core-domains/physics/constraints/kits/spring-constraint-kit/index.js",
  exportName: "createSpringConstraintKit",
  publicSubpath: "./domains/physics/constraints/spring",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
