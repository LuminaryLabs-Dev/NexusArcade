import { runCore } from "../core/core-harness.mjs";
import { normalizeChain } from "../contracts/chain-contract.mjs";
import { createChainMemory, injectMemory } from "./chain-memory.mjs";

export async function executeChain({
  chain: chainInput,
  runtime,
  ledger,
} = {}) {
  const chain = normalizeChain(chainInput);
  const memory = createChainMemory(chain.initial);
  const records = [];
  for (const step of chain.steps) {
    const request = injectMemory(step.request, memory.snapshot());
    request.id = request.id ?? step.id;
    request.context = { ...memory.snapshot(), ...(request.context ?? {}) };
    const record = await runCore({ request, runtime, ledger });
    records.push(record);
    if (record.status === "STOP") break;
    memory.write(step.outputKey, record.value);
    if (chain.stopOnFallback && record.status === "FALLBACK") break;
  }
  const completed =
    records.length === chain.steps.length &&
    records.every((record) => record.status !== "STOP");
  return {
    id: chain.id,
    status: completed
      ? records.some((record) => record.status === "FALLBACK")
        ? "PARTIAL"
        : "PASS"
      : "FAILED",
    context: memory.snapshot(),
    records,
    callCount: records.reduce((sum, record) => sum + record.callCount, 0),
  };
}
