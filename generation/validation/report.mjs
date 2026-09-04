import { staticValidation } from "./static.mjs";
import { browserValidation } from "./browser.mjs";
import { atomic } from "../orchestrator/store.mjs";
import path from "node:path";
export async function validateGame(root, evidence, options = {}) {
  const staticReport = await staticValidation(root);
  const browser =
    staticReport.status === "PASS"
      ? await browserValidation(root, evidence, options)
      : null;
  const report = {
    schemaVersion: 1,
    status:
      browser?.status === "BLOCKED"
        ? "BLOCKED"
        : staticReport.status === "PASS" && browser?.status === "PASS"
          ? "PASS"
          : "FAIL",
    artifactHash: staticReport.artifactHash,
    files: staticReport.files,
    static: staticReport,
    browser,
  };
  await atomic(path.join(evidence, "validation.json"), report);
  return report;
}
