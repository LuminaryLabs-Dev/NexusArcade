import { domainNode } from "../../manifest-input.js";

export default domainNode({
  id: "physics-detection-domain",
  domainPath: "n:physics:detection",
  parentDomainPath: "n:physics",
  label: "Physics Detection",
  responsibility: "Own provider-neutral broad-phase and narrow-phase collision classification without contact or solver behavior.",
  owns: [
    "portable spatial proxies and bounds",
    "deterministic broad-phase pair generation",
    "analytic primitive intersections",
    "convex GJK and EPA reference algorithms",
    "linear sphere time of impact",
    "portable collision-detection outcomes"
  ],
  forbiddenResponsibilities: [
    "body or collider lifecycle ownership",
    "provider-native acceleration structures",
    "contact manifolds or trigger events",
    "constraint or impulse solving",
    "gameplay collision reactions"
  ],
  requires: ["n:physics", "n:physics:shape", "n:physics:collider"],
  provides: [
    "n:physics:detection",
    "physics:spatial-partition",
    "physics:dynamic-tree",
    "physics:sweep-and-prune",
    "physics:broad-phase-pair",
    "physics:broad-phase",
    "physics:shape-intersection",
    "physics:gjk",
    "physics:epa",
    "physics:narrow-phase",
    "physics:continuous-collision",
    "physics:collision-detection-result"
  ],
  proofReferences: ["tests/core-domains/core-physics-detection-smoke.mjs"]
});
