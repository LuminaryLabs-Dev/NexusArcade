import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-device-contract-kit",
  responsibility: "Define the portable identity and ownership boundary for one Render device.",
  domainPath: "n:render:device",
  apiName: "renderDeviceContract",
  requires: ["n:render", "render:provider-contract"],
  provides: ["n:render:device", "render:device-contract"],
  module: "./src/core-domains/render/device/kits/render-device-contract-kit/index.js",
  exportName: "createRenderDeviceContractKit",
  publicSubpath: "./domains/render/device/contract",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
