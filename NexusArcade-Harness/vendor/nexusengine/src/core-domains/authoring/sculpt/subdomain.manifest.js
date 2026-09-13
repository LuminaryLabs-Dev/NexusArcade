import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-sculpt-domain",
  domainPath: "n:authoring:sculpt",
  parentDomainPath: "n:authoring",
  label: "Authoring Sculpt",
  responsibility: "Own sculpt authoring contracts and operations.",
  owns: ["sculpt authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project", "n:authoring:mesh", "n:authoring:brush"],
  provides: ["n:authoring:sculpt"],
  proofReferences: ["tests/core-domains/core-authoring-geometry.mjs"],
  proofStatus: "proven",
});
