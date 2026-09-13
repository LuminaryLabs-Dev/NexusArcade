import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-mass-kit",
  responsibility: "Normalize body mass, inverse mass, and center-of-mass descriptors.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyMass",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-mass"],
  module: "./src/core-domains/physics/body/kits/body-mass-kit/index.js",
  exportName: "createBodyMassKit",
  publicSubpath: "./domains/physics/body/mass",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

