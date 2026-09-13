import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "fullscreen-kit",
  responsibility: "Own portable fullscreen enter and exit intents without platform execution.",
  domainPath: "n:render:surface",
  apiName: "renderFullscreenIntents",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:fullscreen"],
  module: "./src/core-domains/render/surface/kits/fullscreen-kit/index.js",
  exportName: "createFullscreenKit",
  publicSubpath: "./domains/render/surface/fullscreen",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
