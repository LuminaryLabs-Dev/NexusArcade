export function normalizeChain(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("chain must be an object");
  if (
    !Array.isArray(input.steps) ||
    input.steps.length < 1 ||
    input.steps.length > 32
  ) {
    throw new Error("chain.steps must contain 1 to 32 steps");
  }
  return {
    id: String(input.id ?? "chain"),
    initial: structuredClone(input.initial ?? {}),
    stopOnFallback: input.stopOnFallback === true,
    steps: input.steps.map((step, index) => {
      if (!step || typeof step !== "object")
        throw new Error(`chain step ${index} must be an object`);
      return {
        id: String(step.id ?? `step-${index + 1}`),
        outputKey: String(step.outputKey ?? `step${index + 1}`),
        request: structuredClone(step.request ?? step),
      };
    }),
  };
}
