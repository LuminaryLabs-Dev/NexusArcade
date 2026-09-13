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
Challenge, seed and diagnostics are under Generation options. Keyboard input is
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
truncation can increase the individual output allowance when context space remains.
Image review uses one frame per call; a full context stops for input splitting
instead of repeatedly increasing an output allowance that cannot fit. Repeated ineffective
corrections stop. Cancellation, wall-clock rollback and expiry fail the attempt.

```sh
# Development probe; cannot grant factory acceptance.
node NexusArcade-Harness/cli.mjs generate --prefix probe --seed 97000

# Three reusable foundation pilot families.
node NexusArcade-Harness/cli.mjs pilot --kind transfer --id transfer-example --seed 97401
node NexusArcade-Harness/cli.mjs pilot --kind conduit --id conduit-example --seed 97402
node NexusArcade-Harness/cli.mjs pilot --kind rally --id rally-example --seed 97403

# A shared fix may create a new immutable revision under the original deadline.
node NexusArcade-Harness/cli.mjs pilot --kind transfer --id transfer-revised --retry-of transfer-example --seed 97401
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

The seeded pilot paths are available through `cli.mjs pilot` and the arcade Generate
action. The library displays passing development previews automatically. Generic
master-catalog integration remains foundation work.

Improvement rejects equal-score revisions and regressions, restores the best
configuration and its findings before proposing another change, and rejects
contradictory passing checks with unresolved findings. G01 completion checks the
full frozen plan rather than accepting phase labels alone.

G02 now has an executable typed behavior graph in `kits/domain-graph.mjs`.
Eight trusted domain definitions cover controls, delivery, membership conditions,
valves, combined conditions, reservoirs, checkpoints and objectives. Closed settings, port types,
required connections, unique writers, objective contribution and cycle ordering
are checked before assembly; explicit delayed values use the previous tick.
The three development pilots persist these graphs and execute them through a
local NexusEngine service kit. Movement, world/presenter selection and profile
mapping remain family-specific; this is not full master-catalog compilation.

The arcade Generate action now uses the typed pilot path. Its advanced Challenge
selector offers Surprise me, Rally racing, Cargo delivery and Flow puzzle; unused
complexity settings are no longer shown. New results have a Show new games action.
New player sessions renew from the arcade, expire after 60 seconds without renewal,
and cannot be resurrected by late renewal requests. Expired views pause and require
explicit reload. Older clients without leaseVersion 1 keep their original explicit
Back behavior until refreshed. Failed server-generated pilots use protected cleanup.

Transfer selects compatible room-door and cargo layouts from `pilot-options.json`.
Delivery membership opens bound shortcut doors. `kits/spatial-world.mjs` supplies
the same solids to rendering, body-footprint collision and route planning. Full
input-driven checks compare delivery orders and disable door opening to verify
that shortcuts actually contribute. Combinations without a measurable contribution
are excluded in the source list, not rescued by lowering the acceptance bar.
These checks demonstrate route/replay behavior; they do not establish collection
novelty, concept coverage or finished presentation. After shared generation source
changes, restart the server: new admission rejects a stale loaded generator.

`text-policy.mjs` enforces the user's excluded vocabulary locally. Model prompts
and schemas containing it fail before inference; responses containing it receive
generic correction without echoing the term. New library entries are checked;
historical titles using it are hidden and their playable endpoints are unavailable.
Historical artifacts remain intact. Automatic rolls choose flow or racing, and
the CLI defaults to racing. Transfer interactions remain explicitly selectable;
renaming a template does not establish new gameplay or novelty.
