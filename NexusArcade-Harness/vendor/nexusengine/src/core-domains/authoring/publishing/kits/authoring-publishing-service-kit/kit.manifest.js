import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-publishing-service-kit",
  responsibility: "Own publishing source operations.",
  domainPath: "n:authoring:publishing",
  apiName: "authoringPublishing",
  requires: ["n:authoring:project", "n:authoring:assembly"],
  provides: ["n:authoring:publishing"],
  module:
    "./src/core-domains/authoring/publishing/kits/authoring-publishing-service-kit/index.js",
  exportName: "createAuthoringPublishingServiceKit",
  publicSubpath: "./domains/authoring/publishing",
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
