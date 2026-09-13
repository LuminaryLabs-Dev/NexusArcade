import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-paint-service-kit",
  responsibility: "Own paint source operations.",
  domainPath: "n:authoring:paint",
  apiName: "authoringPaint",
  requires: [
    "n:authoring:project",
    "n:authoring:brush",
    "n:authoring:material",
    "n:authoring:mesh",
  ],
  provides: ["n:authoring:paint"],
  module:
    "./src/core-domains/authoring/paint/kits/authoring-paint-service-kit/index.js",
  exportName: "createAuthoringPaintServiceKit",
  publicSubpath: "./domains/authoring/paint",
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
