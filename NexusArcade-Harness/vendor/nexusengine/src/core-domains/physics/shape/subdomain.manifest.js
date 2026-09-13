import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export default domainNode({
  id: "physics-shape-domain",
  domainPath: "n:physics:shape",
  parentDomainPath: "n:physics",
  label: "Physics Shape",
  responsibility: "Own portable provider-neutral collision-shape identity, geometry descriptors, validation, and exact-once registration.",
  owns: [
    "shape identity",
    "primitive geometry descriptors",
    "mesh and heightfield collision descriptors",
    "compound and scaled shape composition",
    "shape validation and registry state"
  ],
  forbiddenResponsibilities: [
    "collision detection",
    "contact generation or solving",
    "provider shape objects",
    "render geometry or GPU resources",
    "authored level geometry"
  ],
  requires: ["n:physics", "physics:state-schema", "physics:command-schema"],
  provides: [
    "n:physics:shape",
    "physics:shape",
    "physics:shape-identity",
    "physics:shape-validation",
    "physics:sphere-shape",
    "physics:box-shape",
    "physics:capsule-shape",
    "physics:cylinder-shape",
    "physics:cone-shape",
    "physics:plane-shape",
    "physics:convex-shape",
    "physics:triangle-mesh-shape",
    "physics:heightfield-shape",
    "physics:compound-shape",
    "physics:scaled-shape",
    "physics:shape-registry"
  ],
  proofReferences: proof
});
