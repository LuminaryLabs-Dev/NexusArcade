import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "viewport-kit",
  responsibility: "Own bounded portable viewport regions and depth ranges.",
  domainPath: "n:render:surface",
  apiName: "renderViewports",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:viewport"],
  module: "./src/core-domains/render/surface/kits/viewport-kit/index.js",
  exportName: "createViewportKit",
  publicSubpath: "./domains/render/surface/viewport",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
