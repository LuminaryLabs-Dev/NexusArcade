import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "time-scale-kit",
  responsibility: "Own portable deterministic Physics-only time-scale records and delta resolution.",
  domainPath: "n:physics:world",
  apiName: "physicsTimeScale",
  requires: ["n:physics", "physics:state-schema", "physics:command-schema", "physics:event-schema"],
  provides: ["n:physics:world", "physics:time-scale"],
  module: "./src/core-domains/physics/world/kits/time-scale-kit/index.js",
  exportName: "createTimeScaleKit",
  publicSubpath: "./domains/physics/world/time-scale",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
