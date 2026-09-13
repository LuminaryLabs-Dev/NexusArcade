import { defineBuildAtomicKitManifest } from "../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "native-runtime-link-kit",
  responsibility: "Create exact generated-runtime and native-library link plans.",
  domainPath: "n:build:compile",
  apiName: "nativeRuntimeLink",
  requires: ["n:build:compile"],
  provides: ["build:native-runtime-link"],
  module: "./src/core-domains/build/compile/kits/native-runtime-link-kit/index.js",
  exportName: "createNativeRuntimeLinkKit",
  publicSubpath: "./domains/build/compile/native-runtime-link",
  proofReferences: ["src/core-domains/build/tests/domain-tree.mjs","src/core-domains/build/tests/full-build-loop.mjs"]
});

export default kitManifest;
