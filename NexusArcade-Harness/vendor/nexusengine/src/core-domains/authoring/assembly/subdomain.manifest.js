import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-assembly-domain",
  domainPath: "n:authoring:assembly",
  parentDomainPath: "n:authoring",
  label: "Authoring Assembly",
  responsibility: "Own assembly authoring contracts and operations.",
  owns: ["assembly authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: [
    "n:authoring:project",
    "n:authoring:mesh",
    "n:authoring:material",
    "n:authoring:rig",
    "n:authoring:skin",
    "n:authoring:animation",
  ],
  provides: ["n:authoring:assembly"],
  proofReferences: ["tests/core-domains/core-authoring-integration.mjs"],
  proofStatus: "proven",
});
