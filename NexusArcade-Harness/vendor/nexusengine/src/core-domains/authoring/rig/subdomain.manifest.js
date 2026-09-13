import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-rig-domain",
  domainPath: "n:authoring:rig",
  parentDomainPath: "n:authoring",
  label: "Authoring Rig",
  responsibility: "Own rig authoring contracts and operations.",
  owns: ["rig authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:rig"],
  proofReferences: ["tests/core-domains/core-authoring-surfaces-rig.mjs"],
  proofStatus: "proven",
});
