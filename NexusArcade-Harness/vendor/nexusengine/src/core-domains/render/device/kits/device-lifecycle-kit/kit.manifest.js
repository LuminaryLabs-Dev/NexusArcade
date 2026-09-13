import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-lifecycle-kit",
  responsibility: "Own portable acquisition, readiness, loss, failure, recovery, and release state for one selected Render device.",
  domainPath: "n:render:device",
  apiName: "renderDeviceLifecycle",
  requires: ["n:render:device", "render:device-contract", "render:device-capability", "render:installation"],
  provides: ["render:device-lifecycle"],
  module: "./src/core-domains/render/device/kits/device-lifecycle-kit/index.js",
  exportName: "createDeviceLifecycleKit",
  publicSubpath: "./domains/render/device/lifecycle",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
