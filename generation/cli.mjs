#!/usr/bin/env node
import {
  batch,
  status,
  resume,
  cancel,
  benchmark,
  LocalModel,
  config,
} from "./index.mjs";
import { atomic } from "./orchestrator/store.mjs";
const [command, ...args] = process.argv.slice(2);
const input = {};
const names = {
  workspace: "workspace",
  id: "id",
  seed: "seed",
  count: "count",
  "server-url": "serverUrl",
  "max-calls": "maxCalls",
  "max-ms": "maxMilliseconds",
  output: "output",
};
try {
  for (let i = 0; i < args.length; i++) {
    const key = args[i].replace(/^--/, "");
    if (!names[key] || !args[i + 1] || args[i + 1].startsWith("--"))
      throw Error("Unknown or missing option: " + args[i]);
    input[names[key]] = ["seed", "count", "max-calls", "max-ms"].includes(key)
      ? Number(args[++i])
      : args[++i];
  }
  const cfg = config(input);
  let r;
  if (command === "doctor") r = await new LocalModel(cfg).health();
  else if (command === "batch") r = await batch(input);
  else if (command === "assemble")
    r = await batch({ ...input, goal: "assemble" });
  else if (command === "build") r = await batch({ ...input, count: 1 });
  else if (command === "ideas") r = await batch({ ...input, goal: "ideas" });
  else if (command === "status") r = await status(cfg.workspace, input.id);
  else if (command === "resume")
    r = await resume({ ...input, workspace: cfg.workspace });
  else if (command === "cancel") {
    await cancel(cfg.workspace, input.id);
    r = { status: "CANCELLATION_REQUESTED" };
  } else if (command === "benchmark") r = await benchmark(cfg);
  else
    throw Error(
      "Usage: nexus-arcade-generate doctor|ideas|assemble|build|batch|status|resume|cancel|benchmark [--workspace PATH] [--id ID] [--seed N] [--count N] [--server-url URL] [--output FILE]",
    );
  if (input.output) await atomic(input.output, r);
  console.log(JSON.stringify(r, null, 2));
  if (
    r.status === "PARTIAL" ||
    (r.correct !== undefined && r.correct !== r.count)
  )
    process.exitCode = 1;
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
