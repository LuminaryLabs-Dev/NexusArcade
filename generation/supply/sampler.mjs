import { readFile } from "node:fs/promises";
import { createSeededRandom } from "../vendor/nexusengine/seeded-random.js";
export async function sample(seed, history = []) {
  const pools = JSON.parse(
    await readFile(new URL("./pools.json", import.meta.url)),
  );
  const rng = createSeededRandom(seed);
  const pick = (key) => {
    const recent = history.slice(-2).map((x) => x[key]);
    const unused = pools[key].filter((v) => !recent.includes(v));
    const options = key === "modes" && unused.length ? unused : pools[key];
    const weights = options.map(
      (v) => 1 / (1 + history.filter((x) => x[key] === v).length * 3),
    );
    let n = rng.next() * weights.reduce((a, b) => a + b, 0);
    return options.find((v, i) => (n -= weights[i]) <= 0) ?? options.at(-1);
  };
  return {
    seed,
    poolVersion: pools.version,
    settings: pick("settings"),
    modes: pick("modes"),
    palettes: pick("palettes"),
    materials: pick("materials"),
    pressures: pick("pressures"),
  };
}
