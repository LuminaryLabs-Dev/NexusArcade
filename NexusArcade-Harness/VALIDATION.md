# Three.js composition validation

## Final result

50 accepted, structurally distinct Three.js/NexusEngine compositions from 54 measured attempts. The previous final50-001 through final50-050 directories were removed. Four failed attempts remain inspectable under Advanced; the main arcade displays 50 playable games. No generated game was manually edited.

Accepted runs share runtime fingerprint `63cc89a15a17ccc9fdb3e240dbb4d63a854df602ec68f85afe1da009960f47e7`. Artifact, composition, screenshot and shared-runtime manifest hashes were verified after generation. Machine-readable results: ../NexusArcade-Experiments/arcade50-final-acceptance.json.

## Measured results

- Accepted generation time, including automated playthrough and two-view visual review: mean 67.0 s; median 53.8 s; p95 144.9 s; maximum 224.5 s. Models were already loaded; setup/download time is excluded.
- Reported output tokens per accepted game: mean 80.6, maximum 102. Reported input tokens include image processing and are separate; mean 4785.0 per game across all calls. These are API-reported counts, not a claim about hidden reasoning accounting.
- Models verified: LFM2.5 Thinking 1.2B F16 planner; LFM2.5 VL 3B Q4_K_M writer and image reviewer; 4096-token context per model. No larger/cloud models.
- Diversity: 50 structural signatures; 36 independent concept sets; layouts {"crown":12,"fork":13,"switchback":7,"terraces":6,"arc":12}; objective patterns {"network":12,"recovery":18,"expedition":20}; depths {"1":18,"2":17,"3":15}.
- Signatures exclude titles, colors, concept wording, descriptive goal names and unused receiver fields. They retain spatial layouts, actions, prerequisites, active receivers, bridge connections, required objectives and exit. This proves distinct compositions, not fifty genres.

## Validation evidence

- All 50: schema/dependency validation, real Chromium WebGL, keyboard movement, prerequisite state, required interactions, objective completion and extraction, pause, restart, idle timeout, reset after failure, no browser errors, two captured views and VL acceptance. Playthrough time is accelerated through the shared engine clock.
- Shared installed-kit checks: rejected unmet prerequisites, blocked unsupported movement, exact reset, cumulative pause allowance, pause expiry and timeout.
- Separate real-time idle test: 300 active seconds, two-second pause, timeout reached, no errors. It used arcade50-001, the same gameplay implementation before the final signature refinement. Evidence: ../NexusArcade-Experiments/realtime-3d.json and lifecycle-3d.json.
- Supplied web-game Playwright client ran against arcade50-final-001; its screenshot was inspected. Final UI: desktop/mobile width, Play/Back, Advanced history and failed-attempt visibility passed without page errors.
- Existing repository validation: 41 tests passed, build passed, 17-module browser boundary passed. CLI check passed 1000 reproducible distinct supported graphs.
- Software-WebGL performance sample under concurrent browser load: median frame 41.4 ms, p95 50 ms, 65 draw calls, 5264 triangles at 1100x780. This does not establish hardware 60 FPS.

## Failed attempts and review loops

- arcade50-final-036: The operation was aborted due to timeout (134.4 s).
- arcade50-final-040: The operation was aborted due to timeout (3580.0 s).
- arcade50-final-041: page.goto: Timeout 12000ms exceeded. (132.1 s).
- arcade50-final-045: Visual review: All platforms, bridges, actor and objective markers are visibly rendered and readable. (34.3 s).

Game 040's large elapsed-time jump is consistent with host suspension; wall-clock deadlines cannot execute while the host is suspended. A process-scoped idle-sleep guard was used for the remaining batch/replacements. Game 045 received a negative visual verdict despite a positive-sounding observation; the harness conservatively rejected it. Four fresh replacements passed the full pipeline. Failed evidence was retained and never relabeled PASS.

Development pilots exposed renderer line setup, traversal-bot diagonal cutting, premature-success interpretation and unbounded kit receipt retention. Shared renderer, reviewer and adapter fixes were made before this campaign. The earlier arcade50 campaign (four passes, one intentional cancellation) is historical and excluded. No runtime source changed during the measured campaign or replacements.

## Limits

This is procedural stylized 3D with planar traversal and three implemented interaction types: activate, hold and carry. Depth changes branch selection, objective closure and dependencies. Missing engine behaviors remain explicit. AAA art, free vertical traversal, combat, broad simulation, human enjoyment, accessibility and physical cabinet readiness are not established. Keyboard required. Models choose bounded compositions and presentation; arbitrary game scripts are prohibited.

## Accepted collection

IDs below are prefixed arcade50-final-. Every row passed runtime and visual review.

| ID | Title | Layout / depth | Objective | Seconds | Output tokens |
|---|---|---|---|---:|---:|
| 001 | Weight of Memory | crown / 1 | network | 44.688 | 81 |
| 002 | The Weight of Binding, | fork / 2 | recovery | 41.936 | 79 |
| 003 | Weightless Horizons | switchback / 3 | recovery | 48.367 | 100 |
| 004 | Weight of the Unseen | switchback / 1 | expedition | 63.522 | 74 |
| 005 | Weightless Horizons | fork / 2 | network | 53.823 | 70 |
| 006 | Weight of the Journey | crown / 3 | network | 62.068 | 85 |
| 007 | Weightless Horizons | terraces / 1 | network | 46.224 | 86 |
| 008 | Weight of Stillness | arc / 2 | expedition | 34.899 | 81 |
| 009 | Weight of the Journey | arc / 3 | network | 70.653 | 91 |
| 010 | Weightless Ties | terraces / 1 | network | 47.546 | 63 |
| 011 | Weight and Link | crown / 2 | expedition | 50.086 | 87 |
| 012 | Weightless Journey | fork / 3 | expedition | 47.024 | 77 |
| 013 | Floating Order | switchback / 1 | recovery | 45.278 | 74 |
| 014 | Weighted Horizons | arc / 2 | recovery | 38.378 | 78 |
| 015 | Bloom in Stillness | crown / 3 | expedition | 44.421 | 97 |
| 016 | Echoes of the Sky | fork / 1 | recovery | 44.927 | 80 |
| 017 | Weightless Transit | terraces / 2 | network | 44.521 | 66 |
| 018 | Echoes of Balance | fork / 3 | expedition | 56.826 | 97 |
| 019 | Weight of the Core | switchback / 1 | expedition | 60.43 | 76 |
| 020 | Echoes of Stillness | terraces / 2 | expedition | 34.852 | 84 |
| 021 | Balance of Tides | fork / 3 | expedition | 54.486 | 67 |
| 022 | Floating Order | fork / 1 | expedition | 50.848 | 67 |
| 023 | Weighted Balance | arc / 2 | recovery | 44.288 | 89 |
| 024 | Echoes of the Void | fork / 3 | expedition | 56.184 | 92 |
| 025 | Airships of Hope | crown / 1 | recovery | 42.092 | 73 |
| 026 | Echoes of the Core | arc / 2 | recovery | 46.437 | 73 |
| 027 | Weightless Paths | arc / 3 | recovery | 34.287 | 66 |
| 028 | Echoes of the Void | terraces / 1 | expedition | 42.748 | 77 |
| 029 | Echoes of Balance | fork / 2 | expedition | 37.866 | 102 |
| 030 | Floating Nodes | fork / 3 | network | 65.479 | 67 |
| 031 | Echoes of Weight | crown / 1 | expedition | 37.197 | 96 |
| 032 | Echoes of Balance | arc / 2 | expedition | 35.063 | 72 |
| 033 | Crossing the Void | arc / 3 | expedition | 120.296 | 69 |
| 034 | Weightless Pathways | arc / 1 | network | 135.287 | 73 |
| 035 | Growing Order | terraces / 2 | recovery | 113.647 | 87 |
| 037 | Echoes of the Unseen | crown / 1 | network | 138.805 | 71 |
| 038 | Anchor of Stillness | fork / 2 | expedition | 165.528 | 75 |
| 039 | Weightless Journey | switchback / 3 | network | 224.542 | 81 |
| 042 | Balance of Flow | arc / 3 | network | 144.884 | 85 |
| 043 | Echoes of Grace | crown / 1 | recovery | 88.943 | 71 |
| 044 | Echoes of the Anchor | crown / 2 | recovery | 65.858 | 87 |
| 046 | Echoes of the Drift | fork / 1 | recovery | 79.841 | 81 |
| 047 | Floating Horizons | arc / 2 | expedition | 43.994 | 70 |
| 048 | Floating Horizons | switchback / 3 | recovery | 82.959 | 88 |
| 049 | Floating Salvage | crown / 1 | recovery | 76.079 | 84 |
| 050 | Echoes of Tethered Space | crown / 2 | recovery | 47.896 | 91 |
| replacement-001 | Echoes of the Drift | switchback / 1 | expedition | 67.776 | 97 |
| replacement-002 | Roots in the Cloud | arc / 2 | recovery | 61.632 | 85 |
| replacement-003 | Floating Horizons | crown / 3 | recovery | 92.739 | 91 |
| replacement-004 | Floating Nodes | fork / 1 | expedition | 74.188 | 79 |
