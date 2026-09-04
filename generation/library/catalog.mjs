import path from "node:path";
import { json, atomic } from "../orchestrator/store.mjs";
export const catalog = (root) =>
  json(path.join(root, "catalog.json"), { schemaVersion: 1, games: [] });
export async function register(root, entry) {
  const c = await catalog(root);
  const old = c.games.find((x) => x.id === entry.id);
  if (old && old.artifactHash !== entry.artifactHash)
    throw Error("Immutable game id conflict");
  if (!old) c.games.push(entry);
  await atomic(path.join(root, "catalog.json"), c);
  return c;
}
