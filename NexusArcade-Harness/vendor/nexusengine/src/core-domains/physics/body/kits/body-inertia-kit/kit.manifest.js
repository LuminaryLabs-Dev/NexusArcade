import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-inertia-kit",
  responsibility: "Normalize principal inertia, inverse inertia, and local inertia orientation.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyInertia",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-inertia"],
  module: "./src/core-domains/physics/body/kits/body-inertia-kit/index.js",
  exportName: "createBodyInertiaKit",
  publicSubpath: "./domains/physics/body/inertia",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

