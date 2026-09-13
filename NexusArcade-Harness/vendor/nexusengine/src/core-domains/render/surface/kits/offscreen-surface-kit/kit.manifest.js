import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "offscreen-surface-kit",
  responsibility: "Own portable offscreen layer, sample, and usage policy while base Surface owns dimensions.",
  domainPath: "n:render:surface",
  apiName: "renderOffscreenSurfaces",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:offscreen-surface"],
  module: "./src/core-domains/render/surface/kits/offscreen-surface-kit/index.js",
  exportName: "createOffscreenSurfaceKit",
  publicSubpath: "./domains/render/surface/offscreen",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
