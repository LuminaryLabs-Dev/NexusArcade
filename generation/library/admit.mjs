import { cp, mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileManifest, hashManifest } from "../builders/assemble.mjs";
import { safeId, atomic, json } from "../orchestrator/store.mjs";
import { register } from "./catalog.mjs";
export async function admit(workspace, spec, source, report) {
  safeId(spec.id);
  if (report.status !== "PASS" || !report.browser?.playthrough?.pass)
    throw Error("No passing independent evidence");
  if (hashManifest(await fileManifest(source)) !== report.artifactHash)
    throw Error("Evidence is stale");
  const target = path.join(workspace, "games", spec.id);
  const temp = target + ".staging";
  await mkdir(path.dirname(target), { recursive: true });
  let exists = false;
  try {
    await fileManifest(target);
    exists = true;
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  if (exists) {
    if (hashManifest(await fileManifest(target)) !== report.artifactHash)
      throw Error("Existing game differs");
  } else {
    await rm(temp, { recursive: true, force: true });
    await cp(source, temp, { recursive: true });
    if (hashManifest(await fileManifest(temp)) !== report.artifactHash)
      throw Error("Copy integrity failed");
    await rename(temp, target);
  }
  await atomic(path.join(workspace, "releases", spec.id + ".json"), {
    spec,
    report,
  });
  await register(workspace, {
    id: spec.id,
    title: spec.title,
    mode: spec.mode,
    path: "games/" + spec.id,
    artifactHash: report.artifactHash,
  });
  return target;
}
