import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-modifier-service-kit",
  responsibility: "Own modifier source operations.",
  domainPath: "n:authoring:modifier",
  apiName: "authoringModifier",
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:modifier"],
  module:
    "./src/core-domains/authoring/modifier/kits/authoring-modifier-service-kit/index.js",
  exportName: "createAuthoringModifierServiceKit",
  publicSubpath: "./domains/authoring/modifier",
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
