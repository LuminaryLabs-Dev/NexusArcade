import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "friction-material-kit",
  responsibility: "Normalize portable isotropic and anisotropic physical friction descriptors.",
  domainPath: "n:physics:material",
  apiName: "physicsFrictionMaterial",
  requires: ["n:physics"],
  provides: ["n:physics:material", "physics:friction-material"],
  module: "./src/core-domains/physics/material/kits/friction-material-kit/index.js",
  exportName: "createFrictionMaterialKit",
  publicSubpath: "./domains/physics/material/friction",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
