# Historical 2D cohort — retired

The final50 game directories described below were removed at the user's request during the Three.js replacement. These are historical results, not current 3D evidence.

# Local validation — 2026-09-12

Implemented on `codex/arcade-spine-harness`. Generated games were created only by
the harness from model-authored recipes. No generated HTML or recipe was manually
edited. Existing installer and legacy generation source remain unchanged.

## Measured cohort

`../NexusArcade-Experiments/final50-001` through `final50-050`: **50/50 passed**
their browser interaction checks and actual LFM VL screenshot review.

| Measurement | Result |
|---|---:|
| Warm generation, mean | 6.654 seconds |
| Warm generation, minimum / maximum | 5.407 / 8.495 seconds |
| Warm generation, p95 | 7.901 seconds |
| Generated tokens, mean / maximum | 224 / 354 |
| Generated tokens, total | 11,180 |
| Reported input tokens, mean per game | 1,397 |
| Reported input tokens, maximum per request | 562 |
| Runs needing a planner correction | 1 (`final50-008`) |
| Distinct root sets / titles | 17 / 21 |

This measures 50 configurations of one arena family, not 50 distinct genres or
50 human-approved games. Token counts are LM Studio usage reports, including any
reasoning it accounts for; visual-input accounting follows that runtime's report.
The output ceiling is 4,000 tokens across at most six calls and a 240-second
generation deadline. Each model was loaded with a 4,096-token context.

Planner/solver: `lfm2.5-1.2b-thinking`, 1.2B, F16, alias `arcade-planner`.
Writer/editor/visual reviewer: `lfm2.5-vl-3b`, 3B, Q4_K_M, alias `arcade-writer`.
Measured loading was approximately 3.3 and 16.9 seconds respectively, separately
from the warm cohort. Runtime metadata checks verified family, parameter count,
loaded alias and writer vision support. No models above 3B were used. The user's
explicit model-role selection superseded the earlier proposed four-model comparison.

## Review corrections and repeat verification

The original cohort used source fingerprint
`7d8c384448020386a9bf76d93cc056261c18a1bf8618fde87aed3d409501293b`.
Later changes added component-coverage selection and improved the reviewer; the
game runtime and all 50 generated HTML artifacts stayed unchanged.

- Two targeted model-generated games exercised alternatives the random cohort
  omitted. Together these cover all 12 components. Coverage constrains the writer
  to supported alternatives after the independent roll; it never changes the roots.
- Orbit contact initially failed because the bot waited at spawn coordinates
  after the enemy had moved onto its orbit. The reviewer now intercepts the orbit.
- Repeated headless runs intermittently returned a one-color canvas readback.
  A recorded redraw alone did not solve it. Switching the automated reviewer to
  software rendering produced **52/52 passing rechecks**: the original 50 plus
  `coverage-a2-001` and `coverage-b2-001`. Every checked HTML hash matched its spine.
  No redraw retry was needed in this software-rendered recheck.
- Original VL verdicts and screenshot hashes remain preserved. The recheck is
  separate browser evidence, not a new VL judgment or a rewrite of original spines.
  `verify` therefore correctly reports matching evidence and `currentHarness:false`
  for the older cohort. New generations record the current fingerprint.
- Two fresh end-to-end runs, `coverage-final-a-001` and `coverage-final-b-001`,
  passed browser and VL review on the final harness in 9.589 and 10.152 seconds
  (213 and 224 generated tokens). Their hashes match the current source fingerprint
  `08c56f5355c89334a18e10b6453211134a15f72657c3816a59a321dad20bdbbb`.

Evidence: `final50-metrics.json`, `final50-recheck.json`, the two earlier recheck
reports, and each experiment's `spine.json`, `index.html`, and `review.png` under
`../NexusArcade-Experiments/`. Failed development trials remain visible as history;
their old PASS labels apply only to their recorded source and checks.

Development cohorts before final50: pilot 1/1 passed; trial 0/6; probe 0/1;
pilotb 3/6; pilotc 6/6; acceptance50 24 passed, 1 failed, 1 cancelled;
games50 42 passed, 1 failed, 1 cancelled. These campaigns were used to find and fix
grammar constraints, prose placeholders, a missing optional-progression guard,
capture handling, and reviewer preconditions. They are not hidden in the final
cohort's denominator or represented as successes under the final implementation.

## Other checks

- Existing `TMPDIR=/private/tmp npm test`: 41 tests, build, and 17-module browser
  boundary passed. Default macOS `/var` temp paths hit pre-existing symlink checks.
- 1,000 deterministic rolls: all 20 three-root combinations, depth boundaries,
  reproducibility and unsafe-input rejection passed.
- Invalid recipes, unsupported prose, nonlocal endpoint, oversized-model metadata,
  call/token/deadline guards, exclusive writer lock and immutable IDs checked.
- Desktop/mobile layout, Play iframe, Close, keyboard pause/resume/restart,
  fullscreen entry/exit, audio-enabled startup and cross-origin POST rejection checked.
  Generate followed by Cancel persisted `CANCELLED`; existing-ID generation failed
  before overwriting any bytes.
- Supplied web-game Playwright client ran and its screenshot was inspected.
- One real-time idle browser run, without `advanceTime`, ended at 300 active seconds
  after a two-second pause; elapsed 302.061 seconds, no browser errors. This used
  `acceptance50-002` with the same shared runtime. See `realtime-check.json`.
- Accelerated combined pause/run check ended within one simulation frame of the
  420-second total bound. Package dry-run excluded harness and experiments from
  the 103-file installer package. No new unit/smoke test files were added.

## Practical limits

Automated interaction and one screenshot do not establish enjoyment, full-session
human play, audio quality, accessibility, or cabinet readiness. Model prose and
component choices repeat; diversity is the next product-quality issue to assess.
Planner premise prose is less constrained than executable recipe fields: the final
City Explorer premise mentions avoiding obstacles despite having no pursuit domain.
Automated PASS therefore does not certify every sentence of the generated concept.
Current output uses a compact shared arena and primitive graphics. It does not
generate arbitrary source, train a model, publish games, or certify installer admission.

Experiments retain only compact spines, one current HTML artifact and one screenshot
per run; no raw chats, reasoning traces, videos, or duplicated model weights.
