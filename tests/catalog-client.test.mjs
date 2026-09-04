import test from "node:test";
import assert from "node:assert/strict";
import { CatalogClient } from "../src/core/catalog-client.mjs";
import { DEFAULT_LATEST_URL } from "../src/core/source-policy.mjs";

test("catalog client follows the moving pointer once and switches to its pinned tag", async () => {
  const seen = [];
  const fetchImpl = async (url) => {
    seen.push(url);
    if (url === DEFAULT_LATEST_URL) return Response.json({ schemaVersion: 1, registryVersion: "0.1.0", ref: "registry-v0.1.0", indexPath: "registry/index.json" });
    return Response.json({ schemaVersion: 1, registryVersion: "0.1.0", games: [{ id: "NXA-000001", slug: "fixture", title: "Fixture", version: "1.0.0", status: "prototype", manifestPath: "registry/games/NXA-000001.json" }] });
  };
  const catalog = await new CatalogClient({ fetchImpl }).load();
  assert.equal(catalog.games.length, 1);
  assert.deepEqual(seen, [
    DEFAULT_LATEST_URL,
    "https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusArcade-Prototypes@registry-v0.1.0/registry/index.json",
  ]);
});

test("catalog rejects duplicate and unsorted IDs", async () => {
  const games = [
    { id: "NXA-000002", slug: "two", title: "Two", version: "1.0.0", status: "prototype", manifestPath: "registry/games/NXA-000002.json" },
    { id: "NXA-000001", slug: "one", title: "One", version: "1.0.0", status: "prototype", manifestPath: "registry/games/NXA-000001.json" },
  ];
  let calls = 0;
  const fetchImpl = async () => ++calls === 1
    ? Response.json({ schemaVersion: 1, registryVersion: "0.1.0", ref: "registry-v0.1.0", indexPath: "registry/index.json" })
    : Response.json({ schemaVersion: 1, registryVersion: "0.1.0", games });
  await assert.rejects(() => new CatalogClient({ fetchImpl }).load(), /sorted by ID/);
});

test("a pinned registry bypasses the moving pointer for rollback", async () => {
  const seen = [];
  const client = new CatalogClient({
    registryRef: "registry-v0.1.0",
    registryVersion: "0.1.0",
    fetchImpl: async (url) => {
      seen.push(url);
      return Response.json({ schemaVersion: 1, registryVersion: "0.1.0", games: [] });
    },
  });
  await client.load();
  assert.deepEqual(seen, ["https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusArcade-Prototypes@registry-v0.1.0/registry/index.json"]);
});

test("an exact registry commit SHA is accepted as an immutable ref", async () => {
  const ref = "b".repeat(40);
  const client = new CatalogClient({ registryRef: ref, registryVersion: "0.1.0", fetchImpl: async () => Response.json({ schemaVersion: 1, registryVersion: "0.1.0", games: [] }) });
  await client.load();
  assert.equal(client.latest.ref, ref);
});
