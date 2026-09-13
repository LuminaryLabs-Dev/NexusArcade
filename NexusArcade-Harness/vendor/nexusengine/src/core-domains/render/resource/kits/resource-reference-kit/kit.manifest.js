import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-reference-kit",
  responsibility: "Own exact, portable references to Render execution-resource identities.",
  domainPath: "n:render:resource",
  apiName: "renderResourceReferences",
  requires: ["n:render:resource", "render:resource-identity"],
  provides: ["render:resource-reference"],
  module: "./src/core-domains/render/resource/kits/resource-reference-kit/index.js",
  exportName: "createResourceReferenceKit",
  publicSubpath: "./domains/render/resource/reference",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
