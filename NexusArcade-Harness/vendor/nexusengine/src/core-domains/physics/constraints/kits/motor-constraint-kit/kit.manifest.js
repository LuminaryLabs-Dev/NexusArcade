import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "motor-constraint-kit",
  responsibility: "Normalize portable bounded motor constraint descriptors.",
  domainPath: "n:physics:constraints",
  apiName: "physicsMotorConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:motor-constraint"],
  module: "./src/core-domains/physics/constraints/kits/motor-constraint-kit/index.js",
  exportName: "createMotorConstraintKit",
  publicSubpath: "./domains/physics/constraints/motor",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
