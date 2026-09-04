import { fileURLToPath } from "node:url";
import { fileManifest, hashManifest } from "../builders/assemble.mjs";
export async function sourceFingerprint() {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const files = await fileManifest(root);
  return hashManifest(files.filter((f) => !f.path.endsWith(".md")));
}
export function assertResume(job, fingerprint) {
  if (job.deadlineAt !== undefined && !Number.isFinite(job.deadlineAt))
    throw Error("Corrupt deadline");
  if (job.sourceFingerprint !== fingerprint)
    throw Error(
      "Generation source changed; create a new batch to preserve evidence",
    );
  if (
    !Number.isSafeInteger(job.budget?.calls) ||
    job.budget.calls < 0 ||
    !Number.isFinite(job.budget?.elapsedMilliseconds) ||
    job.budget.elapsedMilliseconds < 0
  )
    throw Error("Corrupt budget checkpoint");
}
