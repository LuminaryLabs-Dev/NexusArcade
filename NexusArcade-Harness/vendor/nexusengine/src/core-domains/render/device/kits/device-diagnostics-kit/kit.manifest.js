import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "device-diagnostics-kit",
  responsibility: "Project deterministic read-only diagnostics from public Render device capabilities.",
  domainPath: "n:render:device",
  apiName: "renderDeviceDiagnostics",
  requires: [
    "n:render:device",
    "render:device-capability",
    "render:device-memory",
    "render:device-queue",
    "render:device-lifecycle",
    "render:device-loss"
  ],
  provides: ["render:device-diagnostics"],
  module: "./src/core-domains/render/device/kits/device-diagnostics-kit/index.js",
  exportName: "createDeviceDiagnosticsKit",
  publicSubpath: "./domains/render/device/diagnostics",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
