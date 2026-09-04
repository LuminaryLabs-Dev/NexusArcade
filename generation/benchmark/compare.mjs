export function compare(before, after) {
  return {
    sameCases:
      JSON.stringify(before.results.map((x) => x.id)) ===
      JSON.stringify(after.results.map((x) => x.id)),
    correctDelta: after.correct - before.correct,
    callDelta: after.calls - before.calls,
    fallbackDelta: after.fallbacks - before.fallbacks,
  };
}
