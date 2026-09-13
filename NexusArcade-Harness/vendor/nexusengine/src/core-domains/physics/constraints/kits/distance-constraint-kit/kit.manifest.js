import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "distance-constraint-kit",
  responsibility: "Normalize portable bounded-distance constraint descriptors without provider or solver execution.",
  domainPath: "n:physics:constraints",
  apiName: "physicsDistanceConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:distance-constraint"],
  module: "./src/core-domains/physics/constraints/kits/distance-constraint-kit/index.js",
  exportName: "createDistanceConstraintKit",
  publicSubpath: "./domains/physics/constraints/distance",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
