import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-identity-kit",
  responsibility: "Own deterministic Render execution-resource identities, revisions, and dependency lineage.",
  domainPath: "n:render:resource",
  apiName: "renderResourceIdentities",
  requires: ["n:render:resource", "render:resource-schema"],
  provides: ["render:resource-identity"],
  module: "./src/core-domains/render/resource/kits/resource-identity-kit/index.js",
  exportName: "createResourceIdentityKit",
  publicSubpath: "./domains/render/resource/identity",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
