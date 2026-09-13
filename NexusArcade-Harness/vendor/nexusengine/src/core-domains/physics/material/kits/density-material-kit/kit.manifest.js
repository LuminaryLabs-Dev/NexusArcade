import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "density-material-kit",
  responsibility: "Normalize positive SI physical mass-density descriptors.",
  domainPath: "n:physics:material",
  apiName: "physicsDensityMaterial",
  requires: ["n:physics"],
  provides: ["n:physics:material", "physics:density-material"],
  module: "./src/core-domains/physics/material/kits/density-material-kit/index.js",
  exportName: "createDensityMaterialKit",
  publicSubpath: "./domains/physics/material/density",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
