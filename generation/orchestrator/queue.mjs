import { fileManifest, hashManifest } from "../builders/assemble.mjs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { config as normalize } from "../config.mjs";
import { safeId, json, atomic, lock, rejectSymlink } from "./store.mjs";
import { sample } from "../supply/sampler.mjs";
import { history, recordSupply } from "../supply/history.mjs";
import { distinct } from "../supply/diversity.mjs";
import { sourceFingerprint } from "./recovery.mjs";
import { runJob } from "./run.mjs";
export async function batch(input = {}, options = {}) {
  const config = normalize(input);
  const id = safeId(input.id ?? `batch-${config.seed}`);
  await rejectSymlink(config.workspace);
  const release = await lock(config.workspace);
  try {
    if (options.clearCancellation)
      await rm(path.join(config.workspace, "cancel", id + ".json"), {
        force: true,
      });
    const file = path.join(config.workspace, "batches", id + ".json");
    let b = await json(file, null);
    const fingerprint = await sourceFingerprint();
    if (b) {
      if (
        b.config.seed !== config.seed ||
        b.config.count !== config.count ||
        b.goal !== (input.goal ?? "build")
      )
        throw Error("Batch id already belongs to different inputs");
      if (b.sourceFingerprint !== fingerprint)
        throw Error("Generation source changed; use a new batch id");
    } else {
      b = {
        id,
        goal: input.goal ?? "build",
        sourceFingerprint: fingerprint,
        config,
        jobIds: [],
        status: "RUNNING",
        createdAt: new Date().toISOString(),
      };
      await atomic(file, b);
    }
    const prior = await history(config.workspace);
    for (let i = 0; i < config.count; i++) {
      const jobId = `${id}-${String(i + 1).padStart(2, "0")}`;
      safeId(jobId);
      const jobFile = path.join(config.workspace, "runs", jobId, "job.json");
      let job = await json(jobFile, null);
      if (!job) {
        let s;
        for (let n = 0; n < 100; n++) {
          s = await sample(config.seed + i * 101 + n, prior);
          if (distinct(s, prior)) break;
        }
        if (!distinct(s, prior)) throw Error("Creative pool exhausted");
        await recordSupply(config.workspace, s);
        prior.push(s);
        job = {
          id: jobId,
          batchId: id,
          sourceFingerprint: fingerprint,
          status: "QUEUED",
          goal: input.goal ?? "build",
          supply: s,
          budget: { calls: 0, elapsedMilliseconds: 0 },
          decisions: {},
          repairs: 0,
        };
        await atomic(jobFile, job);
      }
      if (!b.jobIds.includes(jobId)) {
        b.jobIds.push(jobId);
        await atomic(file, b);
      }
      if (job.status === "ACCEPTED") {
        if (
          hashManifest(
            await fileManifest(path.join(config.workspace, "games", jobId)),
          ) !== job.report?.artifactHash
        )
          throw Error("Accepted artifact changed; evidence is stale");
        if (job.post || job.postError) continue;
      }
      if (
        [
          "IDEA_READY",
          "BUILT_UNVALIDATED",
          "QUARANTINED",
          "BUDGET_EXHAUSTED",
        ].includes(job.status)
      )
        continue;
      job = await runJob(config, job, { fingerprint, ...options });
      if (["BLOCKED", "CANCELLED"].includes(job.status)) break;
    }
    b.jobs = await Promise.all(
      b.jobIds.map((x) =>
        json(path.join(config.workspace, "runs", safeId(x), "job.json")),
      ),
    );
    b.accepted = b.jobs.filter((j) => j.status === "ACCEPTED").length;
    b.status =
      b.accepted === config.count
        ? "PASS"
        : b.jobs.every((j) => j.status === "IDEA_READY") &&
            b.jobs.length === config.count
          ? "IDEAS_READY"
          : b.jobs.every((j) => j.status === "BUILT_UNVALIDATED") &&
              b.jobs.length === config.count
            ? "BUILT_UNVALIDATED"
            : "PARTIAL";
    b.completedAt = new Date().toISOString();
    await atomic(file, { ...b, jobs: undefined });
    return b;
  } finally {
    await release();
  }
}
export async function status(workspace, id) {
  safeId(id);
  const b = await json(path.join(workspace, "batches", id + ".json"));
  return {
    ...b,
    jobs: await Promise.all(
      b.jobIds.map((x) =>
        json(path.join(workspace, "runs", safeId(x), "job.json")),
      ),
    ),
  };
}
export async function cancel(workspace, id) {
  safeId(id);
  await atomic(path.join(workspace, "cancel", id + ".json"), {
    cancelled: true,
  });
}
export async function resume(input, options = {}) {
  const b = await json(
    path.join(input.workspace, "batches", safeId(input.id) + ".json"),
  );
  return batch(
    { ...b.config, goal: b.goal, ...input },
    { ...options, clearCancellation: true },
  );
}
