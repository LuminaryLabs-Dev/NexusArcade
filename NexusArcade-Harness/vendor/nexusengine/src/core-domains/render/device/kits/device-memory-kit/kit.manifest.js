import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-memory-kit",
  responsibility: "Own portable memory budgets, semantic reservations, and exact-once accounting receipts.",
  domainPath: "n:render:device",
  apiName: "renderDeviceMemory",
  requires: ["n:render:device", "render:device-contract", "render:device-limit", "render:device-capability"],
  provides: ["render:device-memory"],
  module: "./src/core-domains/render/device/kits/device-memory-kit/index.js",
  exportName: "createDeviceMemoryKit",
  publicSubpath: "./domains/render/device/memory",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
