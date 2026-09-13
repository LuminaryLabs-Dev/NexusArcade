import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-wake-kit",
  responsibility: "Normalize explicit exact-once Physics body wake commands.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyWake",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-wake"],
  module: "./src/core-domains/physics/body/kits/body-wake-kit/index.js",
  exportName: "createBodyWakeKit",
  publicSubpath: "./domains/physics/body/wake",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

