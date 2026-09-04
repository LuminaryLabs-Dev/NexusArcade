import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { LocalModel } from "../../generation/runtime/local-model.mjs";
import { Budget } from "../../generation/runtime/budget.mjs";
async function server(fn) {
  const s = createServer(fn);
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  return {
    url: `http://127.0.0.1:${s.address().port}`,
    close: () => new Promise((r) => s.close(r)),
  };
}
test("actual HTTP adapter verifies identity, captures response metadata and rejects truncation", async () => {
  let truncated = false;
  const s = await server((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        req.url === "/v1/models"
          ? { data: [{ id: "LFM2.5-350M-heretic-high-reasoning.Q8_0.gguf" }] }
          : {
              choices: [
                {
                  finish_reason: truncated ? "length" : "stop",
                  message: { content: '{"index":1}' },
                },
              ],
              usage: { total_tokens: 10 },
            },
      ),
    );
  });
  try {
    const r = new LocalModel({ serverUrl: s.url }, new Budget());
    await r.health();
    assert.equal(await r.complete("choose"), '{"index":1}');
    assert.equal(r.records[0].usage.total_tokens, 10);
    truncated = true;
    await assert.rejects(r.complete("choose"), /Truncated/);
  } finally {
    await s.close();
  }
});
test("HTTP adapter rejects oversized service responses and identity mismatch", async () => {
  const s = await server((req, res) =>
    res.end(
      req.url === "/v1/models"
        ? JSON.stringify({ data: [{ id: "wrong-model" }] })
        : "x".repeat(70000),
    ),
  );
  try {
    const r = new LocalModel({ serverUrl: s.url });
    await assert.rejects(r.health(), /identity/);
    await assert.rejects(r.complete("choose"), /Oversized/);
  } finally {
    await s.close();
  }
});
