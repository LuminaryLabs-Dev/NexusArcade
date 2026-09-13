import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "web-module-linker-kit",
  responsibility: "Materialize a verified, content-addressed browser module closure from immutable project sources.",
  domainPath: "n:build:compile",
  apiName: "webModuleLinker",
  requires: ["n:build:compile", "build:process-execution"],
  provides: ["build:web-module-linker"],
  module: "./src/core-domains/build/compile/kits/web-module-linker-kit/index.js",
  exportName: "createWebModuleLinkerKit",
  publicSubpath: "./domains/build/compile/web-module-linker",
  proofReferences: [
    "src/core-domains/build/tests/domain-tree.mjs",
    "src/core-domains/build/tests/web-target-browser.mjs"
  ]
});

export default kitManifest;
