import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "surface-format-kit",
  responsibility: "Own portable color, depth, alpha, sample, and HDR surface format selections.",
  domainPath: "n:render:surface",
  apiName: "renderSurfaceFormats",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:surface-format"],
  module: "./src/core-domains/render/surface/kits/surface-format-kit/index.js",
  exportName: "createSurfaceFormatKit",
  publicSubpath: "./domains/render/surface/format",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
