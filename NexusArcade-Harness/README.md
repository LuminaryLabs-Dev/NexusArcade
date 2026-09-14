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

G03 independent review starts from the generated current packet at
`NexusArcade-Experiments/campaigns/reliable-arcade-factory/goals/G03/review-request-current.json`.
Refresh the current request from the active candidate index and evidence manifest
before starting review:

```sh
node NexusArcade-Harness/cli.mjs g03-review-request
```

The generated `review-request-current.json` is the authoritative packet for the
current source revision; an older request must not be used.
It lists the current provisional candidates and the six required facets: concept
causality, interaction novelty, visual novelty, presentation/audio, target-device
performance and human comprehension. Complete one verdict and at least one hashed
evidence reference marked `"independent": true` for every facet, then submit the reviewer packet with:

`REFERENCE_ONLY` artifacts may provide context but cannot support a `PASS` facet by themselves.

```sh
node NexusArcade-Harness/cli.mjs candidate-review --file /path/to/completed-review.json
```

The comprehension facet must include `observerType: "human"`; the target-device
facet must include a named `deviceProfile`.

Copy `NexusArcade-Harness/review-template.json` as the starting shape for a completed packet.

The validator checks candidate identity and source hashes and writes a G03 verdict;
it never accepts a game or changes the collection by itself. Missing evidence,
stale candidates or incomplete facets fail closed.

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

The seeded pilot paths remain available through `cli.mjs pilot`; Rally and flow
are also explicit arcade choices. The default button uses concept fragments. The
library displays passing development previews; full catalog coverage remains open.

Improvement rejects equal-score revisions and regressions, restores the best
configuration and its findings before proposing another change, and rejects
contradictory passing checks with unresolved findings. G01 completion checks the
full frozen plan rather than accepting phase labels alone.

G02 now has an executable typed behavior graph in `kits/domain-graph.mjs`.
Thirteen trusted domain definitions cover controls, delivery, membership conditions,
valves, combined conditions, reservoirs, checkpoints, objectives and conservative
flow sources, routers, links, storage and resource goals. Closed settings, port types,
required connections, unique writers, objective contribution and cycle ordering
are checked before assembly; explicit delayed values use the previous tick.
The three development pilots persist these graphs and execute them through a
local NexusEngine service kit. Movement, world/presenter selection and profile
mapping remain family-specific; this is not full master-catalog compilation.

The arcade Generate action defaults to Concept mix. Its advanced selector also
offers Rally racing and Flow puzzle; unused complexity settings are not shown. New results have a Show new games action.
New player sessions renew from the arcade, expire after 60 seconds without renewal,
and cannot be resurrected by late renewal requests. Expired views pause and require
explicit reload. Older clients without leaseVersion 1 keep their original explicit
Back behavior until refreshed. Failed server-generated previews use protected cleanup.

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
Historical artifacts remain intact. Automatic arcade rolls use concept fragments.
The pilot CLI still defaults to racing and retains explicit historical adapter
access. Renaming a template does not establish new gameplay or novelty.

Flow generation combines two station layouts with two bounded process presets.
The selector routes fluid through a short lossy branch, a longer efficient branch,
both branches, or neither. Each branch has its own valve; target and waste tanks
accumulate actual volume. Reaching the waste limit fails immediately. The shared
graph uses rates in litres/second and stored volumes in litres; duplicating a rate
output is rejected unless an explicit router divides it. Every tested tick accounts
for pumped fluid as stored target volume, waste or overflow.

`kits/flow-layout.mjs` supplies station footprints and presentation paths. Recessed
pipe visuals and moving pulses display graph state; they do not implement gameplay.
Personal-best review compares both routes under identical process rules and checks
their waste, timing, conservation, capacity failure and reset. World-label size is
checked separately from model image review. Model approval cannot override an
independent image rejection. These are development capability checks, not finished
concept interpretation, collection novelty or target-device qualification.

The flow lists calibrate setup distance against process loss: the short route
finishes faster but leaves less waste capacity for mistakes. The longer route
retains enough capacity to recover from a 1.5-second closed-valve mistake that
fails the short route. Browser review repeats that same mistake through keyboard
inputs on both routes. A route that wins both time and waste is not evidence of a
tradeoff; numeric presets alone do not establish distinct collection games.

Rally combines three circuits, two curved infield shortcuts, three handling
settings and two main-road widths. Checkpoints before and after the alternate
road are shared by both routes. Shortcut joins, rendered road strips, curbs and
collision support use `kits/track-layout.mjs`; car collision covers its tires,
lamps and body, including intermediate movement/rotation poses. Hold the brake
key to reverse when recovering from a road-edge collision.

The route matrix checks every retained combination: complete wide/shortcut laps,
at least 0.25 seconds and 1% improvement, 0.15m normal-route clearance, and a
matched steering error followed by input-driven recovery. Removing the shortcut
must block its former route while leaving the wide road playable. Browser checks
measure actual car dimensions, repeat both normal and mistake laps, and verify
records, pause, restart and reverse. These prove a reusable route choice, not
distinct collection games or full foundation acceptance.

Steering checks use the actual camera-right vector: D turns toward the right of
the chase view and A toward the left. World-space heading alone cannot prove
correct controls. Shortcut signs reuse bounded 220-by-55-pixel world labels and
hide outside the HUD-safe region. Independent image inspection remains necessary:
the local image model can invent route rules or misread progress even when its
verdict is PASS. Its observations do not establish gameplay correctness.

Catalog behavior compilation is available with:

```sh
node NexusArcade-Harness/cli.mjs compile-behavior --profile /path/to/behavior.json
```

The profile keeps `specificIntent` and `preparedInterpretation` separate. It
contains catalog decisions, chosen concept branches, domain instances and explicit
connections. Each instance declares `capabilityId`, `capabilityVersion`, closed
`settings`, a local-to-world `transform` (`x`, `y`, `z`, `yaw` in metres/radians),
and `sourceOptionIds`. Current spatial domains support the ground plane; other
heights are rejected. Logical domains retain placement metadata without claiming
that it changes their numeric behavior.

`domain-bindings.json` maps supported catalog options to trusted domain types and
their parameters. Ignored parameters, unsupported branches and unattributed
behavior are errors. `kits/domain-composition.mjs` transforms spatial settings and
compiles the existing typed graph. The registry currently binds redirection,
continuous flow, one-target flow completion, ownership transfer, accumulation,
stream routing and dependency-unlocking concept branches. Unmapped catalog
options remain implementation gaps.

The output is `BEHAVIOR_COMPILED`, with `eligible: false` and `fullGame: false`.
It lists missing game decision points, required capabilities/rules and unverified
concept witnesses. A port changing is not automatically a proven concept: retain
a normal run and a meaningful counterfactual before qualification. The eligible
entry point additionally uses the existing catalog source/evidence gate; these
development bindings do not bypass it. Generic presentation assembly,
complete-game checks and factory admission still require integration.

Independent concept roots can be rolled before choosing their interpretation:

```sh
node NexusArcade-Harness/cli.mjs roll-concepts --list /path/to/concept-list.json --seed 5
```

The list contains `optionIds`, `count`, and `depth`; for example, two roots from
`concepts.growth`, `concepts.exchange`, and `concepts.dependency`, at depth 2.
The result retains the input/catalog hashes, selected roots, available child
interpretations and any unresolved depth boundaries. It never substitutes a
supported root for a harder rolled root. The default arcade button matches these rolls to the shared
`concept-fragments.json` through `concept-recipe.mjs`. Its current coverage is a
small flow-system collection; root pairs do not establish unique games.

During the unfinished foundation, append planned catalog options without
rewriting earlier planning evidence:

```sh
node NexusArcade-Harness/cli.mjs catalog-update --catalog /path/to/proposed-catalog.json
node NexusArcade-Harness/cli.mjs catalog-update --catalog /path/to/proposed-catalog.json --expected-hash <reviewed-from-hash> --apply
node NexusArcade-Harness/cli.mjs catalog-update --resume
```

The first command reports the exact additions and contract hashes. Apply requires
an idle writer, no open idea windows, valid original phase evidence, no accepted
history and no completed foundation Build/Review. It only appends unqualified
options, interpretation alternatives and missing capabilities; existing settings,
rules, ordering and implementation references cannot change. A receipt retains
the original specification and queue snapshot. A pending journal blocks factory
work until its catalog, example-profile hash and queue writes finish. Resume
verifies known before/after contents and only recovers migration locks whose
process is confirmed dead. Unexpected edits or unrelated locks stop recovery.
Queue reads and transitions verify the receipt chain. Earlier checks keep their
original hashes; nothing becomes eligible or accepted. Changes to existing
capabilities, and migrations after accepted history exists, still require a
separate dependency-scoped revalidation path.

`compile-scene --profile /path/to/scene.json` connects compiled catalog behavior
to the shared simulation. Its closed profile contains `version: 1`, `behavior`
(the profile above), `movement`, `collision`, and `session`. The result includes
the validated `runtime` consumed by `createSceneEngine` in
`kits/scene-runtime.mjs`. It reports `SCENE_RUNTIME_COMPILED`, never eligibility.
The adapter settings are explicit development inputs; their catalog bindings
and proof remain required before production selection.

Movement is `walk` with `settings.speed` in metres/second, or `steering` with
`maxSpeed`, `acceleration`, `braking`, and `turnRate` in metres/second,
metres/second squared, and radians/second. Both declare a ground-plane `start`
and initial `heading`. Walking pairs with shared solid-world collision; steering
pairs with explicit road polylines and a vehicle footprint. Unknown settings,
unsupported combinations and unsupported spawn positions reject. Swept collision
checks the body between successive positions.

The session declares `durationSeconds` and boolean `failurePorts`. Every domain
with a `failed` output must bind it. A declared failure takes priority over a
simultaneous success, and timeout ends an unfinished session. The shared API owns
start, pause/resume, reset, input edges, bounded events, and per-session records.
Snapshots are detached from authoritative state. Existing pilots use a small
compatibility wrapper; their Three.js presenters still require conversion to
generic domain-driven presentation. Runtime tests alone do not prove that step.

When a browser review fails, it retains the last completed check and attempts a
bounded screenshot/UI-state capture. Those diagnostics keep the failed verdict;
they are not a substitute for completing the playthrough. Retry clocks remain
anchored to the original idea.

World labels are hidden when their screen rectangles overlap the vehicle's
projected bounds. The route reviewer checks that exclusion after each driven
simulation step. Image review still checks actual readability; numeric bounds
alone cannot establish a clear composition.

Concept recipes and bounded model output

```sh
node NexusArcade-Harness/cli.mjs compile-concepts --recipe NexusArcade-Harness/concept-fragments.json --seed 5
node NexusArcade-Harness/cli.mjs scene-concepts --recipe NexusArcade-Harness/concept-fragments.json --seed 5 --id my-concept-preview
```

A concept recipe contains `version`, `seed`, `concepts` (`optionIds`, `count`,
`depth`), a root-free `base`, and `fragments`. Each fragment has an `id`,
`when: {all: [], none: []}` and ordinary recipe `choices`. The harness validates
all fragments, rolls roots independently, matches conditions, then assembles the
selected choices. The scene compiler requires executable witnesses for every
rolled concept. Unsupported combinations fail without substituting easier roots.
No fragment may override the roll. Source input and matched IDs are retained for
reproduction; the model does not write executable scripts.

Current fragments combine optional reserve staging, paired spatial permission
controls, route selection and source rates. They demonstrate composition, not
broad genre coverage or collection novelty. The default button uses this path;
Rally and the earlier flow challenge remain in the advanced selector.

`access-fragments.json` is a separate development composition: WEST opens access
to QUICK (three presses, shorter travel) or DETOUR (one press, longer travel).
Either middle control enables the final gate; the exit still requires player presence.
It exercises growth as expanded reach and dependency as combined prerequisites.
Inspect it with `node NexusArcade-Harness/cli.mjs compile-concepts --recipe NexusArcade-Harness/access-fragments.json`.
It contains one room sequence, not a broad family catalog, and is not selected by
the default button. Gate `openWhen` references must name boolean domain outputs;
the same state drives collision and rendering. The scene writer preserves the
catalog-selected palette. Runtime and image checks do not grant factory acceptance.

Validation plans can add `alternatives: [{id, steps}]` alongside their primary
`steps`. Up to four unique alternatives are allowed; nested plans, duplicate IDs,
duplicate step lists and unsupported actions reject. Runtime preflight and browser
review execute every route and its omitted-interaction control. Browser checks
also verify best-time comparisons and reload after the alternatives. These results
demonstrate tested paths, not automatic proof of meaningful replayability.

Scene generation passes compiled concept witnesses to runtime preflight. Each
witness must change during successful play. Preflight then freezes each claimed
domain at its initial outputs and repeats the demonstrated routes; at least one
route must fail. A changing but redundant domain is rejected. This diagnostic
option is unavailable in generated composition data. It establishes domain-level
route dependence, not individual-port causality, semantic interpretation, visual
quality, or full acceptance. Optional strategies need not affect every route.

`scene-model-contracts.mjs` restricts scene titles to supported choices and preserves
the declared goal in model output. Image review returns geometry visibility, label
readability and player visibility; uncertain facts fail the preview check. The
harness derives the verdict instead of accepting free-form gameplay claims.
A full-frame player uncertainty can request an additional unmodified crop from
the actual actor screen bounds. The full image, crop, bounds, original facts and
resolved facts remain recorded. Explicit failures are never overridden by the
detail check. Independent image inspection and all factory gates remain required.

The shared player marker identifies the avatar while avoiding actor and control
labels. Arcade cards show three lines of instructions so Play stays prominent;
the full instructions remain on the game start screen.

Scene previews use a structural gameplay signature for identity. It canonicalizes
domain capabilities and settings, typed connections, spatial solids, validation
routes and camera while ignoring titles, labels and palette-only changes. This
prevents relabeled or cosmetic variants from evading duplicate checks; visual and
interaction novelty still require their independent review evidence.
