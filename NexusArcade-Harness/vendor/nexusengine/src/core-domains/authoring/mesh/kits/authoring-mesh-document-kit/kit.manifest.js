import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-mesh-document-kit",
  responsibility: "Own mesh Authoring contracts and operations.",
  domainPath: "n:authoring:mesh",
  apiName: "authoringMesh",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:mesh"],
  module:
    "./src/core-domains/authoring/mesh/kits/authoring-mesh-document-kit/index.js",
  exportName: "createAuthoringMeshDocumentKit",
  publicSubpath: "./domains/authoring/mesh",
  proofReferences: ["tests/core-domains/core-authoring-geometry.mjs"],
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
