import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "physics-installation-kit",
  responsibility: "Own the aggregate phase and provider identity for one installed Physics composition.",
  domainPath: "n:physics:lifecycle",
  apiName: "physicsInstallation",
  requires: ["n:physics", "physics:provider-contract"],
  provides: ["n:physics:lifecycle", "physics:installation"],
  module: "./src/core-domains/physics/lifecycle/kits/physics-installation-kit/index.js",
  exportName: "createPhysicsInstallationKit",
  publicSubpath: "./domains/physics/lifecycle/installation",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});
