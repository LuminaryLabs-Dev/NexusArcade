import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "body-identity-kit",
  responsibility: "Normalize stable portable Physics body identity, tags, and metadata.",
  domainPath: "n:physics:body",
  apiName: "physicsBodyIdentity",
  requires: ["n:physics"],
  provides: ["n:physics:body", "physics:body-identity"],
  module: "./src/core-domains/physics/body/kits/body-identity-kit/index.js",
  exportName: "createBodyIdentityKit",
  publicSubpath: "./domains/physics/body/identity",
  proofReferences: ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"]
});

