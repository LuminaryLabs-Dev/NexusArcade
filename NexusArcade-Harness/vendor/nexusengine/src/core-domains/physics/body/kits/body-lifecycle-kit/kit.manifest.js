import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-lifecycle-kit",
  responsibility: "Normalize active and disabled body lifecycle state and exact transition commands.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyLifecycle",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-lifecycle"],
  module: "./src/core-domains/physics/body/kits/body-lifecycle-kit/index.js",
  exportName: "createBodyLifecycleKit",
  publicSubpath: "./domains/physics/body/lifecycle",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

