import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export default domainNode({
  id: "physics-material-domain",
  domainPath: "n:physics:material",
  parentDomainPath: "n:physics",
  label: "Physics Material",
  responsibility: "Own portable physical material identity, coefficients, surface classification, and deterministic pair-combine policy.",
  owns: [
    "physical material records",
    "friction coefficients",
    "restitution coefficients",
    "mass density descriptors",
    "physical surface classification",
    "material pair combine policy"
  ],
  forbiddenResponsibilities: [
    "visual materials, shaders, or textures",
    "authored audio or effects",
    "body or collider state",
    "contact generation or solving",
    "concrete provider execution"
  ],
  requires: [
    "n:physics",
    "physics:state-schema",
    "physics:command-schema",
    "physics:event-schema"
  ],
  provides: [
    "n:physics:material",
    "physics:material",
    "physics:friction-material",
    "physics:restitution-material",
    "physics:density-material",
    "physics:surface-material",
    "physics:material-combine-policy"
  ],
  proofReferences: proof
});
