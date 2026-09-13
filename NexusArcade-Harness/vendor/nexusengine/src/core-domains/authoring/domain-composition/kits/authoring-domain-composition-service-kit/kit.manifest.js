import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-domain-composition-service-kit",
  responsibility: "Own domain-composition source operations.",
  domainPath: "n:authoring:domain-composition",
  apiName: "authoringDomainComposition",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:domain-composition"],
  module:
    "./src/core-domains/authoring/domain-composition/kits/authoring-domain-composition-service-kit/index.js",
  exportName: "createAuthoringDomainCompositionServiceKit",
  publicSubpath: "./domains/authoring/domain-composition",
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
