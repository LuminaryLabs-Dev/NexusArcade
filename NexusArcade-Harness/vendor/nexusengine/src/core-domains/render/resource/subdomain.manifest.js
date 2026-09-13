import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-resource-domain",
  domainPath: "n:render:resource",
  parentDomainPath: "n:render",
  label: "Render Resource",
  responsibility: "Own portable Render execution-resource identity, references, semantic residency, accounting, operation receipts, and lifecycle state.",
  owns: [
    "portable execution-resource identities and revisions",
    "exact resource dependency lineage",
    "portable resource references",
    "resource phase and lifecycle state",
    "semantic provider-resource cache index",
    "resource-to-Device Memory claims",
    "external integrity evidence",
    "provider upload and release request receipts"
  ],
  forbiddenResponsibilities: [
    "source asset decoding or content storage",
    "GPU or backend handles",
    "actual device allocation",
    "command encoding or provider execution",
    "cache eviction execution",
    "resource repair",
    "host surface lifecycle"
  ],
  requires: ["n:render", "render:resource-schema", "render:device-contract", "render:device-memory", "render:device-queue", "render:device-lifecycle"],
  provides: [
    "n:render:resource",
    "render:resource-contract",
    "render:resource-identity",
    "render:resource-reference",
    "render:resource-state",
    "render:resource-lifecycle",
    "render:resource-cache",
    "render:resource-budget",
    "render:resource-upload",
    "render:resource-release",
    "render:resource-integrity"
  ],
  proofReferences: proof
});
