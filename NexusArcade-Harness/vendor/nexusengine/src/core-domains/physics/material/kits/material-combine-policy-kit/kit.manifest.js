import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "material-combine-policy-kit",
  responsibility: "Resolve physical material pairs with deterministic symmetric coefficient-combine policy.",
  domainPath: "n:physics:material",
  apiName: "physicsMaterialCombinePolicy",
  requires: ["n:physics", "physics:friction-material", "physics:restitution-material"],
  provides: ["n:physics:material", "physics:material-combine-policy"],
  module: "./src/core-domains/physics/material/kits/material-combine-policy-kit/index.js",
  exportName: "createMaterialCombinePolicyKit",
  publicSubpath: "./domains/physics/material/combine-policy",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
