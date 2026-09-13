import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-upload-kit",
  responsibility: "Record exact Render resource upload requests, provider receipts, and failures against completed Device Queue submissions.",
  domainPath: "n:render:resource",
  apiName: "renderResourceUploads",
  requires: ["n:render:resource", "render:resource-identity", "render:resource-integrity", "render:device-queue", "render:device-lifecycle"],
  provides: ["render:resource-upload"],
  module: "./src/core-domains/render/resource/kits/resource-upload-kit/index.js",
  exportName: "createResourceUploadKit",
  publicSubpath: "./domains/render/resource/upload",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
