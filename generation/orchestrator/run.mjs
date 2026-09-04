import path from "node:path";
import { mkdir } from "node:fs/promises";
import { json, atomic } from "./store.mjs";
import { Budget } from "../runtime/budget.mjs";
import { LocalModel } from "../runtime/local-model.mjs";
import { ideation } from "../chains/ideation.mjs";
import { brainstorm } from "../chains/brainstorm.mjs";
import { specification } from "../chains/specification.mjs";
import { assemble } from "../builders/assemble.mjs";
import { staticValidation } from "../validation/static.mjs";
import { production } from "../chains/production.mjs";
import { posts } from "../chains/posts.mjs";
import { repair } from "../builders/repair.mjs";
import { admit } from "../library/admit.mjs";
import { terminalError } from "./policy.mjs";
import { assertResume } from "./recovery.mjs";
export async function runJob(
  config,
  job,
  { fingerprint, runtimeFactory, validateProduction = production } = {},
) {
  assertResume(job, fingerprint);
  const dir = path.join(config.workspace, "runs", job.id);
  await mkdir(dir, { recursive: true });
  const filename = path.join(dir, "job.json");
  let budget;
  job.deadlineAt ??= Date.now() + config.maxMilliseconds;
  const previouslyAccepted = job.status === "ACCEPTED";
  const save = async () => {
    if (budget) job.budget = budget.snapshot();
    await atomic(filename, job);
  };
  budget = new Budget({
    ...config,
    deadlineAt: job.deadlineAt,
    calls: job.budget.calls,
    elapsedMilliseconds: job.budget.elapsedMilliseconds,
    onChange: save,
    cancelled: async () =>
      Boolean(
        (
          await json(
            path.join(config.workspace, "cancel", job.batchId + ".json"),
            {},
          )
        ).cancelled,
      ),
  });
  const runtime = runtimeFactory
    ? runtimeFactory(budget)
    : new LocalModel(
        {
          ...config,
          onRecord: async (record) => {
            job.modelRecords ??= [];
            job.modelRecords.push(record);
            await save();
          },
        },
        budget,
      );
  const ctx = { config, job, runtime, save };
  try {
    if (previouslyAccepted) {
      try {
        await runtime.health();
        job.post = await posts(ctx, job.spec, job.report);
        await atomic(
          path.join(config.workspace, "drafts", job.id + ".json"),
          job.post,
        );
      } catch (e) {
        job.postError = e.message;
      }
      await save();
      return job;
    }
    job.status = "RUNNING";
    await save();
    await budget.check();
    await runtime.health();
    if (!job.idea) {
      job.idea = await ideation(ctx);
      await save();
    }
    if (!job.detail) {
      job.detail = await brainstorm(ctx, job.idea);
      await save();
    }
    if (!job.spec) {
      job.spec = await specification(ctx, job.idea, job.detail);
      await save();
    }
    if (job.goal === "assemble") {
      const root = path.join(dir, "candidate");
      await assemble(job.spec, root);
      job.report = await staticValidation(root);
      job.gamePath = root;
      job.status =
        job.report.status === "PASS" ? "BUILT_UNVALIDATED" : "QUARANTINED";
      await save();
      return job;
    }
    if (job.goal === "ideas") {
      job.status = "IDEA_READY";
      await save();
      return job;
    }
    while (true) {
      await budget.check();
      const attempt = job.repairs ?? 0;
      const root = path.join(dir, `attempt-${attempt}`, "game"),
        evidence = path.join(dir, `attempt-${attempt}`, "evidence");
      job.report = await validateProduction(ctx, job.spec, root, evidence);
      await save();
      await budget.check();
      if (job.report.status === "BLOCKED") {
        job.status = "BLOCKED";
        job.error = "Browser validation blocked by environment";
        job.gamePath = root;
        await save();
        return job;
      }
      if (job.report.status === "PASS") {
        job.gamePath = await admit(
          config.workspace,
          job.spec,
          root,
          job.report,
        );
        job.status = "ACCEPTED";
        await save();
        break;
      }
      const next =
        attempt < config.maxRepairs
          ? repair(job.spec, [
              ...(job.report.static?.errors ?? []),
              ...(job.report.browser?.errors ?? []),
            ])
          : null;
      if (!next) {
        job.status = "QUARANTINED";
        await save();
        return job;
      }
      job.spec = next;
      job.repairs = attempt + 1;
      await save();
    }
    try {
      job.post = await posts(ctx, job.spec, job.report);
      await atomic(
        path.join(config.workspace, "drafts", job.id + ".json"),
        job.post,
      );
    } catch (e) {
      job.postError = e.message;
    }
    await save();
    return job;
  } catch (e) {
    job.status = terminalError(e);
    job.error = e.message;
    await save();
    return job;
  }
}
