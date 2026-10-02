import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { normalizeHarnessCompletion, publicArcadeUrl } from "./ticket-contract.mjs";

async function json(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function fileExists(file) {
  try { return (await stat(file)).isFile(); }
  catch { return false; }
}

export async function verifyTicketGame({
  execution,
  gamesRoot,
  buildCommit,
  testsPassed,
  browserPassed,
  evidence = [],
} = {}) {
  if (!execution?.target?.slug) throw new TypeError("execution contract is required");
  if (typeof gamesRoot !== "string" || !gamesRoot) throw new TypeError("gamesRoot is required");
  if (testsPassed !== true) throw new Error("NexusArcade-Games test gate has not passed");
  if (browserPassed !== true) throw new Error("NexusArcade-Games browser gate has not passed");

  const slug = execution.target.slug;
  const gameRoot = path.join(gamesRoot, "games", slug);
  const metadataPath = path.join(gameRoot, "install", "game.json");
  const manifestPath = path.join(gameRoot, "install", "manifest.json");
  if (!(await fileExists(metadataPath))) throw new Error(`${slug}: install/game.json is missing`);
  if (!(await fileExists(manifestPath))) throw new Error(`${slug}: install/manifest.json is missing`);

  const metadata = await json(metadataPath);
  const manifest = await json(manifestPath);
  const registryManifest = await json(path.join(gamesRoot, "registry", "games", `${manifest.id}.json`));
  const registry = await json(path.join(gamesRoot, "registry", "index.json"));

  if (metadata.id !== manifest.id || metadata.slug !== slug || metadata.version !== manifest.version) throw new Error(`${slug}: metadata and install manifest disagree`);
  if (JSON.stringify(registryManifest) !== JSON.stringify(manifest)) throw new Error(`${slug}: local and registry manifests disagree`);
  const catalogEntry = registry.games?.find((game) => game.id === manifest.id);
  if (!catalogEntry || catalogEntry.slug !== slug || catalogEntry.version !== manifest.version) throw new Error(`${slug}: registry index does not expose the install manifest`);
  if (execution.target.gameId && manifest.id !== execution.target.gameId) throw new Error(`${slug}: manifest gameId does not match ticket target`);

  if (manifest.source?.repository !== "LuminaryLabs-Dev/NexusArcade-Games") throw new Error(`${slug}: ticket delivery must be installed from NexusArcade-Games`);
  if (manifest.source.ref !== buildCommit) throw new Error(`${slug}: manifest ref must equal the immutable build commit`);
  if (manifest.source.basePath !== `games/${slug}/build`) throw new Error(`${slug}: manifest basePath must target build/`);
  if (!Array.isArray(manifest.files) || !manifest.files.some((file) => file.path === manifest.entry)) throw new Error(`${slug}: entry file is not installable`);

  for (const file of manifest.files) {
    const target = path.join(gameRoot, "build", ...String(file.path).split("/"));
    const bytes = await readFile(target);
    if (bytes.byteLength !== file.bytes) throw new Error(`${slug}/${file.path}: byte length mismatch`);
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== file.sha256) throw new Error(`${slug}/${file.path}: SHA-256 mismatch`);
  }

  return normalizeHarnessCompletion(execution, {
    gameId: manifest.id,
    slug,
    version: manifest.version,
    buildCommit,
    publicUrl: publicArcadeUrl(slug),
    gates: {
      source: "PASS",
      build: "PASS",
      install: "PASS",
      registry: "PASS",
      tests: "PASS",
      browser: "PASS",
      publicUrl: "PASS",
    },
    evidence,
  });
}
