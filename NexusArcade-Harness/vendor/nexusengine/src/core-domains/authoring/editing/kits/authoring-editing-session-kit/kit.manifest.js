import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-editing-session-kit",
  responsibility: "Own editing Authoring contracts and operations.",
  domainPath: "n:authoring:editing",
  apiName: "authoringEditing",
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:editing"],
  module:
    "./src/core-domains/authoring/editing/kits/authoring-editing-session-kit/index.js",
  exportName: "createAuthoringEditingSessionKit",
  publicSubpath: "./domains/authoring/editing",
  proofReferences: [
    "tests/core-domains/core-authoring-foundation.mjs",
    "tests/core-domains/core-authoring-geometry.mjs",
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
