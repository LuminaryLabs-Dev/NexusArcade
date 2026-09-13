import { defineBuildSubdomainManifest } from "../manifest-input.js";

export const subdomainManifest = defineBuildSubdomainManifest({
  id: "orchestration-build-domain",
  domainPath: "n:build:orchestration",
  parentDomainPath: "n:build",
  label: "Orchestration",
  responsibility: "Own normalized requests, target sets, deterministic plans, approvals, execution, and receipts.",
  owns: ["Own normalized requests, target sets, deterministic plans, approvals, execution, and receipts."],
  forbiddenResponsibilities: ["application runtime ownership", "project source mutation", "authored product behavior"],
  requires: ["n:build"],
  provides: ["n:build:orchestration"],
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default subdomainManifest;
