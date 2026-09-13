import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-contracts-domain",
  domainPath: "n:render:contracts",
  parentDomainPath: "n:render",
  label: "Render Contracts",
  responsibility: "Own portable Render provider, resource, frame, resolved-pass, shader-interface, and event boundary schemas.",
  owns: ["Render provider contract", "Render resource schema", "Render frame schema", "resolved Render pass schema", "shader interface schema", "Render event schema"],
  forbiddenResponsibilities: ["Presentation graph ownership", "GPU resource allocation", "shader compilation", "frame execution", "concrete backend handles"],
  requires: ["n:render"],
  provides: ["n:render:contracts", "render:provider-contract", "render:resource-schema", "render:frame-schema", "render:pass-schema", "render:shader-schema", "render:event-schema"],
  proofReferences: proof
});
