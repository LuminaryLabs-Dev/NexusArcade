import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-device-domain",
  domainPath: "n:render:device",
  parentDomainPath: "n:render",
  label: "Render Device",
  responsibility: "Own portable Render device contracts, capability negotiation, semantic accounting, lifecycle, loss, and diagnostics.",
  owns: [
    "portable Render device identity",
    "device feature and limit negotiation",
    "device capability profiles",
    "semantic memory budgets and reservations",
    "logical queue submissions and receipts",
    "device acquisition and release state",
    "device loss records",
    "read-only device diagnostics"
  ],
  forbiddenResponsibilities: [
    "GPU or backend handles",
    "actual memory allocation",
    "command encoding or queue execution",
    "provider repair",
    "host surface lifecycle",
    "target packaging"
  ],
  requires: ["n:render", "render:provider-contract", "render:installation"],
  provides: [
    "n:render:device",
    "render:device-contract",
    "render:device-feature",
    "render:device-limit",
    "render:device-capability",
    "render:device-memory",
    "render:device-queue",
    "render:device-lifecycle",
    "render:device-loss",
    "render:device-diagnostics"
  ],
  proofReferences: proof
});
