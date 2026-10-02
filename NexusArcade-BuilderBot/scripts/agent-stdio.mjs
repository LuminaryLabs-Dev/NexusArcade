import readline from "node:readline";
import { resolveEnvironment } from "../src/config/environment.mjs";
import { FileStore } from "../src/storage/file-store.mjs";
import { RequestRepository } from "../src/requests/repository.mjs";
import { createAgentTools } from "../src/agent/tools.mjs";
import { notifyDiscordReady } from "../src/agent/discord-notifier.mjs";

const config = resolveEnvironment({ requireCredentials: false });
const store = new FileStore();
await store.init();
const requests = new RequestRepository(store);
const tools = createAgentTools({
  requests,
  notify: ({ request, result }) => notifyDiscordReady({ token: config.token, request, result }),
});

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of input) {
  if (!line.trim()) continue;
  let envelope;
  try {
    envelope = JSON.parse(line);
    const method = envelope?.method;
    if (!["get_request","submit_result"].includes(method)) throw Object.assign(new Error(`Unknown method: ${method}`), { code: "NAB_METHOD_NOT_FOUND" });
    const result = await tools[method](envelope.params || {});
    process.stdout.write(`${JSON.stringify({ id: envelope.id ?? null, ok: true, result })}\n`);
  } catch (error) {
    process.stdout.write(`${JSON.stringify({
      id: envelope?.id ?? null,
      ok: false,
      error: { code: error.code || "NAB_TOOL_ERROR", message: error.message },
    })}\n`);
  }
}
