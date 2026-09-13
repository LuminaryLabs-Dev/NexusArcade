import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-limit-kit",
  responsibility: "Own portable Render device limit profiles and deterministic requirement checks.",
  domainPath: "n:render:device",
  apiName: "renderDeviceLimits",
  requires: ["n:render:device", "render:device-contract"],
  provides: ["render:device-limit"],
  module: "./src/core-domains/render/device/kits/device-limit-kit/index.js",
  exportName: "createDeviceLimitKit",
  publicSubpath: "./domains/render/device/limit",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
