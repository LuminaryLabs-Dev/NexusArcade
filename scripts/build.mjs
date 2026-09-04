import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
await mkdir(path.join(root, "dist", "schemas"), { recursive: true });
for (const name of ["registry-latest.schema.json", "registry-index.schema.json", "game-install.schema.json"]) {
  await cp(path.join(root, "schemas", name), path.join(root, "dist", "schemas", name));
}
console.log("built browser, node and schema exports");
