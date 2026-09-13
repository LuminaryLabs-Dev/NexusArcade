import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "surface-material-kit",
  responsibility: "Normalize renderer-neutral physical surface classification and tags.",
  domainPath: "n:physics:material",
  apiName: "physicsSurfaceMaterial",
  requires: ["n:physics"],
  provides: ["n:physics:material", "physics:surface-material"],
  module: "./src/core-domains/physics/material/kits/surface-material-kit/index.js",
  exportName: "createSurfaceMaterialKit",
  publicSubpath: "./domains/physics/material/surface",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
