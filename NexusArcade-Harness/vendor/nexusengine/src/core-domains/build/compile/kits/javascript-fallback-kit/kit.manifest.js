import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "javascript-fallback-kit",
  responsibility: "Execute capability-restricted whole-Kit QuickJS-NG fallback.",
  domainPath: "n:build:compile",
  apiName: "javascriptFallback",
  requires: ["n:build:compile"],
  provides: ["build:javascript-fallback"],
  module: "./src/core-domains/build/compile/kits/javascript-fallback-kit/index.js",
  exportName: "createJavascriptFallbackKit",
  publicSubpath: "./domains/build/compile/javascript-fallback",
  proofReferences: ["src/core-domains/build/tests/quickjs-sandbox.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
