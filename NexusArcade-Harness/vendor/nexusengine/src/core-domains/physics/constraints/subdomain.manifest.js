import { domainNode } from "../../manifest-input.js";

export default domainNode({
  id: "physics-constraints-domain",
  domainPath: "n:physics:constraints",
  parentDomainPath: "n:physics",
  label: "Physics Constraints",
  responsibility: "Own portable constraint descriptors, exact records, lifecycle status, revisions, and break policy semantics.",
  owns: [
    "constraint descriptor type schemas",
    "constraint-local body frames",
    "constraint records and revisions",
    "constraint enabled, disabled, and terminal broken state",
    "constraint break policy normalization and pure threshold evaluation",
    "body-reference validation and detachment guard contract"
  ],
  forbiddenResponsibilities: [
    "body records or body deletion",
    "collision detection or contact generation",
    "constraint solving or impulse application",
    "provider-native constraint handles",
    "rendering or gameplay consequences"
  ],
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema",
    "physics:body-registry"
  ],
  provides: [
    "n:physics:constraints",
    "physics:ball-socket-constraint",
    "physics:cone-twist-constraint",
    "physics:distance-constraint",
    "physics:drive-constraint",
    "physics:fixed-constraint",
    "physics:hinge-constraint",
    "physics:limit-constraint",
    "physics:motor-constraint",
    "physics:slider-constraint",
    "physics:spring-constraint",
    "physics:constraint-break",
    "physics:constraint",
    "physics:constraint-registry"
  ],
  proofReferences: ["tests/core-domains/core-physics-constraints-descriptors.mjs", "tests/core-domains/core-physics-constraints-registry.mjs", "tests/core-domains/core-physics-constraints-integration.mjs", "tests/core-domains/core-physics-constraints-public.mjs"],
  proofStatus: "proven"
});
