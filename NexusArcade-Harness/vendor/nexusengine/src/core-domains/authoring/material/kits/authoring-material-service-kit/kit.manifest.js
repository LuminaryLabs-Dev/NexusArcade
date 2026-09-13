import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-material-service-kit",
  responsibility: "Own material source operations.",
  domainPath: "n:authoring:material",
  apiName: "authoringMaterial",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:material"],
  module:
    "./src/core-domains/authoring/material/kits/authoring-material-service-kit/index.js",
  exportName: "createAuthoringMaterialServiceKit",
  publicSubpath: "./domains/authoring/material",
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
