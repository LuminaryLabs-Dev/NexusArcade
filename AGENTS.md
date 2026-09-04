# NexusArcade agent contract

This repository owns the arcade installer and the local generation factory.

- Keep `generation/` Node-only; browser exports must not reach it.
- Use only approved, pinned dependency files. Preserve third-party licenses.
- Model responses are untrusted data. Validate strict schemas before use.
- Keep global request budgets, persisted deadlines, cancellation, and explicit failure states.
- Never let model text declare gameplay validation or execute arbitrary commands.
- Do not commit model weights, runtime binaries, credentials, run directories, or captures.
- Run `npm test` and inspect `npm pack --dry-run --json` before release.
- Report live LFM, deterministic tests, browser evidence, and physical-device results separately.
- Treat `BUILT_UNVALIDATED` and `BLOCKED` as incomplete acceptance; never promote them by changing a label.
- Changes to other Luminary repositories require their own explicit task scope.
- A GitHub write requires user authorization and a statement naming repository and action.
