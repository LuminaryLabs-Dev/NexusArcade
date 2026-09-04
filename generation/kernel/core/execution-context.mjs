export function createExecutionContext({
  seed = 73019,
  initial = {},
  runId,
} = {}) {
  const normalizedSeed = Number.isSafeInteger(seed) ? seed : 73019;
  return {
    runId: runId ?? `liquid-${normalizedSeed}`,
    seed: normalizedSeed,
    values: structuredClone(initial),
    trace: [],
    record(type, data = {}) {
      this.trace.push({
        sequence: this.trace.length + 1,
        type,
        ...structuredClone(data),
      });
    },
  };
}
