export function createAffordanceState(config = {}) {
  return Object.freeze({
    id: config.id ?? "affordance",
    targetId: config.targetId ?? null,
    actions: Object.freeze([...(config.actions ?? [])]),
    usable: config.usable !== false,
    locked: config.locked === true,
    blocked: config.blocked === true,
    completed: config.completed === true,
    highlighted: config.highlighted === true,
    reason: config.reason ?? null,
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}
