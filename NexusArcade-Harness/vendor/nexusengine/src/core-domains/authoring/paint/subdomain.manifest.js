import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-paint-domain",
  domainPath: "n:authoring:paint",
  parentDomainPath: "n:authoring",
  label: "Authoring Paint",
  responsibility: "Own paint authoring contracts and operations.",
  owns: ["paint authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: [
    "n:authoring:project",
    "n:authoring:brush",
    "n:authoring:material",
    "n:authoring:mesh",
  ],
  provides: ["n:authoring:paint"],
  proofReferences: ["tests/core-domains/core-authoring-surfaces-rig.mjs"],
  proofStatus: "proven",
});
