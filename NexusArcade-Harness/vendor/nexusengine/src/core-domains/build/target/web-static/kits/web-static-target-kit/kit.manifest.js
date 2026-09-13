import { defineBuildAtomicKitManifest } from "../../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "web-static-target-kit",
  responsibility: "Emit a self-contained static Web directory.",
  domainPath: "n:build:target:web-static",
  apiName: "webStaticTarget",
  requires: ["n:build:target", "build:web-module-linker"],
  provides: ["n:build:target:web-static", "build:web-static-target"],
  module: "./src/core-domains/build/target/web-static/kits/web-static-target-kit/index.js",
  exportName: "createWebStaticTargetKit",
  publicSubpath: "./domains/build/target/web-static/web-static-target",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
