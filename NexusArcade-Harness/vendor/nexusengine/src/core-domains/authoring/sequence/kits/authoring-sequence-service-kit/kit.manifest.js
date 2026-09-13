import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-sequence-service-kit",
  responsibility: "Own sequence source operations.",
  domainPath: "n:authoring:sequence",
  apiName: "authoringSequence",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:sequence"],
  module:
    "./src/core-domains/authoring/sequence/kits/authoring-sequence-service-kit/index.js",
  exportName: "createAuthoringSequenceServiceKit",
  publicSubpath: "./domains/authoring/sequence",
  proofReferences: ["tests/core-domains/core-authoring-integration.mjs"],
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
