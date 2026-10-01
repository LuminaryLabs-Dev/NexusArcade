const API = "https://discord.com/api/v10";

function numericId(value) {
  return /^\d{15,22}$/.test(String(value || ""));
}

async function discordGet(path, token, fetchImpl) {
  const response = await fetchImpl(`${API}${path}`, {
    headers: { Authorization: `Bot ${token}`, "User-Agent": "NexusArcade-BuilderBot/0.1" }
  });
  let body = null;
  try { body = await response.json(); } catch {}
  return { ok: response.ok, status: response.status, body };
}

export async function validateDiscordConfiguration(config, { fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== "function") throw new Error("Discord validation requires fetch support.");
  const checks = {
    token: { ok: false, message: "Not checked" },
    clientId: { ok: false, message: "Not checked" },
    guildId: { ok: false, message: "Not checked" },
    channelId: config.channelId ? { ok: false, message: "Not checked" } : { ok: true, skipped: true, message: "Skipped" }
  };

  if (!config.token) return { ok: false, checks: { ...checks, token: { ok: false, message: "Missing bot token" } } };
  if (!numericId(config.clientId)) return { ok: false, checks: { ...checks, clientId: { ok: false, message: "Client ID must be a Discord snowflake" } } };
  if (!numericId(config.guildId)) return { ok: false, checks: { ...checks, guildId: { ok: false, message: "Guild ID must be a Discord snowflake" } } };
  if (config.channelId && !numericId(config.channelId)) return { ok: false, checks: { ...checks, channelId: { ok: false, message: "Channel ID must be a Discord snowflake" } } };

  const me = await discordGet("/users/@me", config.token, fetchImpl);
  if (!me.ok) {
    checks.token = { ok: false, message: me.status === 401 ? "Bot token rejected by Discord" : `Discord returned HTTP ${me.status}` };
    return { ok: false, checks };
  }
  checks.token = { ok: true, message: `Authenticated as ${me.body?.username || "bot"}` };

  const app = await discordGet("/oauth2/applications/@me", config.token, fetchImpl);
  if (!app.ok) {
    checks.clientId = { ok: false, message: `Application lookup failed (HTTP ${app.status})` };
    return { ok: false, checks };
  }
  if (String(app.body?.id) !== String(config.clientId)) {
    checks.clientId = { ok: false, message: "Client ID does not match the authenticated bot application" };
    return { ok: false, checks };
  }
  checks.clientId = { ok: true, message: "Application ID matches bot token" };

  const guild = await discordGet(`/guilds/${config.guildId}`, config.token, fetchImpl);
  if (!guild.ok) {
    checks.guildId = { ok: false, message: guild.status === 403 || guild.status === 404 ? "Guild is not accessible to this bot" : `Guild lookup failed (HTTP ${guild.status})` };
    return { ok: false, checks };
  }
  checks.guildId = { ok: true, message: guild.body?.name ? `Accessible: ${guild.body.name}` : "Guild accessible" };

  if (config.channelId) {
    const channel = await discordGet(`/channels/${config.channelId}`, config.token, fetchImpl);
    if (!channel.ok) checks.channelId = { ok: false, message: `Channel lookup failed (HTTP ${channel.status})` };
    else if (String(channel.body?.guild_id) !== String(config.guildId)) checks.channelId = { ok: false, message: "Channel belongs to a different guild" };
    else checks.channelId = { ok: true, message: channel.body?.name ? `Accessible: #${channel.body.name}` : "Channel accessible" };
  }
  return { ok: Object.values(checks).every((check) => check.ok), checks };
}
