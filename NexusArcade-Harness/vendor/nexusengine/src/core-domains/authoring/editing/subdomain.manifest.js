import { domainNode } from "../../manifest-input.js";
export default domainNode({
  id: "authoring-editing-domain",
  domainPath: "n:authoring:editing",
  parentDomainPath: "n:authoring",
  label: "Authoring Editing",
  responsibility: "Own editable editing contracts and operations.",
  owns: ["editing source vocabulary"],
  forbiddenResponsibilities: ["platform implementation", "runtime playback"],
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:editing"],
  proofReferences: [
    "tests/core-domains/core-authoring-foundation.mjs",
    "tests/core-domains/core-authoring-geometry.mjs",
  ],
  proofStatus: "proven",
});
