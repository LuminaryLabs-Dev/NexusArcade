import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-skin-service-kit",
  responsibility: "Own skin source operations.",
  domainPath: "n:authoring:skin",
  apiName: "authoringSkin",
  requires: [
    "n:authoring:project",
    "n:authoring:mesh",
    "n:authoring:rig",
    "n:authoring:brush",
  ],
  provides: ["n:authoring:skin"],
  module:
    "./src/core-domains/authoring/skin/kits/authoring-skin-service-kit/index.js",
  exportName: "createAuthoringSkinServiceKit",
  publicSubpath: "./domains/authoring/skin",
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
