import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-rig-service-kit",
  responsibility: "Own rig source operations.",
  domainPath: "n:authoring:rig",
  apiName: "authoringRig",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:rig"],
  module:
    "./src/core-domains/authoring/rig/kits/authoring-rig-service-kit/index.js",
  exportName: "createAuthoringRigServiceKit",
  publicSubpath: "./domains/authoring/rig",
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
