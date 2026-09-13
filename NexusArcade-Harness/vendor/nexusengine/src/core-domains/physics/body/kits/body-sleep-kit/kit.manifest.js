import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-sleep-kit",
  responsibility: "Normalize body sleep state and explicit exact-once sleep commands.",
  domainPath: "n:physics:body",
  apiName: "physicsBodySleep",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-sleep"],
  module: "./src/core-domains/physics/body/kits/body-sleep-kit/index.js",
  exportName: "createBodySleepKit",
  publicSubpath: "./domains/physics/body/sleep",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

