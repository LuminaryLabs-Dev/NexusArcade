import path from "node:path";
export function config(input = {}) {
  const value = {
    workspace: path.resolve(input.workspace ?? ".arcade-generation"),
    serverUrl:
      input.serverUrl ?? process.env.LFM_SERVER_URL ?? "http://127.0.0.1:18081",
    model: input.model ?? "LFM2.5-350M-heretic-high-reasoning.Q8_0.gguf",
    count: input.count ?? 3,
    maxCalls: input.maxCalls ?? 60,
    maxMilliseconds: input.maxMilliseconds ?? 1200000,
    maxRepairs: input.maxRepairs ?? 2,
    seed: input.seed ?? 73019,
    record: input.record !== false,
  };
  for (const [k, min, max] of [
    ["count", 1, 20],
    ["maxCalls", 1, 200],
    ["maxMilliseconds", 1000, 3600000],
    ["maxRepairs", 0, 2],
  ])
    if (!Number.isSafeInteger(value[k]) || value[k] < min || value[k] > max)
      throw Error(`Invalid ${k}`);
  if (!Number.isSafeInteger(value.seed)) throw Error("Invalid seed");
  const u = new URL(value.serverUrl);
  if (
    u.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(u.hostname) ||
    u.username ||
    u.password ||
    u.search ||
    u.hash
  )
    throw Error("Model endpoint must be credential-free localhost HTTP");
  return value;
}
