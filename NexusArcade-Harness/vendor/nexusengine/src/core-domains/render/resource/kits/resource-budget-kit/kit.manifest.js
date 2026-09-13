import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "resource-budget-kit",
  responsibility: "Map exact Render resource identities to existing Device Memory reservations without duplicating capacity authority.",
  domainPath: "n:render:resource",
  apiName: "renderResourceBudgets",
  requires: ["n:render:resource", "render:resource-identity", "render:device-memory"],
  provides: ["render:resource-budget"],
  module: "./src/core-domains/render/resource/kits/resource-budget-kit/index.js",
  exportName: "createResourceBudgetKit",
  publicSubpath: "./domains/render/resource/budget",
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
