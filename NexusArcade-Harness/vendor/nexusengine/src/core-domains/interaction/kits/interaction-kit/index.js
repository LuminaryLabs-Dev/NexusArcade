import { createDomainKit } from "../../../domain-kit.js";

export * from "./targets.js";
export * from "./affordances.js";
export * from "./activation.js";
export * from "./prompts.js";
export * from "./results.js";

export function createInteractionKit(config = {}) {
  return createDomainKit({
    ...config,

    manifestId: "interaction-kit",
    id: config.id ?? "interaction-kit",

    domainPath: config.domainPath ?? "n:interaction",
    domain: "interaction",

    apiName: config.apiName ?? "interaction",
    purpose: "Targets, affordances, activation progress, prompts, semantic requirements, and interaction completion events.",
    owns: ["targets", "affordances", "activation progress", "prompts", "interaction completion events"],
    doesNotOwn: ["raw input device handling", "renderer UI implementation"],
    metadata: {
      ...(config.metadata ?? {}),
      piecesFirst: true
    }
  });
}
