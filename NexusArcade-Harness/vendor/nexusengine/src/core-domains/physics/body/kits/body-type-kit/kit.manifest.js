import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-type-kit",
  responsibility: "Normalize static, dynamic, and kinematic Physics body modes.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyType",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-type"],
  module: "./src/core-domains/physics/body/kits/body-type-kit/index.js",
  exportName: "createBodyTypeKit",
  publicSubpath: "./domains/physics/body/type",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

