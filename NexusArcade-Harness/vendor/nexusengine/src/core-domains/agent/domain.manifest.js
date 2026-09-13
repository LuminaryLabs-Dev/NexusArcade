import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";

const proof = ["tests/core-kits/core-agent-kit-smoke.mjs"];

export const agentDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "agent-domain", domainPath: "n:agent", label: "Agent", responsibility: "Own product-neutral observation, proposal, decision-cycle, execution receipt, and replay evidence contracts.", owns: ["agent observations", "action proposals", "decision cycles", "execution receipts"], forbiddenResponsibilities: ["model provider", "game AI policy", "LLM prompting", "host tool execution"], provides: ["n:agent", "agent:observation", "agent:proposal", "agent:execution-receipt"], proofReferences: proof }),
  publicEntry: { subpath: "./domains/agent", module: "./src/core-domains/agent/index.js" },
  publicKits: [atomicKit({ id: "agent-cycle-kit", responsibility: "Record observations, action proposals, decision cycles, and execution receipts.", domainPath: "n:agent", apiName: "agent", provides: ["n:agent", "agent:observation", "agent:proposal", "agent:execution-receipt"], module: "./src/core-domains/agent/kits/agent-kit/index.js", exportName: "createAgentKit", publicSubpath: "./domains/agent/cycle", proofReferences: proof })]
}));

export default agentDomainManifest;
