import path from "node:path";
import { json, atomic } from "../orchestrator/store.mjs";
export const history = (root) =>
  json(path.join(root, "supply-history.json"), []);
export async function recordSupply(root, supply) {
  const items = await history(root);
  if (!items.some((x) => x.seed === supply.seed)) items.push(supply);
  await atomic(path.join(root, "supply-history.json"), items.slice(-1000));
}
