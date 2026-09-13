import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "window-surface-kit",
  responsibility: "Own portable window-surface descriptors without host window handles or platform transitions.",
  domainPath: "n:render:surface",
  apiName: "renderWindowSurfaces",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:window-surface"],
  module: "./src/core-domains/render/surface/kits/window-surface-kit/index.js",
  exportName: "createWindowSurfaceKit",
  publicSubpath: "./domains/render/surface/window",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
