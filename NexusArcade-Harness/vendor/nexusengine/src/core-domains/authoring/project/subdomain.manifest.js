import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-project-domain",
  domainPath: "n:authoring:project",
  parentDomainPath: "n:authoring",
  label: "Authoring Project",
  responsibility: "Own editable project contracts and operations.",
  owns: ["project source vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring"],
  provides: ["n:authoring:project"],
  proofReferences: ["tests/core-domains/core-authoring-foundation.mjs"],
  proofStatus: "proven",
});
