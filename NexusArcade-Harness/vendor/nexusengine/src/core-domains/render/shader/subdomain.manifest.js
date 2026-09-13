import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-shader-domain",
  domainPath: "n:render:shader",
  parentDomainPath: "n:render",
  label: "Render Shader",
  responsibility: "Own provider-neutral Shader source lineage, module and program composition, variants, compile state, reflection observations, and semantic cache links.",
  owns: [
    "portable Shader stage and language contracts",
    "immutable source and include lineage",
    "single-stage modules and linked program topology",
    "bounded variants and permutations",
    "exact-once logical compile state",
    "normalized provider reflection",
    "semantic links to resident shader-program resources"
  ],
  forbiddenResponsibilities: [
    "shader authoring policy",
    "file or network retrieval",
    "preprocessor parser compiler or linker execution",
    "provider binaries and GPU program handles",
    "material parameter binding",
    "pipeline or frame execution",
    "source repair"
  ],
  requires: [
    "n:render",
    "n:render:contracts",
    "n:render:device",
    "n:render:resource",
    "render:shader-schema",
    "render:device-capability",
    "render:device-queue",
    "render:resource-identity",
    "render:resource-lifecycle"
  ],
  provides: [
    "n:render:shader",
    "render:shader-contract",
    "render:shader-language",
    "render:shader-source",
    "render:shader-include",
    "render:shader-module",
    "render:shader-program",
    "render:shader-variant",
    "render:shader-permutation",
    "render:shader-error",
    "render:shader-compile",
    "render:shader-reflection",
    "render:shader-cache"
  ],
  proofReferences: proof
});
