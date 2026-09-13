import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-material-domain",
  domainPath: "n:authoring:material",
  parentDomainPath: "n:authoring",
  label: "Authoring Material",
  responsibility: "Own material authoring contracts and operations.",
  owns: ["material authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:material"],
  proofReferences: ["tests/core-domains/core-authoring-surfaces-rig.mjs"],
  proofStatus: "proven",
});
