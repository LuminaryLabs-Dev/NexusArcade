import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export default domainNode({
  id: "physics-lifecycle-domain",
  domainPath: "n:physics:lifecycle",
  parentDomainPath: "n:physics",
  label: "Physics Lifecycle",
  responsibility: "Own deterministic installation, startup, stepping, shutdown, reset, and snapshot orchestration contracts.",
  owns: [
    "Physics installation phase",
    "startup readiness receipts",
    "step request sequence",
    "shutdown receipts",
    "composed lifecycle reset",
    "portable lifecycle snapshots"
  ],
  forbiddenResponsibilities: [
    "solver implementation",
    "body or collider state",
    "concrete provider execution",
    "render frame lifecycle"
  ],
  requires: [
    "n:physics",
    "physics:provider-contract",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema"
  ],
  provides: [
    "n:physics:lifecycle",
    "physics:installation",
    "physics:startup",
    "physics:step",
    "physics:shutdown",
    "physics:reset",
    "physics:snapshot"
  ],
  proofReferences: proof
});
