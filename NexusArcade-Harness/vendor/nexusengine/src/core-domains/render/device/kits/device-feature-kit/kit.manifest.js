import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-feature-kit",
  responsibility: "Own canonical Render device feature declarations and deterministic requirement negotiation.",
  domainPath: "n:render:device",
  apiName: "renderDeviceFeatures",
  requires: ["n:render:device", "render:device-contract"],
  provides: ["render:device-feature"],
  module: "./src/core-domains/render/device/kits/device-feature-kit/index.js",
  exportName: "createDeviceFeatureKit",
  publicSubpath: "./domains/render/device/feature",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
