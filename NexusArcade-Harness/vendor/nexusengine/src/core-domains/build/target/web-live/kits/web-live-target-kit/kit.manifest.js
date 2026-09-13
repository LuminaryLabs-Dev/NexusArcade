import { defineBuildAtomicKitManifest } from "../../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "web-live-target-kit",
  responsibility: "Emit verified live ESM source, loader, service worker, and cache policy.",
  domainPath: "n:build:target:web-live",
  apiName: "webLiveTarget",
  requires: ["n:build:target", "build:web-module-linker"],
  provides: ["n:build:target:web-live", "build:web-live-target"],
  module: "./src/core-domains/build/target/web-live/kits/web-live-target-kit/index.js",
  exportName: "createWebLiveTargetKit",
  publicSubpath: "./domains/build/target/web-live/web-live-target",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
