import test from "node:test";
import assert from "node:assert/strict";
import { validateDiscordConfiguration } from "../src/config/validation.mjs";

function jsonResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, async json() { return body; } };
}

const config = {
  token: "secret",
  clientId: "123456789012345678",
  guildId: "223456789012345678",
  channelId: "323456789012345678"
};

test("Discord validation accepts matching bot, guild, and channel", async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith("/users/@me")) return jsonResponse(200, { id: config.clientId, username: "NexusArcade" });
    if (url.endsWith("/oauth2/applications/@me")) return jsonResponse(200, { id: config.clientId });
    if (url.endsWith(`/guilds/${config.guildId}`)) return jsonResponse(200, { id: config.guildId, name: "Arcade" });
    if (url.endsWith(`/channels/${config.channelId}`)) return jsonResponse(200, { id: config.channelId, guild_id: config.guildId, name: "builder" });
    throw new Error(`Unexpected URL: ${url}`);
  };
  const result = await validateDiscordConfiguration(config, { fetchImpl });
  assert.equal(result.ok, true);
  assert.equal(result.checks.token.ok, true);
  assert.equal(result.checks.guildId.ok, true);
});

test("Discord validation rejects bad token without exposing it", async () => {
  const result = await validateDiscordConfiguration(config, {
    fetchImpl: async () => jsonResponse(401, { message: "401: Unauthorized" })
  });
  assert.equal(result.ok, false);
  assert.equal(result.checks.token.ok, false);
  assert.doesNotMatch(result.checks.token.message, /secret/);
});

test("Discord validation rejects non-snowflake IDs before network calls", async () => {
  let called = false;
  const result = await validateDiscordConfiguration({ ...config, guildId: "bad" }, {
    fetchImpl: async () => { called = true; return jsonResponse(200, {}); }
  });
  assert.equal(result.ok, false);
  assert.equal(called, false);
  assert.match(result.checks.guildId.message, /snowflake/);
});

test("Discord validation rejects a channel from another guild", async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith("/users/@me")) return jsonResponse(200, { id: config.clientId, username: "NexusArcade" });
    if (url.endsWith("/oauth2/applications/@me")) return jsonResponse(200, { id: config.clientId });
    if (url.endsWith(`/guilds/${config.guildId}`)) return jsonResponse(200, { id: config.guildId, name: "Arcade" });
    if (url.endsWith(`/channels/${config.channelId}`)) return jsonResponse(200, { id: config.channelId, guild_id: "999999999999999999" });
  };
  const result = await validateDiscordConfiguration(config, { fetchImpl });
  assert.equal(result.ok, false);
  assert.match(result.checks.channelId.message, /different guild/);
});
