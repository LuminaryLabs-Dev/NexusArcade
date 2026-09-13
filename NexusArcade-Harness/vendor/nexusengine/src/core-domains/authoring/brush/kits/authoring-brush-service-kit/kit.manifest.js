import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-brush-service-kit",
  responsibility: "Own brush source operations.",
  domainPath: "n:authoring:brush",
  apiName: "authoringBrush",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:brush"],
  module:
    "./src/core-domains/authoring/brush/kits/authoring-brush-service-kit/index.js",
  exportName: "createAuthoringBrushServiceKit",
  publicSubpath: "./domains/authoring/brush",
  proofReferences: [
    "tests/core-domains/core-authoring-geometry.mjs",
    "tests/core-domains/core-authoring-surfaces-rig.mjs",
  ],
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
