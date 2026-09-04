export class Budget {
  constructor({
    maxCalls = 60,
    maxMilliseconds = 1200000,
    calls = 0,
    deadlineAt = Date.now() + maxMilliseconds,
    elapsedMilliseconds = 0,
    onChange = async () => {},
    cancelled = async () => false,
  } = {}) {
    Object.assign(this, {
      deadlineAt,
      maxCalls,
      maxMilliseconds,
      calls,
      elapsedMilliseconds,
      onChange,
      cancelled,
    });
    this.start = Date.now();
  }
  snapshot() {
    return {
      calls: this.calls,
      elapsedMilliseconds: this.elapsedMilliseconds + Date.now() - this.start,
    };
  }
  async check() {
    if (await this.cancelled()) {
      const e = Error("Run cancelled");
      e.code = "CANCELLED";
      throw e;
    }
    if (
      Date.now() >= this.deadlineAt ||
      this.calls >= this.maxCalls ||
      this.snapshot().elapsedMilliseconds >= this.maxMilliseconds
    ) {
      const e = Error("Global budget exhausted");
      e.code = "BUDGET";
      throw e;
    }
  }
  async reserve() {
    await this.check();
    this.calls++;
    await this.onChange(this.snapshot());
  }
  remaining() {
    return Math.max(
      1,
      Math.min(
        this.deadlineAt - Date.now(),
        this.maxMilliseconds - this.snapshot().elapsedMilliseconds,
      ),
    );
  }
}
