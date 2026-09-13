export function createObjectiveFlow(config = {}) {
  return Object.freeze({
    id: config.id ?? "objective-flow",
    status: config.status ?? "ready",
    steps: Object.freeze((config.steps ?? []).map((step, index) => Object.freeze({
      id: step.id ?? `step-${index + 1}`,
      label: step.label ?? step.id ?? `Step ${index + 1}`,
      requiredAction: step.requiredAction ?? step.action ?? "next",
      target: Math.max(1, Number(step.target ?? 1)),
      metadata: Object.freeze({ ...(step.metadata ?? {}) })
    }))),
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}

export function createObjectiveStep(config = {}) {
  return Object.freeze({
    id: config.id ?? "objective-step",
    label: config.label ?? config.id ?? "Objective Step",
    requiredAction: config.requiredAction ?? "next",
    target: Math.max(1, Number(config.target ?? 1)),
    progress: Math.max(0, Number(config.progress ?? 0)),
    complete: config.complete === true
  });
}
