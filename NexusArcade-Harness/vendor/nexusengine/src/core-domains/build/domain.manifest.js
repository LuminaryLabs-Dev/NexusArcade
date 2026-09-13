import { defineCoreDomainManifest } from "../domain-manifest.js";
import { domainNode, manifestShell } from "../manifest-input.js";
import { BUILD_ATOMIC_KIT_MANIFESTS } from "./kit-manifests.js";
import {
  BUILD_SUBDOMAIN_MANIFESTS,
  BUILD_SUBDOMAIN_PUBLIC_ENTRIES
} from "./subdomain-manifests.js";

const proof = [
  "src/core-domains/build/tests/domain-tree.mjs",
  "src/core-domains/build/tests/full-build-loop.mjs",
  "src/core-domains/build/tests/native-lowering.mjs",
  "src/core-domains/build/tests/quickjs-sandbox.mjs",
  "src/core-domains/build/tests/openxr-package-source.mjs"
];

export const buildDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({
    id: "build-domain",
    domainPath: "n:build",
    label: "Build",
    responsibility: "Own isolated build-time source analysis, compilation, toolchains, targets, artifacts, receipts, and proof without entering application runtime composition.",
    owns: [
      "build source identities",
      "compiler IR",
      "build plans and approvals",
      "toolchain stages",
      "target hosts and packaging",
      "artifact receipts"
    ],
    forbiddenResponsibilities: [
      "application runtime state",
      "project source mutation",
      "authored product behavior",
      "package postinstall downloads"
    ],
    provides: ["n:build", "build:inspect", "build:plan", "build:apply", "build:receipt"],
    proofReferences: proof
  }),
  subdomains: BUILD_SUBDOMAIN_MANIFESTS,
  publicEntry: {
    subpath: "./domains/build",
    module: "./src/core-domains/build/index.js"
  },
  publicEntries: BUILD_SUBDOMAIN_PUBLIC_ENTRIES,
  publicKits: BUILD_ATOMIC_KIT_MANIFESTS
}));

export default buildDomainManifest;
