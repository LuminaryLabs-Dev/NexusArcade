import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-modifier-domain",
  domainPath: "n:authoring:modifier",
  parentDomainPath: "n:authoring",
  label: "Authoring Modifier",
  responsibility: "Own modifier authoring contracts and operations.",
  owns: ["modifier authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:modifier"],
  proofReferences: ["tests/core-domains/core-authoring-integration.mjs"],
  proofStatus: "proven",
});
