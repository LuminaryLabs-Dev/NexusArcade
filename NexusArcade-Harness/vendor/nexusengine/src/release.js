export const NEXUS_ENGINE_VERSION = "0.0.4";
export const NEXUS_ENGINE_STABILITY = "stable-candidate";
export const NEXUS_ENGINE_RELEASE_BRANCH = "main";

export const NEXUS_ENGINE_RELEASE = Object.freeze({
  name: "nexusengine",
  version: NEXUS_ENGINE_VERSION,
  stability: NEXUS_ENGINE_STABILITY,
  branch: NEXUS_ENGINE_RELEASE_BRANCH,
  scope: Object.freeze([
    "runtime-substrate",
    "runtime-kit-contract",
    "domain-service-kit-contract",
    "domain-manifest-v2-contract",
    "manifest-generated-semantic-domain-catalog",
    "composition-and-mcp-contracts",
    "exploratory-build-domain",
    "build-cli-and-mcp-contracts",
    "web-live-and-web-static-targets",
    "semantic-core-domains",
    "frozen-protokit-disposition-ledger",
    "generated-guide-and-pdf",
    "sequence-runtime",
    "sequence-node-runtime",
    "surface-contracts",
    "release-gate"
  ]),
  stableApiFamilies: Object.freeze([
    "ecs",
    "engine",
    "surfaces",
    "runtime-kit",
    "domain-service-kit",
    "composition",
    "build",
    "domain-catalog",
    "semantic-domain-subpaths"
  ]),
  notes: "0.0.4 is the manifest-owned semantic Core cutover with an isolated build-time Domain. Runtime adapters and product Kits resolve outside NexusEngine; native Build success remains proof gated."
});
