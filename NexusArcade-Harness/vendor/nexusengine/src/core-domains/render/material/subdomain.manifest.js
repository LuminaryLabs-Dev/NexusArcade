import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-material-domain",
  domainPath: "n:render:material",
  parentDomainPath: "n:render",
  label: "Render Material",
  responsibility: "Own portable backend-neutral Material execution bindings, aggregate validation, and semantic cache links.",
  owns: [
    "portable Shader binding layouts for Material execution",
    "typed Material parameter sets",
    "exact Texture-view and sampler bindings",
    "aggregate Material instances and Shader variants",
    "provider-observation-backed Material validation records",
    "semantic links to resident material Render Resources"
  ],
  forbiddenResponsibilities: [
    "authored PBR visual or procedural material meaning",
    "physical friction density restitution or contact meaning",
    "Shader source compilation reflection execution or repair",
    "Texture decoding upload or residency ownership",
    "Pipeline pass or draw execution",
    "GPU descriptor sets bind groups samplers handles or commands"
  ],
  requires: [
    "n:render",
    "n:render:shader",
    "n:render:texture",
    "n:render:resource",
    "render:shader-program",
    "render:shader-variant",
    "render:shader-compile",
    "render:shader-reflection",
    "render:texture-resource",
    "render:texture-residency",
    "render:resource-identity",
    "render:resource-lifecycle"
  ],
  provides: [
    "n:render:material",
    "render:material-contract",
    "render:material-binding",
    "render:material-parameter",
    "render:material-texture-binding",
    "render:material-sampler-binding",
    "render:material-instance",
    "render:material-variant",
    "render:material-validation",
    "render:material-cache"
  ],
  proofReferences: proof
});
