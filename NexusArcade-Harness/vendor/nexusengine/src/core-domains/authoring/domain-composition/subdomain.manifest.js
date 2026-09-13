import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-domain-composition-domain",
  domainPath: "n:authoring:domain-composition",
  parentDomainPath: "n:authoring",
  label: "Authoring DomainComposition",
  responsibility: "Own domain-composition authoring contracts and operations.",
  owns: ["domain-composition authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:domain-composition"],
  proofReferences: ["tests/core-domains/core-authoring-integration.mjs"],
  proofStatus: "proven",
});
