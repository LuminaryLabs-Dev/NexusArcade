import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-queue-kit",
  responsibility: "Own logical Render queue descriptors and exact-once submission and completion receipts.",
  domainPath: "n:render:device",
  apiName: "renderDeviceQueues",
  requires: ["n:render:device", "render:device-contract", "render:device-feature", "render:device-capability"],
  provides: ["render:device-queue"],
  module: "./src/core-domains/render/device/kits/device-queue-kit/index.js",
  exportName: "createDeviceQueueKit",
  publicSubpath: "./domains/render/device/queue",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
