import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-animation-service-kit",
  responsibility: "Own animation source operations.",
  domainPath: "n:authoring:animation",
  apiName: "authoringAnimation",
  requires: [
    "n:authoring:project",
    "n:authoring:mesh",
    "n:authoring:rig",
    "n:authoring:skin",
  ],
  provides: ["n:authoring:animation"],
  module:
    "./src/core-domains/authoring/animation/kits/authoring-animation-service-kit/index.js",
  exportName: "createAuthoringAnimationServiceKit",
  publicSubpath: "./domains/authoring/animation",
  proofReferences: ["tests/core-domains/core-authoring-surfaces-rig.mjs"],
  proofStatus: "proven",
});

manifest.reset.semantics =
  "Reset transient service state; source documents and history are owned and reset by Authoring Project.";
manifest.snapshot.schema = {
  type: "object",
  required: ["schema", "kitId"],
  additionalProperties: false,
  properties: {
    schema: { const: "nexusengine.authoring-service/1" },
    kitId: { const: manifest.id },
  },
};
manifest.proof.references.push("tests/core-domains/core-authoring-public.mjs");
export default manifest;
