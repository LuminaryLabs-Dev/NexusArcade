import { atomicKit } from "../../../../manifest-input.js";
export default atomicKit({
  id: "authoring-project-document-kit",
  responsibility: "Own project Authoring contracts and operations.",
  domainPath: "n:authoring:project",
  apiName: "authoringProject",
  requires: ["n:authoring"],
  provides: ["n:authoring:project"],
  module:
    "./src/core-domains/authoring/project/kits/authoring-project-document-kit/index.js",
  exportName: "createAuthoringProjectDocumentKit",
  publicSubpath: "./domains/authoring/project",
  proofReferences: ["tests/core-domains/core-authoring-foundation.mjs"],
  proofStatus: "proven",
});
