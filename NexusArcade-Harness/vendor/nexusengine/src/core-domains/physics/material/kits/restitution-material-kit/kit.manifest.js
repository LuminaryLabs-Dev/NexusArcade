import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "restitution-material-kit",
  responsibility: "Normalize physical restitution coefficient and activation-threshold descriptors.",
  domainPath: "n:physics:material",
  apiName: "physicsRestitutionMaterial",
  requires: ["n:physics"],
  provides: ["n:physics:material", "physics:restitution-material"],
  module: "./src/core-domains/physics/material/kits/restitution-material-kit/index.js",
  exportName: "createRestitutionMaterialKit",
  publicSubpath: "./domains/physics/material/restitution",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
