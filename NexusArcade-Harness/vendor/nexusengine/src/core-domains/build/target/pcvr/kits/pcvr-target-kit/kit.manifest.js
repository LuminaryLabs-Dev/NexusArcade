import { defineBuildAtomicKitManifest } from "../../../../manifest-input.js";

export const kitManifest = defineBuildAtomicKitManifest({
  id: "pcvr-target-kit",
  responsibility: "Own Windows x64 host, OpenXR loader, executable package, and runtime validation stages.",
  domainPath: "n:build:target:pcvr",
  apiName: "pcvrTarget",
  requires: ["n:build:target:openxr", "build:openxr-input", "build:openxr-render", "n:build:compile", "n:build:toolchain"],
  provides: ["n:build:target:pcvr", "build:pcvr-target"],
  module: "./src/core-domains/build/target/pcvr/kits/pcvr-target-kit/index.js",
  exportName: "createPcvrTargetKit",
  publicSubpath: "./domains/build/target/pcvr/pcvr-target",
  proofReferences: ["scripts/prove-native-package.mjs","src/core-domains/build/tests/openxr-package-source.mjs"]
});

export default kitManifest;
