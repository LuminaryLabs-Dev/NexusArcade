import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";
import { RESTORED_INTERACTION_ADAPTER_KITS, RESTORED_INTERACTION_KITS, RESTORED_INTERACTION_SUBDOMAINS } from "./restored-behavior-manifests.js";

const interactionProof = ["tests/core-kits/core-interaction-kit-smoke.mjs"];
const inputProof = ["tests/core-kits/core-input-kit-smoke.mjs"];

export const interactionDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "interaction-domain", domainPath: "n:interaction", label: "Interaction", responsibility: "Own targets, affordances, activation progress, semantic requirements, prompts, and completion results.", owns: ["interaction targets", "affordances", "activation state", "interaction results"], forbiddenResponsibilities: ["device polling", "game dialogue", "UI rendering", "physics hit testing"], provides: ["n:interaction", "interaction:target", "interaction:affordance", "interaction:result"], proofReferences: interactionProof }),
  subdomains: [domainNode({ id: "interaction-input-domain", domainPath: "n:interaction:input", parentDomainPath: "n:interaction", label: "Interaction Input", responsibility: "Own semantic input actions, axes, contexts, bindings, dead zones, and adapter contracts.", owns: ["semantic actions", "axes", "input contexts", "binding descriptors", "dead zones"], forbiddenResponsibilities: ["device polling", "browser events", "native input SDK", "game commands"], provides: ["n:interaction:input", "input:action", "input:axis", "input:context", "input:adapter-contract"], proofReferences: inputProof }), ...RESTORED_INTERACTION_SUBDOMAINS],
  publicEntry: { subpath: "./domains/interaction", module: "./src/core-domains/interaction/index.js" },
  publicKits: [
    atomicKit({ id: "interaction-kit", responsibility: "Manage interaction targets, affordances, activation, and results.", domainPath: "n:interaction", apiName: "interaction", provides: ["n:interaction", "interaction:target", "interaction:affordance", "interaction:result"], module: "./src/core-domains/interaction/kits/interaction-kit/index.js", exportName: "createInteractionKit", publicSubpath: "./domains/interaction/runtime", proofReferences: interactionProof }),
    atomicKit({ id: "input-contract-kit", responsibility: "Normalize semantic input actions, axes, contexts, and bindings.", domainPath: "n:interaction:input", apiName: "input", provides: ["n:interaction:input", "input:action", "input:axis", "input:context", "input:adapter-contract"], module: "./src/core-domains/interaction/input/kits/input-kit/index.js", exportName: "createInputKit", publicSubpath: "./domains/interaction/input", proofReferences: inputProof }),
    ...RESTORED_INTERACTION_KITS,
    ...RESTORED_INTERACTION_ADAPTER_KITS
  ],
  adapters: RESTORED_INTERACTION_ADAPTER_KITS.map((kit) => ({ id: kit.id, domainPath: kit.domainPath, responsibility: kit.responsibility, source: { module: kit.source.module }, environments: kit.environments, proofReferences: kit.proof.references }))
}));

export default interactionDomainManifest;
