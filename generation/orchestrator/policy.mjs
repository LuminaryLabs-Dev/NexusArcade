export function terminalError(error) {
  return error.code === "CANCELLED"
    ? "CANCELLED"
    : error.code === "BUDGET"
      ? "BUDGET_EXHAUSTED"
      : /model service|fetch failed|ECONN|Configured LFM/i.test(error.message)
        ? "BLOCKED"
        : "QUARANTINED";
}
export const successful = (job) => job.status === "ACCEPTED";
