import { atomicKit } from "../../../../manifest-input.js";
const manifest = atomicKit({
  id: "authoring-workspace-service-kit",
  responsibility: "Own workspace source operations.",
  domainPath: "n:authoring:workspace",
  apiName: "authoringWorkspace",
  requires: ["n:authoring:project"],
  provides: ["n:authoring:workspace"],
  module:
    "./src/core-domains/authoring/workspace/kits/authoring-workspace-service-kit/index.js",
  exportName: "createAuthoringWorkspaceServiceKit",
  publicSubpath: "./domains/authoring/workspace",
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
