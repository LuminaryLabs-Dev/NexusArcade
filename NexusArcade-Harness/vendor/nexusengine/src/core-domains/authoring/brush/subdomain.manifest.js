import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-brush-domain",
  domainPath: "n:authoring:brush",
  parentDomainPath: "n:authoring",
  label: "Authoring Brush",
  responsibility: "Own brush authoring contracts and operations.",
  owns: ["brush authoring vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project"],
  provides: ["n:authoring:brush"],
  proofReferences: [
    "tests/core-domains/core-authoring-geometry.mjs",
    "tests/core-domains/core-authoring-surfaces-rig.mjs",
  ],
  proofStatus: "proven",
});
