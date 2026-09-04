import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { FileSystemStorageAdapter } from "../src/node/filesystem-storage.mjs";
import { createLocalGameServer } from "../src/node/local-game-server.mjs";
import { installGame } from "../src/core/install-game.mjs";
import { sha256 } from "../src/core/integrity.mjs";

test("Node adapter installs atomically and serves through HTTP", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "nexus-arcade-test-"));
  const html = new TextEncoder().encode("<!doctype html><title>Fixture</title>");
  const manifest = {
    schemaVersion: 1,
    id: "NXA-000001",
    slug: "fixture",
    version: "1.0.0",
    entry: "index.html",
    offlineReady: true,
    source: { repository: "LuminaryLabs-Dev/NexusArcade-Prototypes", ref: "a".repeat(40), basePath: "prototypes/fixture" },
    files: [{ path: "index.html", bytes: html.byteLength, sha256: await sha256(html) }],
  };
  let server;
  try {
    const result = await installGame({ manifest, storage: new FileSystemStorageAdapter({ destination: root }), fetchImpl: async () => new Response(html) });
    assert.equal(await readFile(result.launchPath, "utf8"), "<!doctype html><title>Fixture</title>");
    assert.equal((await readFile(path.join(root, "games", manifest.id, "current"), "utf8")).trim(), "1.0.0");
    const running = await createLocalGameServer({ root });
    server = running.server;
    const response = await fetch(`${running.url}/games/${manifest.id}/current/index.html`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Fixture/);
    await running.close();
    server = null;
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  }
});
