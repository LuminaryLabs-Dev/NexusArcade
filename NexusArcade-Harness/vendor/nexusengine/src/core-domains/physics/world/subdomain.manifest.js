import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export default domainNode({
  id: "physics-world-domain",
  domainPath: "n:physics:world",
  parentDomainPath: "n:physics",
  label: "Physics World",
  responsibility: "Own portable solver-facing Physics world records, physical fields, Physics time scales, and physical simulation regions.",
  owns: [
    "Physics world identity and settings",
    "gravity field descriptors",
    "generic physical force field descriptors",
    "physical wind velocity descriptors",
    "Physics-only time scaling",
    "physical simulation activation regions"
  ],
  forbiddenResponsibilities: [
    "authored weather or climate evolution",
    "semantic World regions or game routes",
    "Runtime scheduling or clock ownership",
    "body, collider, contact, or solver state",
    "visual wind effects or renderer resources",
    "concrete provider execution"
  ],
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema"
  ],
  provides: [
    "n:physics:world",
    "physics:world",
    "physics:world-settings",
    "physics:gravity-field",
    "physics:force-field",
    "physics:wind-field",
    "physics:time-scale",
    "physics:simulation-region"
  ],
  proofReferences: proof
});
