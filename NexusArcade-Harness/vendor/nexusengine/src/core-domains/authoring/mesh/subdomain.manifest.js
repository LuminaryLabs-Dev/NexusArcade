import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-mesh-domain",
  domainPath: "n:authoring:mesh",
  parentDomainPath: "n:authoring",
  label: "Authoring Mesh",
  responsibility: "Own editable mesh contracts and operations.",
  owns: ["mesh source vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:mesh"],
  proofReferences: ["tests/core-domains/core-authoring-geometry.mjs"],
  proofStatus: "proven",
});
