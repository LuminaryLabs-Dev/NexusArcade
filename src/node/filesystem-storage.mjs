import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertGameId, assertSafeRelativePath, assertVersion } from "../core/paths.mjs";

async function exists(file) {
  try { await stat(file); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
}

export class FileSystemStorageAdapter {
  constructor({ destination }) {
    if (!destination) throw new TypeError("A destination directory is required");
    this.root = path.resolve(destination);
    this.stage = null;
  }

  async begin(manifest) {
    assertGameId(manifest.id);
    assertVersion(manifest.version);
    await mkdir(path.join(this.root, "downloads"), { recursive: true });
    await mkdir(path.join(this.root, "games", manifest.id), { recursive: true });
    await mkdir(path.join(this.root, "registry"), { recursive: true });
    this.stage = path.join(this.root, "downloads", `${manifest.id}-${manifest.version}-${Date.now()}-${process.pid}.part`);
    await mkdir(this.stage, { recursive: false });
  }

  async write(_manifest, file, bytes) {
    assertSafeRelativePath(file.path);
    const target = path.resolve(this.stage, file.path);
    if (!target.startsWith(`${this.stage}${path.sep}`)) throw new Error(`Install path escaped staging directory: ${file.path}`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes, { flag: "wx" });
  }

  async commit(manifest) {
    const gameRoot = path.join(this.root, "games", manifest.id);
    const finalPath = path.join(gameRoot, manifest.version);
    const backupPath = path.join(gameRoot, `.${manifest.version}.previous-${Date.now()}`);
    const hadExisting = await exists(finalPath);
    if (hadExisting) await rename(finalPath, backupPath);
    try {
      await rename(this.stage, finalPath);
    } catch (error) {
      if (hadExisting) await rename(backupPath, finalPath);
      throw error;
    }
    this.stage = null;
    await writeFile(path.join(gameRoot, "current"), `${manifest.version}\n`);
    const installedPath = path.join(this.root, "registry", "installed.json");
    const installed = await readJson(installedPath, { schemaVersion: 1, games: {} });
    installed.games[manifest.id] = { version: manifest.version, entry: manifest.entry, installedAt: new Date().toISOString() };
    const temporary = `${installedPath}.${process.pid}.tmp`;
    await writeFile(temporary, `${JSON.stringify(installed, null, 2)}\n`);
    await rename(temporary, installedPath);
    if (hadExisting) await rm(backupPath, { recursive: true, force: true });
    return { directory: finalPath, launchPath: path.join(finalPath, manifest.entry) };
  }

  async abort() {
    if (this.stage) await rm(this.stage, { recursive: true, force: true });
    this.stage = null;
  }
}
