import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";

const proof = ["tests/core-domain-kits-smoke.mjs"];

export const policyDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "policy-domain", domainPath: "n:policy", label: "Policy", responsibility: "Own product-neutral permission, guard, sandbox, and runtime safety decisions.", owns: ["permissions", "guards", "allowed actions", "blocked actions", "sandbox rules"], forbiddenResponsibilities: ["application approval UI", "identity provider", "business policy", "platform sandbox implementation"], provides: ["n:policy", "policy:guard", "policy:decision"], proofReferences: proof }),
  publicEntry: { subpath: "./domains/policy", module: "./src/core-domains/policy/index.js" },
  publicKits: [atomicKit({ id: "policy-kit", responsibility: "Evaluate declarative runtime safety and permission rules.", domainPath: "n:policy", apiName: "policy", provides: ["n:policy", "policy:guard", "policy:decision"], module: "./src/core-domains/policy/kits/policy-kit/index.js", exportName: "createPolicyKit", publicSubpath: "./domains/policy/guard", proofReferences: proof })]
}));

export default policyDomainManifest;
