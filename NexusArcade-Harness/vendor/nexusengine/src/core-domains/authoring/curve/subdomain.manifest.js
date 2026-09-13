import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-curve-domain",
  domainPath: "n:authoring:curve",
  parentDomainPath: "n:authoring",
  label: "Authoring Curve",
  responsibility: "Own curve authoring contracts and operations.",
  owns: ["curve authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:curve"],
  proofReferences: ["tests/core-domains/core-authoring-geometry.mjs"],
  proofStatus: "proven",
});
