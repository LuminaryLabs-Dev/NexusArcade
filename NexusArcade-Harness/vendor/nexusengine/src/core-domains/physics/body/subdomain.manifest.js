import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export default domainNode({
  id: "physics-body-domain",
  domainPath: "n:physics:body",
  parentDomainPath: "n:physics",
  label: "Physics Body",
  responsibility: "Own portable provider-neutral body identity, state, mass properties, sleep state, lifecycle, and exact-once registry mutations.",
  owns: [
    "body identity and type",
    "body pose and velocity descriptors",
    "body force and mass-property descriptors",
    "body sleep and lifecycle state",
    "body records and revisions"
  ],
  forbiddenResponsibilities: [
    "shape or collider geometry",
    "collision detection or contact solving",
    "provider-native body handles",
    "motion integration",
    "actor or gameplay state"
  ],
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema"
  ],
  provides: [
    "n:physics:body",
    "physics:body",
    "physics:body-registry",
    "physics:body-state",
    "physics:body-identity",
    "physics:body-type",
    "physics:body-pose",
    "physics:body-velocity",
    "physics:body-force",
    "physics:body-mass",
    "physics:body-inertia",
    "physics:body-damping",
    "physics:body-sleep",
    "physics:body-wake",
    "physics:body-lifecycle"
  ],
  proofReferences: proof
});

