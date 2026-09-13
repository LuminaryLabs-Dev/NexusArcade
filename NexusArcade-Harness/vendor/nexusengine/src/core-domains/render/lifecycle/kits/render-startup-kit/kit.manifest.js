import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-startup-kit",
  responsibility: "Own deterministic startup requests and provider-readiness receipts.",
  domainPath: "n:render:lifecycle",
  apiName: "renderStartup",
  requires: ["render:installation", "render:provider-contract"],
  provides: ["render:startup"],
  module: "./src/core-domains/render/lifecycle/kits/render-startup-kit/index.js",
  exportName: "createRenderStartupKit",
  publicSubpath: "./domains/render/lifecycle/startup",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
