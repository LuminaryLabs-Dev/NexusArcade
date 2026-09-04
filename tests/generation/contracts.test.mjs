import test from "node:test";
import assert from "node:assert/strict";
import { validate, object, text } from "../../generation/contracts/schemas.mjs";
import { config } from "../../generation/config.mjs";
test("strict schema rejects unsafe keys, nonfinite values, long text and unknown keys", () => {
  const schema = object({
    n: { type: "integer", minimum: 1, maximum: 4 },
    s: text(8),
  });
  for (const x of [
    { n: NaN, s: "x" },
    { n: 5, s: "x" },
    { n: 1, s: "x".repeat(9) },
    { n: 1, s: "x", bad: 1 },
    JSON.parse('{"n":1,"s":"x","__proto__":{}}'),
  ])
    assert(validate(x, schema).length);
  assert.equal(validate({ n: 2, s: "hello" }, schema).length, 0);
});
test("model endpoints and global configuration are bounded", () => {
  for (const serverUrl of [
    "https://example.com",
    "http://user:pass@localhost",
    "http://127.0.0.1/?key=secret",
  ])
    assert.throws(() => config({ serverUrl }));
  for (const count of [0, 21, 1.5]) assert.throws(() => config({ count }));
  assert.equal(config().count, 3);
});
