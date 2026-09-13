import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-reset-kit",
  responsibility: "Reset composed Render lifecycle state atomically through public capability APIs.",
  domainPath: "n:render:lifecycle",
  apiName: "renderReset",
  requires: ["render:installation", "render:startup", "render:shutdown", "render:recovery"],
  provides: ["render:reset"],
  module: "./src/core-domains/render/lifecycle/kits/render-reset-kit/index.js",
  exportName: "createRenderResetKit",
  publicSubpath: "./domains/render/lifecycle/reset",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
