import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-animation-domain",
  domainPath: "n:authoring:animation",
  parentDomainPath: "n:authoring",
  label: "Authoring Animation",
  responsibility: "Own animation authoring contracts and operations.",
  owns: ["animation authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: [
    "n:authoring:project",
    "n:authoring:mesh",
    "n:authoring:rig",
    "n:authoring:skin",
  ],
  provides: ["n:authoring:animation"],
  proofReferences: ["tests/core-domains/core-authoring-surfaces-rig.mjs"],
  proofStatus: "proven",
});
