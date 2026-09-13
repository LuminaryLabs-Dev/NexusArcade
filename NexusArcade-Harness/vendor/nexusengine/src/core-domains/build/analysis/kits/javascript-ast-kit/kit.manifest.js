import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "javascript-ast-kit",
  responsibility: "Parse JavaScript and TypeScript with a real compiler AST.",
  domainPath: "n:build:analysis",
  apiName: "javascriptAst",
  requires: ["n:build:source"],
  provides: ["n:build:analysis", "build:javascript-ast"],
  module: "./src/core-domains/build/analysis/kits/javascript-ast-kit/index.js",
  exportName: "createJavascriptAstKit",
  publicSubpath: "./domains/build/analysis/javascript-ast",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
