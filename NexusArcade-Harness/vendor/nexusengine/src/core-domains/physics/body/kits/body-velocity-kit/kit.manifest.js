import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-velocity-kit",
  responsibility: "Normalize finite linear and angular Physics body velocity descriptors.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyVelocity",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-velocity"],
  module: "./src/core-domains/physics/body/kits/body-velocity-kit/index.js",
  exportName: "createBodyVelocityKit",
  publicSubpath: "./domains/physics/body/velocity",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

