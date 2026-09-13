import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-world-settings-kit",
  responsibility: "Normalize portable Physics coordinate, unit, bounds, and out-of-bounds settings.",
  domainPath: "n:physics:world",
  apiName: "physicsWorldSettings",
  requires: ["n:physics"],
  provides: ["n:physics:world", "physics:world-settings"],
  module: "./src/core-domains/physics/world/kits/physics-world-settings-kit/index.js",
  exportName: "createPhysicsWorldSettingsKit",
  publicSubpath: "./domains/physics/world/settings",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
