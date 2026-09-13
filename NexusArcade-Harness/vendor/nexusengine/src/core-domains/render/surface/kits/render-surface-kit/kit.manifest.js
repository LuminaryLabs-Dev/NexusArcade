import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-surface-kit",
  responsibility: "Own portable base Render surface descriptors and exact-once lifecycle records.",
  domainPath: "n:render:surface",
  apiName: "renderSurfaces",
  requires: ["n:render", "render:provider-contract", "render:device-contract"],
  provides: ["n:render:surface", "render:surface"],
  module: "./src/core-domains/render/surface/kits/render-surface-kit/index.js",
  exportName: "createRenderSurfaceKit",
  publicSubpath: "./domains/render/surface/render-surface",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
