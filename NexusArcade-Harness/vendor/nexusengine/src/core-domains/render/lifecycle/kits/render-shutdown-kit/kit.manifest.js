import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-shutdown-kit",
  responsibility: "Own deterministic provider shutdown requests and completion receipts.",
  domainPath: "n:render:lifecycle",
  apiName: "renderShutdown",
  requires: ["render:installation", "render:startup"],
  provides: ["render:shutdown"],
  module: "./src/core-domains/render/lifecycle/kits/render-shutdown-kit/index.js",
  exportName: "createRenderShutdownKit",
  publicSubpath: "./domains/render/lifecycle/shutdown",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
