# NexusArcade — Reliable Arcade Factory

The foundation is in progress. The 33 goals remain in their original eleven
Plan → Build → Review cycles. Historical platform games and new development
pilots are playable previews; neither counts toward the 1,000-game factory target.

Run from the repository with the existing pinned dependencies:

```sh
node NexusArcade-Harness/server.mjs
node NexusArcade-Harness/cli.mjs factory-check
node NexusArcade-Harness/cli.mjs queue
```

The arcade at http://127.0.0.1:4318 opens with searchable games, 24 per page.
Play opens an embedded player; Back restores the search, focus and scroll.
Complexity, seed and diagnostics are under Generation options. Keyboard input is
required. New players pause on focus loss and require explicit resume.
Historical immutable players retain their original behavior.

Until contention is measured, an exclusive lease prevents generation and
foreground arcade play from overlapping. Close the player before generating.
A stale process lease can be inspected/recovered with `cli.mjs recover`; recovery
refuses a living owner and cannot reset an idea's deadline.

LM Studio must expose these already-installed models on 127.0.0.1:1234:

- `lfm2.5-1.2b-thinking`, alias `arcade-planner`, 1.2B.
- `lfm2.5-vl-3b`, alias `arcade-writer`, 3B with vision.

Both currently use 4K contexts. The harness verifies metadata before inference.
Each admitted idea gets 25 minutes including loading, inference, repair and
validation. There is no cumulative token or improvement-pass quota. Per-request
output/context limits still apply. Invalid responses get bounded schema feedback;
truncation can increase the individual output allowance. Repeated ineffective
corrections stop. Cancellation, wall-clock rollback and expiry fail the attempt.

```sh
# Development probe; cannot grant factory acceptance.
node NexusArcade-Harness/cli.mjs generate --prefix probe --seed 97000

# Three reusable foundation pilot families.
node NexusArcade-Harness/cli.mjs pilot --kind courier --id courier-example --seed 97401
node NexusArcade-Harness/cli.mjs pilot --kind conduit --id conduit-example --seed 97402
node NexusArcade-Harness/cli.mjs pilot --kind rally --id rally-example --seed 97403

# A shared fix may create a new immutable revision under the original deadline.
node NexusArcade-Harness/cli.mjs pilot --kind courier --id courier-revised --retry-of courier-example --seed 97401
```

Games are created only through the harness. Fix shared source, then regenerate;
never patch generated game files. Models produce structured decisions, not scripts.
Upstream NexusEngine owns locomotion in the pilots. Local reusable NexusEngine
adapter domains own delivery, valve/flow and steering/checkpoint rules. Three.js
renders those states. These adapters are not claimed to be upstream Core features.

`factory-check` audits all four contract files, including profile/catalog identity,
mandatory replay coverage and frozen calibration completeness. Contract-6 has 27 decision
points and 55 options; these counts do not establish executable capability coverage.
Replay structure, tradeoffs, session structure and environment behavior are explicit
choices whose new implementations remain gated.

`factory.mjs` implements deadline guards, exclusive leases, hashed evidence,
guarded queue transitions and accepted-slot publication. `improvement.mjs` keeps
candidate revisions, rejects protected/stale patches, invalidates dependent locks
and keeps/reverts candidates against checks. The platform development path uses
this controller. Pilot probes currently exercise shared capabilities and model
response repair; they do not yet use the full catalog-to-domain compiler.

`catalog.mjs` validates references, recursive choices, merges, prerequisites and
eligibility. It resolves supported selections into an intermediate profile; it
does not yet emit an executable game. Missing capability evidence blocks resolution.
`accepted-index.json` is separate from `library-index.json`: readable previews
never silently become accepted games. Batch admission remains gated by foundation
implementation and review.

Each experiment retains compact decisions, model identities, timing, source hashes
and check results in `spine.json`. Immutable runtime snapshots under
`NexusArcade-Experiments/.runtime` avoid per-game dependency copies. Failed
attempts retain their reason. No raw conversations, reasoning or model weights
are stored. Screenshots and traces prove only the checks actually performed.

G01 planning is complete; G02 implementation is running. Nine concrete acceptance
parameter records, three contrasting build briefs, typed port/scheduling decisions
and held-out review cases are frozen in execution-contract.json. Frozen design
is not capability eligibility. Outstanding build gates include integrated catalog
compilation, concept contribution, comparative novelty, moving-load hardware
performance and complete lifecycle/recovery evidence. AAA presentation and
1,000 unique experiences remain unproven targets.

Campaign admission and acceptance remain disabled pending G01–G03. The contract now
distinguishes timely provisional qualification from later independent batch acceptance;
the publication runtime still needs that separation before any batch is enabled.
Three consecutive shared failures or non-improving repairs require diagnosis and
a verified shared correction; this recovery policy is specified but not yet wired
into all generation paths.

Rally development generation now resolves `pilot-options.json` with a deterministic
seed: three track shapes, two widths, three handling configurations and three
presentation sets. `kits/track-layout.mjs` supplies the same path to collision,
checkpoint placement and rendering. These combinations are not factory novelty
approvals. Personal bests compare identical course/rules and immutable runtime;
the browser review completes two runs with different braking, then checks restart
and reload persistence.

Failed development outputs can be inspected with `cli.mjs cleanup-failed --id ID`
and removed with `--apply`. Cleanup removes only the unreferenced failed launch
artifact, preserves its spine/composition/diagnostic images and never removes
shared runtimes. Passing previews, library references and accepted history are
protected. New failed CLI pilot runs invoke this cleanup automatically. Independent
review may reject a passing development preview through `rejectPreview` with
hashed evidence; this removes its card without pretending it passed factory review.

The new seeded Rally list path is available through `cli.mjs pilot --kind rally`.
The arcade library displays passing results automatically. The main Generate action
still uses the earlier platform development path; generic catalog integration and
its UI admission path remain foundation work.

Improvement rejects equal-score revisions and regressions, restores the best
configuration and its findings before proposing another change, and rejects
contradictory passing checks with unresolved findings. G01 completion checks the
full frozen plan rather than accepting phase labels alone.
