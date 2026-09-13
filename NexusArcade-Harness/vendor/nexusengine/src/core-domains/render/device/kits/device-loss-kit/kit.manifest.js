import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-loss-kit",
  responsibility: "Own exact-once Render device loss incidents and externally proven resolution records.",
  domainPath: "n:render:device",
  apiName: "renderDeviceLoss",
  requires: ["n:render:device", "render:device-contract", "render:device-lifecycle"],
  provides: ["render:device-loss"],
  module: "./src/core-domains/render/device/kits/device-loss-kit/index.js",
  exportName: "createDeviceLossKit",
  publicSubpath: "./domains/render/device/loss",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
