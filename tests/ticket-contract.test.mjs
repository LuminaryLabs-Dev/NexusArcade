import test from "node:test";
import assert from "node:assert/strict";
import { createTicketExecution, normalizeHarnessCompletion, publicArcadeUrl } from "../NexusArcade-Harness/ticket-contract.mjs";

const request = {
  id: "NAB-000123",
  type: "NEW_GAME",
  gameId: null,
  profile: { identity: { title: "Neon Salvage", gameId: null } },
};

test("ticket contract maps one NAB request to NexusArcade-Games", () => {
  const execution = createTicketExecution(request, { slug: "neon-salvage", gameId: "NXA-000013" });
  assert.equal(execution.target.source, "games/neon-salvage/source");
  assert.equal(execution.target.build, "games/neon-salvage/build");
  assert.equal(execution.target.install, "games/neon-salvage/install");
  assert.equal(execution.target.publicUrl, "https://luminarylabs.dev/arcade/neon-salvage/");
  assert.equal(execution.readyForImplementation, true);
});

test("completion refuses skipped harness gates", () => {
  const execution = createTicketExecution(request, { slug: "neon-salvage", gameId: "NXA-000013" });
  assert.throws(() => normalizeHarnessCompletion(execution, {
    gameId: "NXA-000013",
    slug: "neon-salvage",
    version: "1.0.0",
    buildCommit: "a".repeat(40),
    publicUrl: publicArcadeUrl("neon-salvage"),
    gates: { source:"PASS",build:"PASS",install:"PASS",registry:"PASS",tests:"PASS",browser:"FAIL",publicUrl:"PASS" },
  }), /browser/);
});
