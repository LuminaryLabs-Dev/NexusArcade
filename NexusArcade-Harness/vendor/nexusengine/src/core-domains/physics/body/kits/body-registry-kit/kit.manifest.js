import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-registry-kit",
  responsibility: "Own portable Physics body records and exact-once lifecycle transitions without solver execution.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyRegistry",
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:body-state",
    "physics:body-sleep",
    "physics:body-wake",
    "physics:body-lifecycle"
  ],
  provides: ["n:physics:body", "physics:body", "physics:body-registry"],
  module: "./src/core-domains/physics/body/kits/body-registry-kit/index.js",
  exportName: "createBodyRegistryKit",
  publicSubpath: "./domains/physics/body/registry",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

