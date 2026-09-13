import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "constraint-break-kit",
  responsibility: "Normalize and purely evaluate portable constraint break thresholds.",
  domainPath: "n:physics:constraints",
  apiName: "physicsConstraintBreak",
  requires: ["n:physics"],
  provides: ["n:physics:constraints", "physics:constraint-break"],
  module: "./src/core-domains/physics/constraints/kits/constraint-break-kit/index.js",
  exportName: "createConstraintBreakKit",
  publicSubpath: "./domains/physics/constraints/break",
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
