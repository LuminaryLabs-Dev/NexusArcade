export function createCheckpointProgress(config = {}) {
  const checkpoints = (config.checkpoints ?? []).map((checkpoint, index) => ({
    id: checkpoint.id ?? `checkpoint-${index + 1}`,
    label: checkpoint.label ?? checkpoint.id ?? `Checkpoint ${index + 1}`,
    complete: checkpoint.complete === true,
    metadata: structuredClone(checkpoint.metadata ?? {})
  }));
  return {
    id: config.id ?? "checkpoint-progress",
    checkpoints,
    activeIndex: Math.max(0, Number(config.activeIndex ?? 0)),
    complete(id) {
      const checkpoint = checkpoints.find((entry) => entry.id === id) ?? checkpoints[this.activeIndex];
      if (!checkpoint) return null;
      checkpoint.complete = true;
      while (checkpoints[this.activeIndex]?.complete && this.activeIndex < checkpoints.length - 1) {
        this.activeIndex += 1;
      }
      return this.snapshot();
    },
    snapshot() {
      return {
        id: this.id,
        activeIndex: this.activeIndex,
        activeCheckpoint: structuredClone(checkpoints[this.activeIndex] ?? null),
        checkpoints: structuredClone(checkpoints),
        complete: checkpoints.length > 0 && checkpoints.every((checkpoint) => checkpoint.complete)
      };
    }
  };
}
