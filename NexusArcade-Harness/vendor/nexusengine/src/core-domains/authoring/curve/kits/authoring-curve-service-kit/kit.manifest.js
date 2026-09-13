import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-curve-service-kit",
  responsibility: "Own curve source operations.",
  domainPath: "n:authoring:curve",
  apiName: "authoringCurve",
  requires: ["n:authoring:project", "n:authoring:mesh"],
  provides: ["n:authoring:curve"],
  module:
    "./src/core-domains/authoring/curve/kits/authoring-curve-service-kit/index.js",
  exportName: "createAuthoringCurveServiceKit",
  publicSubpath: "./domains/authoring/curve",
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
