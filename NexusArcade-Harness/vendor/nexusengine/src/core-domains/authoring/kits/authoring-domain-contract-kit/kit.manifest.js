import { atomicKit } from "../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-domain-contract-kit",
  responsibility: "Own contract Authoring contracts and operations.",
  domainPath: "n:authoring",
  apiName: "authoring",
  requires: ["n:runtime"],
  provides: ["n:authoring"],
  module:
    "./src/core-domains/authoring/kits/authoring-domain-contract-kit/index.js",
  exportName: "createAuthoringDomainContractKit",
  publicSubpath: "./domains/authoring/contract",
  proofReferences: [
    "tests/core-domains/core-authoring-foundation.mjs",
    "tests/core-domains/core-authoring-geometry.mjs",
    "tests/core-domains/core-authoring-surfaces-rig.mjs",
    "tests/core-domains/core-authoring-integration.mjs",
    "tests/core-domains/core-authoring-modeling.mjs",
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
