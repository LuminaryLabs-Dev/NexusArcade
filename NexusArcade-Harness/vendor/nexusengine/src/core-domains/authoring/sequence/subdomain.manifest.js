import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-sequence-domain",
  domainPath: "n:authoring:sequence",
  parentDomainPath: "n:authoring",
  label: "Authoring Sequence",
  responsibility: "Own sequence authoring contracts and operations.",
  owns: ["sequence authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:sequence"],
  proofReferences: ["tests/core-domains/core-authoring-integration.mjs"],
  proofStatus: "proven",
});
