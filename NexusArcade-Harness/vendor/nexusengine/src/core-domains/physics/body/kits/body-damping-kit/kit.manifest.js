import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-damping-kit",
  responsibility: "Normalize finite nonnegative linear and angular damping descriptors.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyDamping",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-damping"],
  module: "./src/core-domains/physics/body/kits/body-damping-kit/index.js",
  exportName: "createBodyDampingKit",
  publicSubpath: "./domains/physics/body/damping",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

