import { config } from "../config.mjs";
export class LocalModel {
  constructor(options = {}, budget = null) {
    this.config = config(options);
    this.budget = budget;
    this.available = true;
    this.records = [];
    this.onRecord = options.onRecord ?? (async () => {});
  }
  async health() {
    const r = await fetch(this.config.serverUrl + "/v1/models", {
      signal: AbortSignal.timeout(3000),
      redirect: "error",
    });
    if (!r.ok) throw Error("Model service unavailable");
    const data = await r.json();
    const models = data.data ?? data.models ?? [];
    if (!models.some((x) => (x.id ?? x.name ?? "").includes(this.config.model)))
      throw Error("Configured LFM model identity does not match service");
    return { ok: true, models: models.map((x) => x.id ?? x.name) };
  }
  async complete(
    prompt,
    {
      maxTokens = 160,
      system = "Return compact JSON only.",
      responseSchema,
    } = {},
  ) {
    await this.budget?.reserve();
    const started = Date.now();
    const rec = {
      prompt,
      system,
      maxTokens,
      model: this.config.model,
      temperature: 0.2,
      startedAt: new Date().toISOString(),
      responseSchema,
    };
    try {
      const r = await fetch(this.config.serverUrl + "/v1/chat/completions", {
        method: "POST",
        redirect: "error",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(
          Math.min(45000, this.budget?.remaining() ?? 45000),
        ),
        body: JSON.stringify({
          model: this.config.model,
          temperature: 0.2,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          ...(responseSchema?.type
            ? {
                response_format: {
                  type: "json_schema",
                  json_schema: {
                    name: "arcade",
                    strict: true,
                    schema: responseSchema,
                  },
                },
              }
            : {}),
        }),
      });
      if (!r.ok) throw Error(`Model HTTP ${r.status}`);
      const reader = r.body.getReader();
      let bytes = 0;
      const chunks = [];
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.length;
          if (bytes > 65536) throw Error("Oversized model response");
          chunks.push(value);
        }
      } finally {
        await reader.cancel();
      }
      const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const raw = payload.choices?.[0]?.message?.content;
      if (typeof raw !== "string" || raw.length > 32768)
        throw Error("Missing or oversized model response");
      if (payload.choices?.[0]?.finish_reason === "length")
        throw Error("Truncated model response");
      rec.raw = raw;
      rec.usage = payload.usage;
      return raw;
    } catch (e) {
      rec.error = e.message;
      throw e;
    } finally {
      rec.durationMilliseconds = Date.now() - started;
      this.records.push(rec);
      await this.onRecord(rec);
    }
  }
}
