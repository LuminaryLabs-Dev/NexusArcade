# Unified local harness: implementation and evidence

Scope: one configurable generation pipeline, using only localhost Agents A1. G01–G33 and archived evidence are unchanged. No game output was hand-edited.

## Implemented

- `cli.mjs make-game`, `generate`, `pilot`, `smart-build`, and the arcade generation action share `unified-run.mjs`. Historical legacy commands remain explicit diagnostics.
- `model.mjs` is the single client; `smart-model.mjs` is a compatibility export. `model-config.json` owns endpoint, exact loaded identity, context/output allowances, request timeout, principles and optional vision. No parameter-count ceiling.
- Preflight checks the loaded model and context. Calls are bounded, cancellable, schema validated and recorded. Truncated replies fail validation. Retry attempts retain the original 25-minute deadline and locked profile.
- The schema is included in the prompt as well as the API response constraint. Earlier local replies showed that an API-only schema left this reasoning model guessing its required output shape.
- Optional guidance is read for each model request. The arcade can append a revision while interpretation is running. Each call records the hash it consumed. Changes never alter an in-flight request. Conflicting gameplay requests require a new roll; the supported slower preset is walk speed 4 or agile handling.
- Roller v2 uses meaningful implemented presets and a deterministic compiler. Rolled flow layout/process/speed and track/handling/width/shortcut values reach the actual runtime. Presentation values do not establish gameplay uniqueness.
- Missing capabilities or truncated required branches block assembly. Models cannot invent executable adapters. The catalog currently exposes two supported runtime families, not thousands.
- SPINE retains profile/hash, configuration, model calls, guidance, interpretation, executable composition and separate build/browser/visual/acceptance results. Previews are never automatically factory accepted.

## Validation performed

- `npm test`: 41 tests pass, package build passes, browser boundary passes.
- `cli.mjs roller-check`: repeatability, hash/reload, root preservation, deeper expansion, 100 compiled seeds (51 driving / 49 flow), tampered bindings and omitted gaps rejected.
- Runtime control probe: 0.2 seconds of identical input moves 0.8 metres at speed 4 and 1.2 metres at speed 6.
- Mock transport checks: wrong response model, missing loaded model, truncation and expired deadline rejected; subsequent calls consume different guidance revisions. Mock evidence is not live model evidence.
- Live localhost preflight: Agents A1 4.2B, loaded context 16,128, vision false. No LAN requests were made.

## Acceptance limits

Visual-model review is incomplete without a configured capable vision model. Browser diagnostics and normal keyboard/frame checks are reported separately. Independent novelty, player comprehension and target-device performance remain acceptance gates. Current supported presets are a foundation, not a claim of broad diversity or high-fidelity quality.

## Local model tuning and live guidance

The initial reasoning-enabled requests timed out or exhausted their output allowance. `reasoning_effort: none` was verified against the actual localhost server: 4.5-second structured probe, zero reasoning tokens. The unified client now validates that this setting is supported by the selected model. Full interpretation then took 37.1 seconds and writing 8.4 seconds, both without reasoning tokens.

`unified-local-playable` records an empty-guidance interpretation followed by a writer call consuming a different guidance hash, submitted through the live arcade API. The guidance requested readable objectives and retained the already-rolled slower walk speed of 4. This proves stage-boundary delivery; it does not mean prose can silently override locked parameters.

A real browser input check initially failed because no movement was observed within a fixed 400 ms wall-clock interval under software rendering. An independent held-key probe observed movement from z=12 to z=11. The shared reviewer now keeps the real key held until movement is observed (maximum 10 seconds); absence of movement still fails. No test hooks are used for that check.

## Final outcome

`unified-local-reviewed` / **Conduit Tank Fill** is built and playtested: 39/39 browser checks pass with no runtime errors. The final attempt took 102 seconds; the entire original idea including failed attempts and repairs took 1,422.8 seconds (23m43s), within the preserved 25-minute deadline. The browser exercised both flow routes (22.75s efficient / 18.25s direct), meaningful waste differences, failure, restart, persisted best time and replay.

Current-source, generated HTML, review image and all 486 shared runtime file hashes were verified. See `unified-harness-validation.json` for the receipt and `NexusArcade-Experiments/unified-local-reviewed/spine.json` for full per-call and browser evidence. `unified-local-playable` failed the earlier live-input timing check; its launch HTML was removed through the existing cleanup command while diagnostic evidence was retained.

Manual screenshot inspection confirms visible tank fill and readable HUD, but the dark room and partially clipped world labels still warrant presentation review. This is not high-fidelity acceptance. No vision model was used, and no LAN probe was attempted. Campaign order/status gates are unchanged.
