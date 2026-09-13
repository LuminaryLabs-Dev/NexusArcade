import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-uv-domain",
  domainPath: "n:authoring:uv",
  parentDomainPath: "n:authoring",
  label: "Authoring Uv",
  responsibility: "Own uv authoring contracts and operations.",
  owns: ["uv authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:uv"],
  proofReferences: ["tests/core-domains/core-authoring-geometry.mjs"],
  proofStatus: "proven",
});
