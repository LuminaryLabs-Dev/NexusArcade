import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-state-kit",
  responsibility: "Define portable Render resource phases and legal lifecycle transitions.",
  domainPath: "n:render:resource",
  apiName: "renderResourceState",
  requires: ["n:render:resource"],
  provides: ["render:resource-state"],
  module: "./src/core-domains/render/resource/kits/resource-state-kit/index.js",
  exportName: "createResourceStateKit",
  publicSubpath: "./domains/render/resource/state",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
