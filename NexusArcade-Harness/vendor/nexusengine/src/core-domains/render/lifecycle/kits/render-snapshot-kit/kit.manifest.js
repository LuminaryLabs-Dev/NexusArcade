import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-snapshot-kit",
  responsibility: "Capture and atomically restore portable snapshots of composed Render lifecycle state.",
  domainPath: "n:render:lifecycle",
  apiName: "renderSnapshot",
  requires: ["render:installation", "render:startup", "render:shutdown", "render:recovery", "render:reset"],
  provides: ["render:snapshot"],
  module: "./src/core-domains/render/lifecycle/kits/render-snapshot-kit/index.js",
  exportName: "createRenderSnapshotKit",
  publicSubpath: "./domains/render/lifecycle/snapshot",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
