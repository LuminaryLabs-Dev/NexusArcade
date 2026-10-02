import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { FileStore } from "../src/storage/file-store.mjs";
import { RequestRepository } from "../src/requests/repository.mjs";
import { createAgentTools } from "../src/agent/tools.mjs";

async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "nab-agent-"));
  const store = new FileStore(root);
  await store.init();
  const requests = new RequestRepository(store);
  await store.writeJson("requests/NAB-000123.json", {
    id: "NAB-000123",
    type: "NEW_GAME",
    collaborative: false,
    gameId: null,
    profile: { identity: { title: "Neon Salvage", gameId: null } },
    source: { platform: "discord", ownerUserId: "123", participantIds: [] },
    status: "OPEN",
    createdAt: "2026-10-02T00:00:00.000Z",
  });
  return { root, requests };
}

test("agent tools expose only ticket read and validated result submission", async () => {
  const { root, requests } = await fixture();
  const notifications = [];
  const tools = createAgentTools({ requests, notify: async (payload) => { notifications.push(payload); return { state: "SENT", recipients: ["123"] }; } });
  const request = await tools.get_request({ requestId: "NAB-000123" });
  assert.equal(request.status, "OPEN");
  const result = {
    gameId: "NXA-000013",
    slug: "neon-salvage",
    version: "1.0.0",
    buildCommit: "a".repeat(40),
    publicUrl: "https://luminarylabs.dev/arcade/neon-salvage/",
    gates: { source:"PASS",build:"PASS",install:"PASS",registry:"PASS",tests:"PASS",browser:"PASS",publicUrl:"PASS" },
    evidence: ["npm test", "browser smoke"],
  };
  const completed = await tools.submit_result({ requestId: "NAB-000123", result });
  assert.equal(completed.request.status, "READY");
  assert.equal(completed.request.gameId, "NXA-000013");
  assert.equal(completed.delivery.state, "SENT");
  assert.equal(notifications.length, 1);
  await fs.rm(root, { recursive: true, force: true });
});

test("agent tools reject completion without a full harness pass", async () => {
  const { root, requests } = await fixture();
  const tools = createAgentTools({ requests });
  await assert.rejects(() => tools.submit_result({
    requestId: "NAB-000123",
    result: {
      gameId:"NXA-000013", slug:"neon-salvage", version:"1.0.0",
      buildCommit:"a".repeat(40), publicUrl:"https://luminarylabs.dev/arcade/neon-salvage/",
      gates:{source:"PASS",build:"PASS",install:"PASS",registry:"PASS",tests:"PASS",browser:"FAIL",publicUrl:"PASS"},
    },
  }), /browser/);
  await fs.rm(root, { recursive: true, force: true });
});
