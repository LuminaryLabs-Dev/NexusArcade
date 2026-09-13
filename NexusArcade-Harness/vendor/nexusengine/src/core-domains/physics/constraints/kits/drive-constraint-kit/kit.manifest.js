import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "drive-constraint-kit",
  responsibility: "Normalize portable positional and velocity drive constraint descriptors.",
  domainPath: "n:physics:constraints",
  apiName: "physicsDriveConstraint",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:drive-constraint"],
  module: "./src/core-domains/physics/constraints/kits/drive-constraint-kit/index.js",
  exportName: "createDriveConstraintKit",
  publicSubpath: "./domains/physics/constraints/drive",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
