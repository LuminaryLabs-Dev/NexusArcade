import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "render-recovery-kit",
  responsibility: "Coordinate deterministic recovery from a failed Render provider lifecycle without owning provider repair execution.",
  domainPath: "n:render:lifecycle",
  apiName: "renderRecovery",
  requires: ["render:installation", "render:startup", "render:provider-contract"],
  provides: ["render:recovery"],
  module: "./src/core-domains/render/lifecycle/kits/render-recovery-kit/index.js",
  exportName: "createRenderRecoveryKit",
  publicSubpath: "./domains/render/lifecycle/recovery",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
