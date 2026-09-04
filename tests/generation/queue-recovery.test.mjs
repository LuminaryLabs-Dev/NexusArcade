import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  json,
  atomic,
  lock,
  safeId,
} from "../../generation/orchestrator/store.mjs";
import { assertResume } from "../../generation/orchestrator/recovery.mjs";
test("atomic checkpoint and active writer exclusion", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-store-"));
  try {
    const release = await lock(root);
    await assert.rejects(lock(root), /locked/);
    await atomic(path.join(root, "state.json"), { n: 1 });
    assert.deepEqual(await json(path.join(root, "state.json")), { n: 1 });
    await release();
    const again = await lock(root);
    await again();
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("corrupt checkpoints, unsafe ids and mismatched source never silently recover", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-corrupt-"));
  try {
    await writeFile(path.join(root, "state.json"), "{bad");
    await assert.rejects(json(path.join(root, "state.json"), {}));
    for (const id of ["../escape", "a/b", "a\\b", "", null])
      assert.throws(() => safeId(id));
    assert.throws(() =>
      assertResume(
        {
          sourceFingerprint: "a",
          budget: { calls: 0, elapsedMilliseconds: 0 },
        },
        "b",
      ),
    );
    assert.throws(() =>
      assertResume({ sourceFingerprint: "a", budget: { calls: -1 } }, "a"),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
import {
  batch,
  status,
  resume,
  cancel,
} from "../../generation/orchestrator/queue.mjs";
const fake = (budget) => ({
  health: async () => ({ ok: true }),
  complete: async (prompt, { responseSchema: s }) => {
    await budget.reserve();
    const out = {};
    for (const [k, v] of Object.entries(s.properties))
      out[k] =
        v.enum?.[0] ??
        {
          title: "Ceramic Tide",
          premise: "Restore the garden.",
          objectiveLabel: "Valves",
          hazardLabel: "Patrols",
        }[k] ??
        "Play the garden.";
    return JSON.stringify(out);
  },
});
test("batch resume avoids duplicate model work; changed inputs cannot reuse id", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-batch-"));
  try {
    const input = {
      workspace: root,
      id: "resume-check",
      seed: 4,
      count: 2,
      goal: "ideas",
    };
    const a = await batch(input, { runtimeFactory: fake });
    assert.equal(a.status, "IDEAS_READY");
    assert.deepEqual(
      a.jobs.map((x) => x.budget.calls),
      [6, 6],
    );
    const b = await resume(
      { workspace: root, id: "resume-check" },
      {
        runtimeFactory: () => {
          throw Error("must not infer");
        },
      },
    );
    assert.equal(b.status, "IDEAS_READY");
    assert.equal(b.jobIds.length, 2);
    await assert.rejects(batch({ ...input, count: 3 }), /different inputs/);
    await assert.rejects(
      batch({ ...input, goal: "build" }),
      /different inputs/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("cancelled batch resumes queued work with preserved budget", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-cancel-"));
  try {
    const input = {
      workspace: root,
      id: "cancel-check",
      count: 1,
      goal: "ideas",
    };
    await cancel(root, input.id);
    const a = await batch(input, { runtimeFactory: fake });
    assert.equal(a.jobs[0].status, "CANCELLED");
    assert.equal(a.jobs[0].budget.calls, 0);
    const b = await resume(
      { workspace: root, id: input.id },
      { runtimeFactory: fake },
    );
    assert.equal(b.status, "IDEAS_READY");
    assert.equal(b.jobs[0].budget.calls, 6);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
test("partial design checkpoint resumes after stopped process without repeating accepted decisions", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-stage-"));
  try {
    let attempted = 0;
    const input = {
      workspace: root,
      id: "interrupted",
      count: 1,
      goal: "ideas",
    };
    const runtimeFactory = (b) => {
      const r = fake(b);
      return {
        ...r,
        complete: async (...args) => {
          if (++attempted === 2) {
            const e = Error("interrupt");
            e.code = "CANCELLED";
            throw e;
          }
          return r.complete(...args);
        },
      };
    };
    const a = await batch(input, { runtimeFactory });
    assert.equal(a.jobs[0].status, "CANCELLED");
    assert.equal(a.jobs[0].decisions["idea-0"].status, "ACCEPT");
    const b = await resume(
      { workspace: root, id: input.id },
      { runtimeFactory: fake },
    );
    assert.equal(b.jobs[0].budget.calls, 6);
    assert.equal(b.status, "IDEAS_READY");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
