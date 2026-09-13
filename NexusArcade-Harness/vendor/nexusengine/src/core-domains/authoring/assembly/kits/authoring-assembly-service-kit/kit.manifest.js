import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-assembly-service-kit",
  responsibility: "Own assembly source operations.",
  domainPath: "n:authoring:assembly",
  apiName: "authoringAssembly",
  requires: [
    "n:authoring:project",
    "n:authoring:mesh",
    "n:authoring:material",
    "n:authoring:rig",
    "n:authoring:skin",
    "n:authoring:animation",
  ],
  provides: ["n:authoring:assembly"],
  module:
    "./src/core-domains/authoring/assembly/kits/authoring-assembly-service-kit/index.js",
  exportName: "createAuthoringAssemblyServiceKit",
  publicSubpath: "./domains/authoring/assembly",
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
