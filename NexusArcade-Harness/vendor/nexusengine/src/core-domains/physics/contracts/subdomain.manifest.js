import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export default domainNode({
  id: "physics-contracts-domain",
  domainPath: "n:physics:contracts",
  parentDomainPath: "n:physics",
  label: "Physics Contracts",
  responsibility: "Own portable Physics provider, state, command, event, and query boundary schemas.",
  owns: ["physics provider contract", "physics state schema", "physics command schema", "physics event schema", "physics query schema"],
  forbiddenResponsibilities: ["body state ownership", "collision detection", "constraint solving", "concrete backend execution"],
  requires: ["n:physics"],
  provides: ["n:physics:contracts", "physics:provider-contract", "physics:state-schema", "physics:command-schema", "physics:event-schema", "physics:query-schema"],
  proofReferences: proof
});
