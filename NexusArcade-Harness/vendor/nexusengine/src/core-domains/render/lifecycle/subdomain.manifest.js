import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-lifecycle-domain",
  domainPath: "n:render:lifecycle",
  parentDomainPath: "n:render",
  label: "Render Lifecycle",
  responsibility: "Own provider-neutral Render composition installation, startup, shutdown, reset, snapshot, and recovery state.",
  owns: [
    "Render provider installation identity",
    "startup readiness receipts",
    "shutdown receipts",
    "composed lifecycle reset",
    "portable lifecycle snapshots",
    "provider recovery coordination"
  ],
  forbiddenResponsibilities: [
    "engine or Kit runtime lifecycle",
    "provider implementation or execution",
    "GPU resource ownership",
    "frame execution",
    "host surface lifecycle"
  ],
  requires: ["n:render", "render:provider-contract"],
  provides: [
    "n:render:lifecycle",
    "render:installation",
    "render:startup",
    "render:shutdown",
    "render:reset",
    "render:snapshot",
    "render:recovery"
  ],
  proofReferences: proof
});
