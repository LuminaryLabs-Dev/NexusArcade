import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "simulation-region-kit",
  responsibility: "Own portable physical simulation activation regions and deterministic point resolution.",
  domainPath: "n:physics:world",
  apiName: "physicsSimulationRegion",
  requires: ["n:physics", "physics:state-schema", "physics:command-schema", "physics:event-schema"],
  provides: ["n:physics:world", "physics:simulation-region"],
  module: "./src/core-domains/physics/world/kits/simulation-region-kit/index.js",
  exportName: "createSimulationRegionKit",
  publicSubpath: "./domains/physics/world/simulation-region",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
