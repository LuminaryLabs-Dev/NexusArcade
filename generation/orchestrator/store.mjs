import {
  mkdir,
  readFile,
  writeFile,
  rename,
  open,
  rm,
  lstat,
} from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
export function safeId(id) {
  if (typeof id !== "string" || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(id))
    throw Error("Unsafe id");
  return id;
}
export async function json(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT" && fallback !== undefined)
      return structuredClone(fallback);
    throw e;
  }
}
export async function atomic(file, value) {
  await rejectSymlink(path.dirname(file));
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = file + "." + randomUUID() + ".tmp";
  try {
    await writeFile(tmp, JSON.stringify(value, null, 2) + "\n");
    await rename(tmp, file);
  } finally {
    await rm(tmp, { force: true });
  }
}
export async function lock(root) {
  await mkdir(root, { recursive: true });
  const filename = path.join(root, "writer.lock");
  for (let i = 0; i < 2; i++)
    try {
      const h = await open(filename, "wx");
      const token = randomUUID();
      await h.writeFile(JSON.stringify({ pid: process.pid, token }));
      await h.close();
      return async () => {
        const r = await json(filename, {});
        if (r.token === token) await rm(filename, { force: true });
      };
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      const recoveryFile = filename + ".recovery";
      let recovery;
      try {
        recovery = await open(recoveryFile, "wx");
      } catch {
        throw Error(
          "Lock recovery already in progress; inspect stale recovery file if needed",
        );
      }
      try {
        const owner = await json(filename);
        if (!Number.isSafeInteger(owner.pid) || owner.pid < 1)
          throw Error("Corrupt lock owner");
        let alive = true;
        try {
          process.kill(owner.pid, 0);
        } catch (e) {
          if (e.code === "ESRCH") alive = false;
          else throw e;
        }
        if (alive) throw Error("Workspace is locked by a live runner");
        await rm(filename);
      } finally {
        await recovery.close();
        await rm(recoveryFile, { force: true });
      }
    }
  throw Error("Cannot acquire workspace lock");
}
export async function rejectSymlink(root) {
  let p = path.resolve(root);
  while (true) {
    try {
      if ((await lstat(p)).isSymbolicLink())
        throw Error("Workspace symlink rejected");
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    const parent = path.dirname(p);
    if (parent === p) break;
    p = parent;
  }
}
