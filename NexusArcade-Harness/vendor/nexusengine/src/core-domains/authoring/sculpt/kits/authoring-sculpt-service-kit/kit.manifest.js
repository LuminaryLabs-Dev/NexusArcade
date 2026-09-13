import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-sculpt-service-kit",
  responsibility: "Own sculpt source operations.",
  domainPath: "n:authoring:sculpt",
  apiName: "authoringSculpt",
  requires: ["n:authoring:project", "n:authoring:mesh", "n:authoring:brush"],
  provides: ["n:authoring:sculpt"],
  module:
    "./src/core-domains/authoring/sculpt/kits/authoring-sculpt-service-kit/index.js",
  exportName: "createAuthoringSculptServiceKit",
  publicSubpath: "./domains/authoring/sculpt",
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
