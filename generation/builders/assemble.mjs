import {
  mkdir,
  copyFile,
  readFile,
  writeFile,
  readdir,
  lstat,
} from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { assertSchema, specSchema } from "../contracts/schemas.mjs";
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
export async function fileManifest(root, relative = "") {
  const files = [];
  for (const e of (
    await readdir(path.join(root, relative), { withFileTypes: true })
  ).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = relative ? relative + "/" + e.name : e.name;
    if (e.isSymbolicLink()) throw Error("Artifact symlink");
    if (e.isDirectory()) files.push(...(await fileManifest(root, name)));
    else if (e.isFile()) {
      const b = await readFile(path.join(root, name));
      files.push({
        path: name,
        bytes: b.length,
        sha256: createHash("sha256").update(b).digest("hex"),
      });
    }
  }
  return files;
}
export const hashManifest = (files) =>
  createHash("sha256").update(JSON.stringify(files)).digest("hex");
export async function assemble(spec, root) {
  assertSchema(spec, specSchema);
  await mkdir(path.join(root, "vendor/three"), { recursive: true });
  await mkdir(path.join(root, "vendor/nexusengine"), { recursive: true });
  await copyFile(
    path.join(here, "game-family/index.html"),
    path.join(root, "index.html"),
  );
  await copyFile(
    path.join(here, "game-family/game.mjs"),
    path.join(root, "game.js"),
  );
  await writeFile(path.join(root, "game.json"), JSON.stringify(spec, null, 2));
  const threeRoot = path.dirname(path.dirname(require.resolve("three")));
  const lock = JSON.parse(
    await readFile(path.join(here, "dependencies.lock.json")),
  );
  for (const f of lock.three.files) {
    const b = await readFile(path.join(threeRoot, "build", f.path));
    if (createHash("sha256").update(b).digest("hex") !== f.sha256)
      throw Error("Three dependency hash mismatch");
  }
  for (const f of lock.nexusengine.files) {
    const b = await readFile(path.join(here, "../vendor/nexusengine", f.file));
    if (createHash("sha256").update(b).digest("hex") !== f.sha256)
      throw Error("NexusEngine dependency hash mismatch");
  }
  for (const f of ["three.module.js", "three.core.js"])
    await copyFile(
      path.join(threeRoot, "build", f),
      path.join(root, "vendor/three", f),
    );
  await copyFile(
    path.join(threeRoot, "LICENSE"),
    path.join(root, "vendor/three/LICENSE"),
  );
  for (const f of [
    "seeded-random.js",
    "resources.js",
    "pressure.js",
    "LICENSE",
  ])
    await copyFile(
      path.join(here, "../vendor/nexusengine", f),
      path.join(root, "vendor/nexusengine", f),
    );
  return { files: await fileManifest(root), root };
}
