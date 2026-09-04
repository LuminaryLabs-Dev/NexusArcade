export class CallLedger {
  constructor(runId = "run") {
    this.runId = runId;
    this.entries = [];
  }

  start(label) {
    const entry = {
      number: this.entries.length + 1,
      label,
      startedAt: new Date().toISOString(),
      status: "STARTED",
    };
    this.entries.push(entry);
    return entry;
  }

  finish(entry, status, detail = {}) {
    Object.assign(entry, detail, {
      status,
      completedAt: new Date().toISOString(),
    });
    return entry;
  }

  snapshot() {
    return {
      runId: this.runId,
      callCount: this.entries.length,
      entries: structuredClone(this.entries),
    };
  }
}
