import test from "node:test";
import assert from "node:assert/strict";
import {
  runCore,
  runChain,
  runOrchestrator,
} from "../../generation/kernel/index.mjs";
import { object } from "../../generation/contracts/schemas.mjs";
const request = {
  task: "Choose a mode.",
  requiredFields: ["mode"],
  outputSchema: object({ mode: { type: "string", enum: ["hold", "deliver"] } }),
  maximumCalls: 3,
  fallback: null,
};
test("strict schema repairs unsupported enums, missing fields and extra properties", async () => {
  for (const invalid of [
    "{}",
    '{"mode":"invented"}',
    '{"mode":"hold","shell":"rm"}',
    '{"mode":12}',
    '{"mode":"<script>"}',
  ]) {
    let calls = 0;
    const r = await runCore({
      request,
      runtime: {
        complete: async () => (++calls === 1 ? invalid : '{"mode":"hold"}'),
      },
    });
    assert.equal(r.status, "ACCEPT");
    assert.equal(r.callCount, 2);
  }
});
test("malformed, truncated, oversized and repeated output stops within three calls", async () => {
  for (const raw of [
    "not json",
    '{"mode":',
    '{"mode":"' + "a".repeat(5000) + '"}',
  ]) {
    const r = await runCore({
      request,
      runtime: { complete: async () => raw },
    });
    assert.equal(r.status, "STOP");
    assert.equal(r.callCount, 3);
  }
});
test("fallback is explicit and itself validated", async () => {
  const a = await runCore({
    request: { ...request, fallback: { mode: "hold" } },
    runtime: { available: false },
  });
  assert.equal(a.status, "FALLBACK");
  assert.equal(a.callCount, 0);
  assert.equal(
    (
      await runCore({
        request: { ...request, fallback: { mode: "invalid" } },
        runtime: { available: false },
      })
    ).status,
    "STOP",
  );
});
test("chains preserve validated handoff, orchestrator fails closed", async () => {
  let calls = 0;
  const runtime = {
    complete: async () => {
      calls++;
      return '{"mode":"hold"}';
    },
  };
  const chain = await runChain({
    chain: {
      steps: [
        { outputKey: "first", request },
        { outputKey: "second", request },
      ],
    },
    runtime,
  });
  assert.equal(chain.status, "PASS");
  assert.equal(chain.context.second.mode, "hold");
  const tree = await runOrchestrator({
    tree: { type: "sequence", children: [{ type: "core", request }] },
    runtime,
  });
  assert.equal(tree.status, "PASS");
  assert.equal(calls, 3);
});
