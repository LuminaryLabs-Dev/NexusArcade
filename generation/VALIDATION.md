# Validation record — 2026-09-04

## Implementation status

The factory is experimental. Unit/integration tests and real LFM design/assembly
have been exercised. Browser/gameplay/recording remain BLOCKED by the implementation
sandbox's Chromium process-socket policy. An elevated execution request was also
rejected by approval policy. No gameplay pass or video is claimed.

## Evidence categories

| Category | Result |
| --- | --- |
| Original installer baseline | 14 tests passed before implementation |
| Final automated suite | 34 tests passed; browser entry point traversed 17 modules without Node/generation imports |
| Exact Universal source | 90-file manifest verified; activation self-tests passed |
| Approved model | GGUF size and SHA-256 matched the skill; smoke inference passed |
| Live narrow selection | 20/20 first-attempt correct, 20 calls, zero fallback |
| Live design/assembly | Brass Horizon (hold), Glassbound (sequence), Tidebound (deliver): 18 live calls, 18 first-attempt accepted decisions, zero fallbacks; all three static package checks passed |
| Browser execution | BLOCKED: Chromium could not create its required process socket |
| Gameplay, visual review, video | Not completed; no accepted game claims |
| Physical computer/cabinet | Not tested |

## Automated coverage

Tests cover malformed/missing/oversized model output, strict enums and ranges,
validated fallbacks, chain handoff, global budgets, timeout/cancellation checks,
HTTP model identity and response bounds, seeded replay, recent-mode diversity,
atomic checkpoints, competing writers, corrupted state, source changes, partial
stage resume, deterministic assembly, dependency hashes, immutable admission,
stale evidence, and existing installer/browser boundaries.

Injected test adapters are synthetic orchestration tests, not live-model or browser
proof. LFM accepting a schema is not evidence that the generated design is fun.

## Browser gate on a supported host

The browser validator serves the exact candidate on localhost, blocks other
origins, records renderer identity, captures ready/play/win frames, drives actual
keyboard movement and interaction to victory, checks restart/pause, and tests a
failure branch with explicitly labeled accelerated simulation. Browser recording
uses native Playwright video, not a fabricated or animated screenshot.

Acceptance requires a real browser pass plus exact static artifact hashes. A
missing optional browser dependency or prohibited launch returns BLOCKED. Static
assembly alone returns BUILT_UNVALIDATED and cannot enter the accepted catalog.

Headless rendering and target-device performance are separate measurements.
