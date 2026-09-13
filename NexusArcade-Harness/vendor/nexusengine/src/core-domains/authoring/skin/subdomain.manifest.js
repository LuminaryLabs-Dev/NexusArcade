import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-skin-domain",
  domainPath: "n:authoring:skin",
  parentDomainPath: "n:authoring",
  label: "Authoring Skin",
  responsibility: "Own skin authoring contracts and operations.",
  owns: ["skin authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: [
    "n:authoring:project",
    "n:authoring:mesh",
    "n:authoring:rig",
    "n:authoring:brush",
  ],
  provides: ["n:authoring:skin"],
  proofReferences: ["tests/core-domains/core-authoring-surfaces-rig.mjs"],
  proofStatus: "proven",
});
