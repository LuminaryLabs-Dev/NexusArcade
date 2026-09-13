import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-capability-kit",
  responsibility: "Compose a portable Render device identity, feature set, and limit profile into one capability record.",
  domainPath: "n:render:device",
  apiName: "renderDeviceCapabilities",
  requires: ["n:render:device", "render:device-contract", "render:device-feature", "render:device-limit"],
  provides: ["render:device-capability"],
  module: "./src/core-domains/render/device/kits/device-capability-kit/index.js",
  exportName: "createDeviceCapabilityKit",
  publicSubpath: "./domains/render/device/capability",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
