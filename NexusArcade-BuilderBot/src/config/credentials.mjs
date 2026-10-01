import fs from "node:fs/promises";
import path from "node:path";
import { ENV_KEYS, parseDotEnv } from "./environment.mjs";

function escapeValue(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
}

export function serializeEnvironment(config, existing = {}) {
  const merged = { ...existing };
  const managed = {
    DISCORD_TOKEN: config.token,
    DISCORD_CLIENT_ID: config.clientId,
    DISCORD_GUILD_ID: config.guildId,
    NEXUS_ARCADE_BUILDER_CHANNEL_ID: config.channelId || "",
    NEXUS_ARCADE_DEBUG: String(config.debug !== false),
    NEXUS_ARCADE_SESSION_TTL_HOURS: String(config.sessionTtlHours || 24)
  };
  for (const [key, value] of Object.entries(managed)) merged[key] = value;
  const unmanaged = Object.keys(merged).filter((key) => !ENV_KEYS.includes(key)).sort();
  const managedKeys = ENV_KEYS.filter((key) => key in merged);
  return [...managedKeys, ...unmanaged].map((key) => `${key}="${escapeValue(merged[key])}"`).join("\n") + "\n";
}

export async function writeEnvironmentFile(file, config, { replace = false, preserveExisting = false } = {}) {
  let existingRaw = "";
  try {
    existingRaw = await fs.readFile(file, "utf8");
    if (!replace) {
      const error = new Error(".env already exists");
      error.code = "NAB_ENV_EXISTS";
      throw error;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const existing = preserveExisting ? parseDotEnv(existingRaw) : {};
  const target = path.resolve(file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temp, serializeEnvironment(config, existing), { encoding: "utf8", mode: 0o600 });
  await fs.rename(temp, target);
  try { await fs.chmod(target, 0o600); } catch {}
  return target;
}
