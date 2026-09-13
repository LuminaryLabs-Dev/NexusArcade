import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-workspace-domain",
  domainPath: "n:authoring:workspace",
  parentDomainPath: "n:authoring",
  label: "Authoring Workspace",
  responsibility: "Own workspace authoring contracts and operations.",
  owns: ["workspace authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:workspace"],
  proofReferences: ["tests/core-domains/core-authoring-geometry.mjs"],
  proofStatus: "proven",
});
