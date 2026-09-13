export function createInteractionTarget(config = {}) {
  return Object.freeze({
    id: config.id ?? "interaction-target",
    group: config.group ?? "default",
    action: config.action ?? "interact",
    requiredCount: Math.max(1, Number(config.requiredCount ?? config.count ?? 1)),
    progress: Math.max(0, Number(config.progress ?? 0)),
    complete: config.complete === true,
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}
