const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function normalizeRequest(input = {}) {
  if (!isRecord(input)) throw new TypeError("request must be an object");
  const task = String(input.task ?? "").trim();
  if (!task) throw new Error("request.task is required");
  if (task.length > 12000)
    throw new Error("request.task exceeds 12000 characters");
  const maximumCalls = Number(input.maximumCalls ?? 2);
  if (!Number.isInteger(maximumCalls) || maximumCalls < 1 || maximumCalls > 3) {
    throw new Error("request.maximumCalls must be an integer from 1 to 3");
  }
  const maximumTokens = Number(input.maximumTokens ?? 180);
  if (
    !Number.isInteger(maximumTokens) ||
    maximumTokens < 16 ||
    maximumTokens > 2048
  ) {
    throw new Error("request.maximumTokens must be an integer from 16 to 2048");
  }
  const requiredFields = [
    ...new Set((input.requiredFields ?? []).map(String).filter(Boolean)),
  ];
  return {
    id: String(input.id ?? "core-request"),
    task,
    context: isRecord(input.context) ? structuredClone(input.context) : {},
    outputSchema: isRecord(input.outputSchema)
      ? structuredClone(input.outputSchema)
      : {},
    requiredFields,
    maximumCalls,
    maximumTokens,
    allowCode: input.allowCode === true,
    allowMarkup: input.allowMarkup === true,
    fallback:
      input.fallback === undefined ? null : structuredClone(input.fallback),
  };
}

export function assertRequest(value) {
  return normalizeRequest(value);
}
