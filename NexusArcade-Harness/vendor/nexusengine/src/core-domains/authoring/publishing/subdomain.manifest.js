import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-publishing-domain",
  domainPath: "n:authoring:publishing",
  parentDomainPath: "n:authoring",
  label: "Authoring Publishing",
  responsibility: "Own publishing authoring contracts and operations.",
  owns: ["publishing authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project", "n:authoring:assembly"],
  provides: ["n:authoring:publishing"],
  proofReferences: ["tests/core-domains/core-authoring-integration.mjs"],
  proofStatus: "proven",
});
