import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-uv-service-kit",
  responsibility: "Own uv source operations.",
  domainPath: "n:authoring:uv",
  apiName: "authoringUV",
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:uv"],
  module:
    "./src/core-domains/authoring/uv/kits/authoring-uv-service-kit/index.js",
  exportName: "createAuthoringUVServiceKit",
  publicSubpath: "./domains/authoring/uv",
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
