import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";

const proof = ["tests/core-domains/core-creature-character-player-smoke.mjs", "tests/core-domain-kits-smoke.mjs"];

export const actorDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "actor-domain", domainPath: "n:actor", label: "Actor", responsibility: "Own neutral embodied actor identity and shared actor references.", owns: ["actor identity", "embodiment references", "actor lifecycle contracts"], forbiddenResponsibilities: ["AI decisions", "player input", "game factions", "rendering"], provides: ["n:actor", "actor:identity", "actor:embodiment"], proofReferences: proof }),
  subdomains: [
    domainNode({ id: "actor-creature-domain", domainPath: "n:actor:creature", parentDomainPath: "n:actor", label: "Actor Creature", responsibility: "Own neutral creature embodiment definitions and references.", owns: ["creature definitions", "creature registry", "creature embodiment references"], forbiddenResponsibilities: ["AI policy", "game species lore", "rendering"], requires: ["n:actor"], provides: ["n:actor:creature", "creature:definition", "creature:registry"], proofReferences: proof }),
    domainNode({ id: "actor-character-domain", domainPath: "n:actor:character", parentDomainPath: "n:actor", label: "Actor Character", responsibility: "Own active embodied character identity and neutral runtime bindings.", owns: ["character descriptors", "character registry", "character resolution"], forbiddenResponsibilities: ["player authority", "AI planning", "dialogue content", "rendering"], requires: ["n:actor"], provides: ["n:actor:character", "character:descriptor", "character:registry"], proofReferences: proof }),
    domainNode({ id: "actor-player-domain", domainPath: "n:actor:player", parentDomainPath: "n:actor", label: "Actor Player", responsibility: "Own neutral player identity, possession, control authority, and spawn generations.", owns: ["player identity", "possession", "control authority", "spawn generation"], forbiddenResponsibilities: ["input bindings", "avatar rendering", "game account service"], requires: ["n:actor:character"], provides: ["n:actor:player", "player:identity", "player:possession", "player:control-authority"], proofReferences: proof })
  ],
  publicEntry: { subpath: "./domains/actor", module: "./src/core-domains/actor/index.js" },
  publicKits: [
    atomicKit({ id: "actor-registry-kit", responsibility: "Own neutral actor identities and embodiment references.", domainPath: "n:actor", apiName: "actor", provides: ["n:actor", "actor:identity", "actor:embodiment"], module: "./src/core-domains/actor/kits/actor-registry-kit/index.js", exportName: "createActorRegistryKit", publicSubpath: "./domains/actor/registry", proofReferences: proof }),
    atomicKit({ id: "creature-registry-kit", responsibility: "Register and resolve neutral creature embodiment definitions.", domainPath: "n:actor:creature", apiName: "creature", requires: ["n:actor"], provides: ["n:actor:creature", "creature:definition", "creature:registry"], module: "./src/core-domains/actor/creature/kits/creature-kit/index.js", exportName: "createCreatureKit", publicSubpath: "./domains/actor/creature", proofReferences: proof }),
    atomicKit({ id: "character-registry-kit", responsibility: "Register and resolve active embodied character descriptors.", domainPath: "n:actor:character", apiName: "character", requires: ["n:actor", "n:actor:creature"], provides: ["n:actor:character", "character:descriptor", "character:registry", "character:resolution"], module: "./src/core-domains/actor/character/kits/character-kit/index.js", exportName: "createCharacterKit", publicSubpath: "./domains/actor/character", proofReferences: proof }),
    atomicKit({ id: "player-authority-kit", responsibility: "Track player identity, possession, control authority, and spawn generations.", domainPath: "n:actor:player", apiName: "player", requires: ["n:actor:character"], provides: ["n:actor:player", "player:identity", "player:possession", "player:control-authority"], module: "./src/core-domains/actor/player/kits/player-kit/index.js", exportName: "createPlayerKit", publicSubpath: "./domains/actor/player", proofReferences: proof })
  ]
}));

export default actorDomainManifest;
