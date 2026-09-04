import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { assertSchema, specSchema } from "../contracts/schemas.mjs";
import { fileManifest, hashManifest } from "../builders/assemble.mjs";
export async function staticValidation(root) {
  const errors = [];
  let files = [];
  try {
    assertSchema(
      JSON.parse(await readFile(path.join(root, "game.json"))),
      specSchema,
    );
    files = await fileManifest(root);
    for (const f of files) {
      if (
        !/^(index\.html|game\.(js|json)|vendor\/(three|nexusengine)\/[a-zA-Z0-9.-]+)$/.test(
          f.path,
        )
      )
        errors.push("Unexpected artifact path: " + f.path);
      if (f.path.endsWith(".js")) {
        const r = spawnSync(
          process.execPath,
          ["--check", path.join(root, f.path)],
          { timeout: 10000 },
        );
        if (r.status !== 0) errors.push("Syntax: " + f.path);
      }
    }
    if (files.reduce((n, f) => n + f.bytes, 0) > 10000000)
      errors.push("Artifact exceeds 10MB");
  } catch (e) {
    errors.push(e.message);
  }
  return {
    status: errors.length ? "FAIL" : "PASS",
    errors,
    files,
    artifactHash: hashManifest(files),
  };
}
