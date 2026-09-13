import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "scissor-kit",
  responsibility: "Own bounded portable scissor regions without issuing provider commands.",
  domainPath: "n:render:surface",
  apiName: "renderScissors",
  requires: ["n:render:surface", "render:surface", "render:device-contract"],
  provides: ["render:scissor"],
  module: "./src/core-domains/render/surface/kits/scissor-kit/index.js",
  exportName: "createScissorKit",
  publicSubpath: "./domains/render/surface/scissor",
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
