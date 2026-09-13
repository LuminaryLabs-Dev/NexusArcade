import { domainNode } from "../../manifest-input.js";

export default domainNode({
  id: "physics-collider-domain",
  domainPath: "n:physics:collider",
  parentDomainPath: "n:physics",
  label: "Physics Collider",
  responsibility: "Own portable collider identity, attachment, filtering, sensor semantics, lifecycle, and exact-once records.",
  owns: [
    "collider identity and attachment",
    "collider-local pose and physical material references",
    "collision layers, masks, groups, and filters",
    "sensor and trigger descriptors",
    "collider lifecycle state",
    "collider records and revisions"
  ],
  forbiddenResponsibilities: [
    "collision detection or contact generation",
    "contact or constraint solving",
    "provider-native collider handles",
    "render geometry or GPU resources",
    "gameplay trigger consequences"
  ],
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:body-registry",
    "physics:shape-registry",
    "physics:material-registry"
  ],
  provides: [
    "n:physics:collider",
    "physics:collider-identity",
    "physics:collider-attachment",
    "physics:collider-pose",
    "physics:collider-material",
    "physics:collision-layer",
    "physics:collision-mask",
    "physics:collision-group",
    "physics:collider-filter",
    "physics:sensor-collider",
    "physics:trigger-collider",
    "physics:collider-lifecycle",
    "physics:collider",
    "physics:collider-registry"
  ],
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
