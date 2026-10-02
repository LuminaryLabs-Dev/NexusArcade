const API = "https://discord.com/api/v10";

async function discordJson(url, { token, fetchImpl, method = "GET", body } = {}) {
  const response = await fetchImpl(url, {
    method,
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  let payload = {};
  try { payload = await response.json(); } catch {}
  if (!response.ok) throw new Error(`Discord HTTP ${response.status}: ${payload.message || "request failed"}`);
  return payload;
}

export async function notifyDiscordReady({ token, request, result, fetchImpl = globalThis.fetch } = {}) {
  if (!token) return { state: "SKIPPED", reason: "DISCORD_TOKEN is not configured", recipients: [] };
  if (typeof fetchImpl !== "function") throw new TypeError("fetch implementation is required");
  const ids = new Set([request?.source?.ownerUserId, ...(request?.source?.participantIds || [])].filter(Boolean));
  const recipients = [];
  const failures = [];
  for (const userId of ids) {
    try {
      const channel = await discordJson(`${API}/users/@me/channels`, {
        token, fetchImpl, method: "POST", body: { recipient_id: userId },
      });
      await discordJson(`${API}/channels/${channel.id}/messages`, {
        token,
        fetchImpl,
        method: "POST",
        body: {
          content: `🎮 **${result.slug} is ready.**\nRequest: ${request.id}\n${result.publicUrl}\nUse **/update-game** if you want something changed.`,
          components: [{
            type: 1,
            components: [{ type: 2, style: 5, label: "Play Game", url: result.publicUrl }],
          }],
        },
      });
      recipients.push(userId);
    } catch (error) {
      failures.push({ userId, message: error.message });
    }
  }
  return {
    state: failures.length ? (recipients.length ? "PARTIAL" : "FAILED") : "SENT",
    recipients,
    failures,
  };
}
