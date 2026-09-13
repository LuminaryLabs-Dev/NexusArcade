import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-force-kit",
  responsibility: "Normalize portable force, torque, and impulse accumulator descriptors.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyForce",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-force"],
  module: "./src/core-domains/physics/body/kits/body-force-kit/index.js",
  exportName: "createBodyForceKit",
  publicSubpath: "./domains/physics/body/force",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

