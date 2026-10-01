import fs from "node:fs";
import path from "node:path";

export const ENV_KEYS = Object.freeze([
  "DISCORD_TOKEN",
  "DISCORD_CLIENT_ID",
  "DISCORD_GUILD_ID",
  "NEXUS_ARCADE_BUILDER_CHANNEL_ID",
  "NEXUS_ARCADE_DEBUG",
  "NEXUS_ARCADE_SESSION_TTL_HOURS"
]);

export function parseDotEnv(raw) {
  const values = {};
  for (const line of String(raw || "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values[key] = value;
  }
  return values;
}

export function readDotEnv(file = path.resolve(".env")) {
  if (!fs.existsSync(file)) return {};
  return parseDotEnv(fs.readFileSync(file, "utf8"));
}

export function applyEnvironment(values, { overwrite = false } = {}) {
  for (const [key, value] of Object.entries(values || {})) {
    if (value === undefined || value === null) continue;
    if (overwrite || process.env[key] === undefined) process.env[key] = String(value);
  }
}

export function resolveEnvironment({ file = path.resolve(".env"), requireCredentials = true } = {}) {
  applyEnvironment(readDotEnv(file));
  const required = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "DISCORD_GUILD_ID"];
  const missing = required.filter((key) => !process.env[key]);
  if (requireCredentials && missing.length) {
    const error = new Error(`Missing required environment values: ${missing.join(", ")}`);
    error.code = "NAB_CONFIG_MISSING";
    error.missing = missing;
    throw error;
  }
  return {
    token: process.env.DISCORD_TOKEN || null,
    clientId: process.env.DISCORD_CLIENT_ID || null,
    guildId: process.env.DISCORD_GUILD_ID || null,
    channelId: process.env.NEXUS_ARCADE_BUILDER_CHANNEL_ID || null,
    debug: process.env.NEXUS_ARCADE_DEBUG !== "false",
    sessionTtlHours: Math.max(1, Number(process.env.NEXUS_ARCADE_SESSION_TTL_HOURS || 24)),
    missing
  };
}

export function loadEnvironment(options) {
  return resolveEnvironment(options);
}
