export class OpenAiCompatibleRuntime {
  constructor({
    serverUrl,
    model = "local-lfm",
    timeoutMilliseconds = 45000,
    temperature = 0.2,
  } = {}) {
    this.serverUrl = String(serverUrl ?? "").replace(/\/$/, "");
    this.model = model;
    this.timeoutMilliseconds = timeoutMilliseconds;
    this.temperature = temperature;
    this.available = Boolean(this.serverUrl);
  }

  async health() {
    for (const suffix of ["/health", "/v1/models"]) {
      try {
        const response = await fetch(`${this.serverUrl}${suffix}`, {
          signal: AbortSignal.timeout(2000),
        });
        if (response.ok)
          return { ok: true, status: response.status, endpoint: suffix };
      } catch {}
    }
    return { ok: false };
  }

  async complete(
    prompt,
    {
      maxTokens = 180,
      system = "Return only valid JSON.",
      temperature = this.temperature,
      returnMetadata = false,
    } = {},
  ) {
    const response = await fetch(`${this.serverUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(this.timeoutMilliseconds),
      body: JSON.stringify({
        model: this.model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
    });
    const raw = await response.text();
    if (!response.ok)
      throw new Error(`LFM HTTP ${response.status}: ${raw.slice(0, 300)}`);
    const payload = JSON.parse(raw);
    const content = String(
      payload?.choices?.[0]?.message?.content ?? "",
    ).trim();
    if (!content) throw new Error("LFM response has no message content");
    return returnMetadata
      ? {
          content,
          usage: payload?.usage ?? null,
          model: payload?.model ?? this.model,
        }
      : content;
  }
}
