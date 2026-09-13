import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "ball-socket-constraint-kit",
  responsibility: "Normalize portable ball-socket constraint descriptors without provider or solver execution.",
  domainPath: "n:physics:constraints",
  apiName: "physicsBallSocketConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:ball-socket-constraint"],
  module: "./src/core-domains/physics/constraints/kits/ball-socket-constraint-kit/index.js",
  exportName: "createBallSocketConstraintKit",
  publicSubpath: "./domains/physics/constraints/ball-socket",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
