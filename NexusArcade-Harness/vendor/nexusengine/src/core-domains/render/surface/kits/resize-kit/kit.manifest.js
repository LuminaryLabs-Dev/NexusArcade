import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resize-kit",
  responsibility: "Own portable resize intents without mutating host or provider surfaces.",
  domainPath: "n:render:surface",
  apiName: "renderResizeIntents",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:resize"],
  module: "./src/core-domains/render/surface/kits/resize-kit/index.js",
  exportName: "createResizeKit",
  publicSubpath: "./domains/render/surface/resize",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
