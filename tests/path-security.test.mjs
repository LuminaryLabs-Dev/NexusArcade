import test from "node:test";
import assert from "node:assert/strict";
import { assertSafeRelativePath } from "../src/core/paths.mjs";
import { assertLatestUrl, buildCdnUrl, DEFAULT_LATEST_URL } from "../src/core/source-policy.mjs";

test("paths and repositories stay inside the allowlist", () => {
  assert.equal(assertSafeRelativePath("assets/game.js"), "assets/game.js");
  for (const value of ["../secret", "assets/../../secret", "/root", "assets\\game.js", "%2e%2e/secret", "a//b", "a?x=1"]) {
    assert.throws(() => assertSafeRelativePath(value), /path|traversal|segment/);
  }
  assert.equal(assertLatestUrl(DEFAULT_LATEST_URL), DEFAULT_LATEST_URL);
  assert.throws(() => assertLatestUrl("https://example.com/registry/latest.json"), /exactly/);
  assert.throws(() => buildCdnUrl({ repository: "attacker/games", ref: "a".repeat(40), basePath: "games" }, "index.html"), /not allowed/);
  assert.throws(() => buildCdnUrl({ repository: "LuminaryLabs-Dev/NexusArcade-Prototypes", ref: "main", basePath: "games" }, "index.html"), /full commit SHA/);
  assert.equal(
    buildCdnUrl({ repository: "LuminaryLabs-Publish/TheLongHaul", ref: "a".repeat(40), basePath: "." }, "index.html"),
    `https://cdn.jsdelivr.net/gh/LuminaryLabs-Publish/TheLongHaul@${"a".repeat(40)}/index.html`,
  );
});
