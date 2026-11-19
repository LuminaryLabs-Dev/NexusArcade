# Capability leads

## Runtime, composition, lifecycle

- `LuminaryLabs-Dev/NexusEngine` — README describes manifest-owned Core atoms under `src/core-domains/`, semantic exports, deterministic composition planning, runtime lifecycle, realtime, and sequence. Inspect `docs/CURRENT-ARCHITECTURE.md`, `docs/KIT-OWNERSHIP.md`, and actual manifests before admitting capabilities.
- Drive: [Four-layer architecture](https://docs.google.com/document/d/16kJuJvOxD3Q9rUse7zSTJt8lzjCqPs1bG9rnjcjX4Rw/edit) describes Domain authority, optional Kits, finite Sequences, and serializable Game AST. Historical September 4 chat record, explicitly partial; proposed Sequence behavior was unverified then.

## Reusable optional kits

- `LuminaryLabs-Dev/NexusEngine-Kits` — catalog confirms 140 records: 23 official, 14 candidate, 8 scaffolded, 95 migration placeholders. See `capabilities.jsonl` for exact entry and proof paths. Official status is not behavioral proof: the lock-and-socket implementation gap is detailed in `findings.md`.
- Current Kits documentation retires ProtoKits, while Experiments still describes pinned ProtoKit consumption. Treat version migration as an explicit compatibility question.

## Traversal, route progress, combat and pressure

- `LuminaryLabs-Agents/NexusEngine-Experiments`: `experiments/next-ledge/` (grapple, stamina, recovery, route/cargo); `experiments/sora-the-infinite/` (flight); `experiments/fogline-relay/` (scan, zones, pressure); `experiments/zombie-orchard/` (survival); `games/signal-bastion/` and `games/rogue-lite-hellscape-siege/` (defense, waves, currency, recovery). Source paths exist in a complete recursive tree. Next Ledge route/cargo behavior and several other game loops have source-level implementation reviews (findings.md passes 77, 84–91, 116–118). Consumer/version compatibility remains open; Zombie Orchard imports 12 legacy factory names absent from the pinned current Engine entrypoint, and its ProtoKits alias is unresolved. The separate AAA batch is a local Canvas2D host, not Nexus 3D gameplay.
- `apps/` and `experiments/` contain many matching names. Do not count both as different games without inspecting wrappers and canonical manifest.

## Generation, deterministic validation and promotion

- `LuminaryLabs-Agents/NexusRealtime-Sandbox`: `Core/`, `Progressors/`, `SandboxBuilder-V1/`, `SandboxBuilder-V2/`, `NexusRealtime-KitSandboxer/`. README separates procedural presentation work from renderer-free domain composition. Reuse candidates: host mapping, deterministic tick proof, run-local candidates, explicit promotion.
- `LuminaryLabs-Agents/NexusRealtime-Ideas`: tree confirms `harnesses/cascadeseeder-lite/`, `ideas/CodexIdea-Harness/`, and scope groups for atomic domains, families, composite loops, host bridges, render descriptors, incubation, and promotion. Implementation not yet inspected.

## Presentation, flight and world generation

- `LuminaryLabs-Publish/TheOpenAbove`: code-search excerpts confirm Three.js imports in `src/visual/airstream-trails/three-airstream-trail-adapter.js`. Complete tree confirms dedicated runtime, world, visual and provider folders. Candidate seams include flight, wind, airstream trails, terrain, vegetation, and renderer recovery; Package and lockfile confirm Nexus dependency; flight/world/provider ownership still needs deeper verification.

## Non-Nexus Three.js candidates

Wrong Floor owns its deterministic rules locally and explicitly defers NexusEngine integration. LittleReef and MushyCore have inspected local gameplay/Three.js code; their qualification and reusable seams are in `findings.md`. The name-only candidate `LuminaryLabs-Dev/threejs-arena-2026-07-04t02-36-17-312z` has only `QTDT_WORKFLOW_RESULT.json` in its complete default-branch tree. Do not present this repository as containing a playable game.

## Implication for the Roller

Keep random selection separate from capability admission. A selectable record needs immutable source identity, implemented factory/API, parameter contract, state owner, connector compatibility, reset/replay behavior, and evidence scope. Jev or another bounded decision model can select among those verified records; selection does not prove implementation or playability.

## Additional grounded extraction paths

- Agriculture/transactions: MyCozyIsland src/adventure/composition-runtime.js, official agriculture-domain-kit.
- Navigation/locomotion/persistence: AcrossTheCanopy source/src/game/nexus-runtime.js plus its Drive Composition Guide.
- Truck dynamics/streaming/contracts: TheLongHaul src/game/*-kit.mjs and src/app/bootstrap.mjs.
- Local tactics: TheCavalryOfRome strategic-board-game-loop-kit.js; migrate through an adapter rather than assuming its local runtime is the shared Engine.
- Fixed-camera scenes/hotspots: TheUnmappedHouse src/stage-kit.js and src/story-data.js.
- Procedural trees/object descriptors: Agents/NexusEngine-TreeFactory src/vendor/nexus-kits.js and src/domain/tree-object-contract-adapter.js.
- Read findings.md for entrypoint qualifications, source pins, repeated builds and weak proof gates.

## Historical and additional source lanes

- Keep Unity sequences, Dart, Rust/Avalonia V1, NexusJS ECS, EngineWeb Lite and current JS Core-domain contracts separate. See findings.md and repository classifications.
- Combat/territory/progression: Battle-Clash src/composition/create-battle-clash.js and src/domains/.
- Movement/growth/inhabitation: NexusEngine-Yarnasaurus kits/yarnasaurus-game-domain-service-kit/.
- Mining/extraction/match flow: NexusEngine-GoldRush src/kits/goldRushRuntime.js and local domain kits.
- Fishing/rescue/tide/weather: NexusArcade-Private vendored fishing/reef-rescue kit and builds/reef-rescue/game.js.
- Typed factory resolution: NexusEngine-Editor src/adapters/installed-nexusengine.js.
- Semantic observation/action: BattleClash-Player src/adapters/browser-page.mjs; preserve game authority.
- Recursive evidence-to-domain tooling: NexusEngine-KitUniverse workflow_harnesses/ and NexusRealtime-Automations tools/. Historical Drive kit counts are not verified inventory.
- Non-Nexus Three.js: NexusPrototypes orb-runner and bird-explorer variants; local game rules must be adapted rather than relabeled.

## Additional extraction candidates (recursive audit)

- **Transit and progression:** OligarchOverflow product-funnel kit; preserve Engine resources/events, reset and snapshot contracts.
- **Movement and defense:** Portfolio Storm Root dash, pulse, pursuit/contact damage and relic-gated exit; local Three rules need extraction into semantic kits.
- **Feedback and atmosphere:** KoolVFX configurable particles/lighting/camera and personal Website harbor rendering; presentation adapters, not game rules.
- **Pet simulation:** TomogatchiWeb3 local hunger/happiness decay and seeded visual trait selection; separate persistence from Polygon wallet/contract adapters.
- **Harness acceptance:** NexusAgent missing entrypoint despite success report demonstrates need for source closure checks before semantic/browser proof.
- **Historical sequencing:** Unity consumers and April12 Drive doc are a distinct lineage; do not assume current JS adapter compatibility.

- **Terrain/climate/materials:** WorldFactory shared/world-generator.js pure recipe functions; WorldGen generate-world.ts plus Engine ECS terrain locomotion provide a separate runtime integration example.
- **Asset authoring:** Botany tree/LOD export, Aviation validated flight descriptors and ShaderFactory GLSL recipes are provider candidates; custom-code execution needs explicit isolation before untrusted generator use.

## Additional reusable boundaries from source tracing

- **Optics and routing puzzles:** Lightspeed-Glass core trace/intersections + Three adapter. Validate nested media, total internal reflection and mesh-update parity before promotion.
- **Procedural asset lifecycle:** NexusFactory-Kits contracts/domain/phased-kit. Reuse parameter categories, constrained rerolls, invalidation and artifact type; distinguish GLB geometry from PNG textures.
- **Closed action vocabulary:** GlootieAR blueprint validator/action-runtime. Extend via typed spatial adapters; avoid allowing prose to imply runtime behavior.
- **Rule-layer diversity:** TheCountryClubWeb five Canvas2D modes and x402-MOBA local combat loop. Port rules into seeded, authoritative semantic domains separately from rendering/network transport.
- **Breeding/lineage:** LittleReef source leads remain valuable; tracker sandbox completion is not live acceptance. Capacity, saves and state authority must be resolved at the extraction boundary.
- **Historical spatial UI:** ProjectArrowhead opt-in XML/ECSR menu and routing. Verify handler ownership and version compatibility before treating it as a current Engine kit.
- **Evidence automation:** nexusheadlessplayer can capture genuine input or mutate state via evaluate; classify the proof mode explicitly.

## Collection-derived extraction priorities

- **Traversal:** Private the-infinity-bean-stalk grapple/release and industrial-overgrowth-flight boost/upgrade rules; local Three code needs semantic extraction.
- **Handling and service:** Private deep-replacement-games crane, elevator, seed delivery and triage branches. Extract target selection, capacity, conservation, deadlines and seeded identities; preserve genuinely different rules instead of counting wrapper hashes.
- **Scan and unlock:** Experiments fogline-relay-kit range/facing/hold progress, gate chain, patrol/chase/contact damage. Already wrapped as a Nexus runtime kit; reconcile supporting Engine version.
- **Survival and construction:** Zombie Orchard Engine kit stack; Hellscape local harvest/build/wave runtime. Treat them as different integration states.
- **Presentation:** Cozy cloudbar landform/clearance/grass/smoke/camera rail and Meadow terrain/lighting are reusable renderer/provider candidates, not complete games.
- **Admission classification:** Distinguish executable semantic behavior, local extraction candidate, descriptor-only readiness and metadata-only claims. Source hashes prove identity, not gameplay diversity.

## Readiness and version boundaries

- **Descriptor vocabulary:**14 inspected readiness families supply reusable marker/layout/scoring ideas. Extract these as presentation or planning lists; require separate semantic implementations for crafting, healing, purification, rescue and delivery.
- **Strategy rules:** Cavalry local adjacency, army strength/losses, reinforcements and action budgets offer a concrete deterministic domain candidate. Decouple DOM/global state and confirm end conditions before promotion.
- **Compatibility identity:** source commit + public API + provider/version must accompany each domain. Engine main and Private vendored APIs differ;71 shared route entries depend on unexported timing names.
- **Evidence routing:** distinguish source-present, import-compatible, semantic-test-passed and player-proven. Only the first two can be assessed within this connector-only audit, and compatibility is incomplete where alternate hosting/version paths are unknown.

## Additional reusable mechanisms from Lite and Portfolio (pass10)

Source receipts and caveats: findings.md, section Nested Lite and Portfolio source audit. All are static candidates, not installed Nexus domains.

| Domain seam | Concrete source | Extraction requirement |
| --- | --- | --- |
| Sequence memory / timed input | thecrimsondeveloper/Portfolio: Portfolio-Vite/Pages/arcade/lantern-rift-lab/lantern-rift-lab.js; Pages/arcade-runtime.js echo/rhythm/pulseGrid | Seeded sequence, explicit reveal/input/end phases, normalized keys, cancellation/reset |
| Capture with decay / stealth | Portfolio: Pages/rooftop-while-guard-break/game.js updateRelics/updateEnemyVision/updateGoal | Hold/decay rates, sensing vs occlusion, alert ownership, capture and ending events |
| Contact deflection | Portfolio: Pages/pier-spin-swarm-break/game.js updatePlayer/updateEnemies | Timed ability state, collision authority, impulse/stun outcome, cooldown reset |
| Disk traversal / zone hazards | Portfolio: Pages/dock-spin-swarm-break/game.js updatePlayer/updateSlices | Surface membership, vertical state, hazard wedge coordinates, target gating |
| Current steering | Portfolio: Pages/arcade-runtime.js harbor | Input attraction, velocity/current integration, pickup progress and complete velocity reset |
| Inventory-key spatial activation | LuminaryLabs-Dev/NexusAgent: NexusAgent-Lite/projects/20260625-052920-build-the-foundation-slice-of-the-house-be/src/game/puzzles.js | Inventory consumption/idempotence, actual collision gate, save-to-scene reconstruction |
| Voxel terrain/catalog | NexusAgent: Lite070458 src/world/{terrain,chunks}.js and src/items/catalog.js | Static terrain and item data only; mining, placement, simulation and crafting are missing |
| Parametric orbit editor | NexusAgent: Lite081020 src/solar/scene.js and src/ui/panels.js | Single state owner, radius units, rebuild/disposal, import validation; editor is not a complete game |

Drive Architecture Index and Evidence Standard support using executable contracts above success labels and descriptive seed data. The table identifies extraction work; it does not claim integration or runtime validation.

## Procedural world and maze extraction leads

| Candidate | Source | Required extraction boundary |
| --- | --- | --- |
| Curve-constrained placement | thecrimsondeveloper/Website: factory/harbor-world-3d/src/layout.mjs | Seeded sampling, terrain/spacing constraints, explicit unsatisfied-placement result; preserve stable quality prefixes |
| Deterministic world assets | same: src/factory.mjs, terrain.mjs | Parameter validation, generator version/hash, stream identity and export dependency provenance; current reroll is global |
| Raycast collection and respawn | same: src/components/shader-renderer/three-backend.js | Separate collection state/timers from meshes, localStorage and animation; test actual browser input later |
| Maze topology and traversal | MuseumMultiverse-TheLostPages: src/domains/{canvas-maze-map,map-character,maze-goal}/service.js | Seeded cells/openings, normalized commands, collision authority, goal/reset and input-size validation |
| Placement/unfold gating | same: src/domains/character-map-experience/service.js | Explicit wall/unfold/move/goal phases; cancellable timing and full reset |
| Snapshot-driven world presentation | NexusWorldGen: src/runtime/nexus-world-runtime.ts; src/render/build-world-scene.ts | Engine state/scan pulse drives Three instancing and camera; retain host/device evidence boundary |

Lost Pages' descriptive timing, angular alignment, moving-target, exposure and socket options must remain gaps until their state transitions exist. Source-backed maze/placement patterns can become choices in recursive lists; a model's selection cannot turn forwarding facades into implemented mechanics.

## Additional extraction leads from pass 12

| Domain | Source owner | Reusable boundary | Gate before reuse |
| --- | --- | --- | --- |
| Generated space/residency | HorrorCorridor: definitions.ts + corridor/places.ts | Seed/index geometry; resident set; shared collision/navigation descriptors | Seam traversal both directions; threat retention; long-route indexing cost |
| Pursuit | HorrorCorridor: dread/stalker.ts | Injected route provider; dt movement; repath; reset/snapshot | Obstacle/path agreement and fair player response |
| Experience sequencing | HorrorCorridor: sequences/placeExperience.ts | Ready/entry/departure events and checkpoint prefix replay | Idempotence and reset with authoritative domain state |
| LOD/assets | NexusEngine-LOD-Showcase decoded payload | Screen-size selection, hysteresis, mesh/splat batching, GLB normalization | Separate local WebGL2 implementation from actual Nexus adapter; measured images/performance |
| Lane avoidance | NexusCentral historical intake | Lane intent, obstacle progression, collision and run state | Fix restart visibility, frame-based score, seeded spawning and disposal |
| Orchard simulation | ZombieOrchard local kits | Command/state ownership with renderer outside rules | Canvas2D source; any3D presentation is new work |

List-driven generation should select from verified capability contracts, while preserving explicit unsupported gaps. A typed router can choose a known adapter or diagnostic branch; neither typed choices nor a large seed space proves the selected behavior exists.

## Long Haul and flight extraction candidates

| Boundary | Implementation pointer | Parameter axes actually connected or proposed | Required extraction proof |
| --- | --- | --- | --- |
| Vehicle dynamics | TheLongHaul/src/game/truck-kit.mjs + truck-dynamics-profile-kit.mjs | Actual steering/grip/braking/suspension/air/roll profile | Same inputs through real Engine scheduler; surface agreement; reset |
| Route discovery and destination checks | course-kit.mjs + delivery-kit.mjs | Actual explored edges, candidate depot set, one accepted destination | Duplicate/invalid checks; multi-stop remains a separate capability |
| Run economy and recovery | run-kit.mjs + score.mjs; app chunks7/8/17 | Actual time/distance/condition penalties and one-use recovery | Move host rules into owner; terminal-state admission; exact pause policy |
| Seeded road graph | generator.mjs + shared.mjs | Actual branch lengths/curves/surfaces, valid depot, hazards | Reject intersections; preserve seed streams; adjacent macro portal agreement |
| Near/far world | streaming-policy.mjs + world-feature-adapter-kit.mjs + chunks5/12–17 | Active cells, frontier order, terrain features, LOD | Pin final override order; bind prepared/active/realized frame; budget |
| Flight gates and upgrade choices | NexusBuilder/.../SkyhookRunnerReact/src/App.jsx | Seeded gates/hazards and modifiers | Fix results loop, exhausted upgrades, end condition and visual/collision alignment |

For a list/router contract, distinguish **declared**, **consumed by executable rules**, and **verified in a consumer**. The first two can be inspected here; the third requires separately authorized runtime evidence. A model selecting “multi-stop” must receive an explicit gap until a real progression owner consumes the stop count.

## Private RPG and action-world extraction leads (pass14)

All pointers below are in LuminaryLabs-Dev/NexusArcade-Private/NexusArcade-V1/builds/. See findings.md for pinned compatibility and authority limits.

| Domain seam | Concrete owner | Extractable mechanism | Required boundary before reuse |
| --- | --- | --- | --- |
| Quest and dialogue | aether-threads-rpg/modules/QuestSystem.js, DialogueSystem.js, InteractionSystem.js | Quest phase transitions, proximity/edge input, queued text | One state owner, cancellation, reset, renderer-independent events |
| Patrol sensing | same modules/NPCSystem.js, StealthSystem.js | Bounded wander and distance alert | Seed wandering; declare radius-only sensing; add occlusion separately |
| Locomotion and recovery | _site/vendor/nexusrealtime/src/action-movement-kit.js, character-ragdoll-kit.js | Terrain movement, jump/glide/dash, knockdown/recover | Resolve missing consumer exports; isolate zone naming; input/time/reset contracts |
| Camera clearance | same src/character-camera-kit.js, camera-occlusion-kit.js | Follow/framing, terrain samples, sphere exclusion | Distinguish floor safety from target visibility; complete camera binding |
| World dressing | same src/forest-placement-kit.js + riftwarden-wilds/forest-scene.js | Seeded route/slope-constrained descriptors and Three projection | Complete cache dependencies; update existing descriptors; dispose removed geometry |
| Procedural animation | riftwarden-wilds/character-animation.js | Joint clips blended by movement/recovery state | Explicit rig/clip contract; not a skinned-asset or physics-ragdoll claim |
| Objective composition | vendor combat/companion/shrine/corruption kits + riftwarden-wilds/game.js | Small state machines plus host-owned sequence | Remove duplicate authority, physical arrival/hit contracts, timestep semantics |
| Curve road placement | drift game's road-system.js | Spline ribbons and ECS item placement | Connectivity graph, actual collision/property consumers, seed-aware topology |

For a future typed selector, attach implementation scope to each choice: timer arrival, radius sensing and procedural keyframes are distinct capabilities from navigation, line-of-sight and articulated physics. Preserve unknown/unsupported outcomes instead of treating a familiar kit name as implementation evidence.

## LittleReef capability candidates (pass15)

Source owner: SoftStrangeStudio/LittleReef. Exact pin and design correspondence are in findings.md.

| Domain | Reuse source | Executable structure | Gate before extraction |
| --- | --- | --- | --- |
| Procedural creature assets | src/nexus/fish/{generator,geometry,textures}.js; fish/NexusFishFactory.js | Definition -> anatomy/appendages/face/surface -> Three model | Map bodyFamily to speciesFamily, connect finScale, validate traits and asset lifecycle |
| Inheritance/lineage | fish/FishGenome.js; breeding/BreedingService.js; fish/FishService.js | Seeded trait selection, numeric blend, mutation, ordered parents and generation | Atomic eligibility/capacity/schema checks; version rules; reconcile documented no-mutation baseline |
| Spatial steering | control/{ControlledFishController,SwimVolume,RoutePlanner3D,ObstacleAvoidanceSolver}.js | Pointer target plane, bounded volume, one-obstacle detour, local avoidance | Multi-obstacle route validation, stable state authority and input replay |
| Schooling/physics | fish/FishBehaviour.js; physics/FishPhysics.js | Separation/cohesion and Cannon body steering | Move render-read state to simulation owner; timestep/reset and collider agreement |
| Follow camera | control/FishCameraRig.js | Horizontal heading and stable vertical framing | Visibility/occlusion and bounds; source fixtures are not browser proof |
| World assets | reef/coral/{CoralAssetLoader,CoralPlacement,CoralField}.js | ActualGLB loading, seeded18-anchor placement, proxy obstacles | Shared-resource ownership, bounds/scale constraints, source/export provenance |
| Traversable geometry | reef/rock-arch/{RockArchFactory,SymmetricArchPath,RockArchNoise}.js | Symmetric path extrusion, seeded strata, opening metrics, refcounted cache | Run geometry gate, expose genuinely consumed parameters, collision/passage tests |

A compact recursive-list contract can reuse definition -> generator -> placement -> behavior -> objective boundaries. Record which parameters reach each consumer; hashes and trait labels alone can conceal ignored values. The Drive coral generator is an additional art-generation lead, not a gameplay domain or proven source of the repositoryGLBs.

## Prototype flight, collection and atmosphere candidates (pass16)

| Domain | Source owner | Reusable mechanism | Admission boundary |
| --- | --- | --- | --- |
| Flight | NexusPrototypes/bird-explorer/src/components/BirdModel.jsx | Pitch/yaw, speed, Rapier velocity, chase camera | Timestep-based startup, pose authority, actual terrain collision, reset |
| World residency | bird-explorer/src/systems/impl/{ChunkSystem,TerrainSystem}.js | Neighborhood events and pooled terrain meshes | Seeded shared surface, configuration binding, mount-before-events, collider parity |
| Recursive composition | bird-explorer/src/systems/{SceneController,impl/PrefabSystem}.js | XML commands, sequences and nested entity descriptions | Parsed values must reach consumers; trigger dispatch, IDs, cycle limits and reversible lifecycle |
| Pickup pressure | NexusPrototypes/orb-runner-three/src/game/{world,loop}.ts | Seeded arena, input motion, pickups, multiplier decay and timed end | Input edge order, failed-placement handling, disposal and replay goals |
| Camera terrain clearance | NexusPrototypes/Ref/terrain.html | Five-point height clearance and three-stage transit | Heightfield-specific, not spherecast/visibility proof; seed and timestep |
| Atmosphere | NexusPrototypes/Ref/weather.html | Day keyframes, humidity, precipitation and wind visuals | Separate clock/state/render; deterministic reseed, complete reset/disposal |
| Path animation | RhymeStudyGuide/src/domains/atmosphere/{flock-path,flock,foreground}.mjs | Shared path, facing/bank and wingbeat with two renderers | Preserve renderer distinction, host visibility binding and real visual checks |

For a future typed decision tool, roll only **declared implemented operations**, then check actual consumer edges: parsed child -> instance -> render/collider -> event -> consequence. A schema-valid prefab, event name, score label or passing math test does not prove that chain. Malformed agent variants are failure examples for audit classification, not new capabilities.

## Agent routing, recovery and evidence — pass17

NexusAgent owns three distinct candidates:
- `A1-Harness/{registry,commands,core}`: compact action menus and versioned planning/review prompts; draft-only execution limits.
- `LiquidUniversal-Harness/{core,conversation,orchestrator}`: typed decision/fallback states, capability routing and recursive work decomposition; caller-supplied trust and incomplete evidence/budget binding require repair.
- `BonsaiPro-Harness/core/{state-store,artifact-store,orchestrator}.mjs`: durable action attempts, immutable receipts and crash recovery; controller lease/deadline/semantic completion need stronger gates.

Collapse these into **decision routing**, **durable execution**, and **evidence admission**, not three duplicate game engines. Required seams: action IDs -> registered implementations; profile hash -> exact artifact; tool result -> observed validation; all descendants -> one deadline/accounting ledger. See pass17 in findings.md and pinned receipts in sources.jsonl. No model/game/runtime executed.


## Pass 18 additions: interaction, encounter and presentation contracts
- **Selection/menu:** LittleReef `src/selection/SelectionService.js`, `src/menu/{MenuTankScene,TankDiveTransition}.js` — entity picking and camera transition; Settings dispatch, reset and teardown incomplete.
- **Encounter orchestration:** HorrorCorridor `src/game/domains/dread/{index,encounterPacing,encounterSelection,stalker}.ts` — seeded warnings, pursuit and response phases. Five movement modes/three responses under124 content profiles; beam occlusion is absent from composition contact check.
- **Presentation:** HorrorCorridor `src/providers/{threeScene,spatialAudio}.ts` and `src/content/corridorContentRouting.ts` — procedural mesh/material/audio libraries. Rich facade path bypassed by active composed renderer; mesh profiles do not imply interactive mechanics.
- **Recovery/network:** HorrorCorridor `src/providers/persistence.ts`, `src/game/domains/shared-expedition/index.ts` — transaction-complete saves and revisioned replication; fallback reconciliation and independent client control remain gaps.
- **Reusable review protocol:** Drive HorrorCorridor Playtest and Acceptance Plan distinguishes current-build technical evidence, player-view review, headphone review, unique coverage and regression neighbors; planned protocol only.

## Pass 19 additions: pinned Core World, camera and graphics boundaries
- **World composition:** NexusEngine@b941c9b `src/core-domains/core-world-domain/kits/world-builder-runtime-kit/index.js` owns phased synchronous providers, capability dependencies and rollback. Async work belongs before activation.
- **Preparation:** `preparation/world-patch-preparation-controller.js` owns queued patch descriptors; concurrency/time bounds, pending cancellation and exact snapshot restoration are not supplied.
- **Camera:** `src/core-kits/core-camera-kit/smoothing.js` offers portable smoothing/slerp/FOV/snap state; renderer application and collision remain external.
- **Rendering preparation:** `src/core-kits/core-graphics-kit/instance-batches.js` owns cell descriptor diffs and overflow reporting, not GPU submission. Fresh-host restore requires upload reconciliation.
- **Repeat suppression:** `src/core-kits/core-transaction-ledger-kit/index.js` owns synchronous in-memory operation receipts; do not advertise durable/atomic transactions from its name.

## Pass 20 additions: native ECS prototype boundary
NexusBuilder `NexusBuilder/01_EnvironmentAndToolchain/NexusWorld/nexus_world/src/nexus_engine/` supplies standalone Rust component/event stores, RON scene loading, Rapier stepping and tweens. It is neither the current JS NexusEngine nor a Three.js game. The active egui cube preview does not render ECS terrain; LOD lifetime, mirrored component authority, collision shape and scene-loader dry-run need repair. Reuse as historical design input, not a ready Arcade adapter.

## Pass 21 additions: terrain, pursuit and evidence classification
- **World streaming:** NexusBuilder `14_FinalReleaseGate/WorldChase/components/game/{Terrain,Chunk,Foliage}.tsx` supplies a bounded25-chunk render window, procedural terrain and foliage instancing. Add shared sampled height/collider authority and valid instance counts before reuse.
- **Pressure/progress/reset:** WorldChase `Player.tsx`, `Chaser.tsx`, `store/useStore.ts` are negative examples: requested velocity is counted as progress, slower pursuer cannot catch, scalar reset omits physics state. Adapter contracts should require observable displacement, reachable failure and full reset ownership.
- **Menu/assets:** `03_FullImplementation/RustInfiniteScroll3DMenu/src/engine/` contains descriptor/queue/selection patterns only. No GPU upload/model-loading capability established.
- **Evidence routing:** startup logs, placeholder scanners and historical ACCEPTED text must remain distinct from implemented interactions and runtime proof. Preserve this classification when feeding compact audit records to future decision models.

## Pass 22 additions: branching narrative and bounded composition
- **Narrative state:** NexusBuilder `14_FinalReleaseGate/StoryEngine/src/components/editor/Play/PlayTab.tsx` owns snapshot-based choice traversal; `src/utils/Exporter.ts` duplicates it for exported DOM play. Missing cycle budget, reset queue cleanup and entity rendering prevent direct promotion.
- **Sequence composition:** `03_FullImplementation/NexusEngine2D/app.tsx:807` implements nested linear/all/any control sequences and entity tween scheduling. Extract only with cancellation, bounded recursion and typed condition/state semantics. It is not interchangeable with StoryEngine's assignment-based schema.
- **Name-based false positives:** Rust2DEngine/Avalonia2DEngine/Flutter2DEngine mainly provide application/login scaffolding. Keep them searchable as historical sources without advertising rendering or gameplay adapters.

## Pass 23 additions: pressure loops and presentation admission
- **Single-action pressure:** NexusBuilder `01_EnvironmentAndToolchain/OneButtonDrift/{GameState.cs,MainWindow.axaml.cs}` supplies gravity impulse/cooldown, gap collision, passed-obstacle scoring and difficulty ramp. Port the concepts through Nexus domains; define restart seed/gravity semantics and align collider/display size first.
- **Post effects:** `01_EnvironmentAndToolchain/PostProcessing/src/renderer/` supplies GLSL threshold/blur/ACES reference code with broken orchestration. No direct reusable runtime adapter established.
- **Visual capability admission:** Drive0.0.9 scope/map require provider-linked capture and measured cost, quality tiers, cleanup and temporal review. Status is Proposed; these requirements guide extraction but do not certify source.

## Pass 24–25 additions: procedural voxels and event composition
- **Voxel generation:** NexusBuilder `01_EnvironmentAndToolchain/VoxelWorld/crates/voxel-terrain/src/lib.rs` has seeded fBm height/cave/material sampling. Bind one voxel schema/index order to a real mesher and renderer before claiming an Arcade capability.
- **Residency:** `voxel-world/src/{store,coord}.rs` supplies cache/pin/key concepts; repair pinned-overflow deadlock, read recency, concurrent loads and coordinate aliasing first.
- **Event/scene composition:** UnitBuilding `src/Managers/{LevelManager,EventEffectManager,EffectScheduler,SceneManager}.cs` separates authored descriptors from scheduling. Backend realization is mostly record/log stubs; expose that as a gap instead of accepting a receipt as visible gameplay.
- **Objective evidence:** UnitBuilding's event-count-based challenge success is a useful negative case for automated acceptance. Require a player action and measured consequence, not successful event generation alone.

### BreathingWalls — pulse, obstacle response and lifecycle

Reuse lead: `NexusBuilder/01_EnvironmentAndToolchain/BreathingWalls/GameState.cs` separates pulse signal, wall response and collision consequence. A future NexusEngine domain could reuse this separation after implementing seeded spatial layout, objective reachability, deterministic pulse catch-up, resize subscription cleanup and held-input reset. Keep the later `03_FullImplementation` scalar prototype separate: it does not supply spatial movement and its fast tests do not exercise pulses. Require identical event cadence in fast and live modes before using timing-test results as acceptance evidence.

### Native arena/campaign sources — reusable structure and acceptance traps

- Source: NexusBuilder `03_FullImplementation/NexusPygameNeonArena_v2/{main.py,campaign_pack.py}`. Extract the concept of explicit phase entry/clear, a per-phase objective, parameterized enemy health/speed, and a shared action record. Reimplement against NexusEngine lifecycle/scene contracts; these are native Pygame sources, not drop-in adapters.
- Reward semantics need an actual state effect independent of the phase index. Pulse/storm pressures need spatial events, not just a contact-damage multiplier. Preserve surviving enemies on replenishment and distinguish cumulative score from phase-local progress.
- Source: identical `CloudHopperReleaseCandidate/main.py` and `DepthOfDiscovery/main.py`. Movement-style selection changes executable motion, but other catalog IDs often remain descriptions. Every catalog claim needs a behavior owner and an observable contrast case.
- Require input-only completion probes. Do not accept tests that write score, heal the player, resurrect loss or infer movement from status changes. Check every printed assertion against the final gate. Save acceptance must exercise gameplay-triggered write, reload, world state and resumed objective; a file-existence check is insufficient.
- Drive `0.0.9 — Release Readiness` reinforces matched-scene/hardware visual and resource evidence, with all current release gates explicitly unassessed. LittleReef frozen progression offers discovery-led goals as design input, with unresolved pacing/economy retained as gaps.

### Native storage, materials and simulation extraction leads

- **Material contract:** `NexusBuilder/04_CompleteUXFlow/PBRMaterials/src/MaterialConfig.cs` and `ShaderEditor.cs` offer descriptor/registry shapes only. Before promotion, require real compilation, visible material contrasts, missing-fragment rejection and color-preserving serialization. Pixel-buffer length does not prove rendering.
- **Particles:** `02_ArchitectureAndScaffold/ParticleSandbox/src/renderer/` describes buffer/compute/draw boundaries but supplies no running implementation. Keep these entries as requirements, not available adapters.
- **Sparse voxel access:** `03_FullImplementation/VoxelSandbox/VoxelSandbox/Domain/` supplies chunk indexing and negative-coordinate conversion. Add read-without-allocation, residency ownership, dirty mesh updates and render/collision linkage before engine extraction. FIFO queue helpers need handler, lifecycle and failure bounds.
- **Autonomous spatial processes:** `04_CompleteUXFlow/AntColonySim/src/` has concrete rule candidates for seeded substrate, digging, carrying, bounded route search and phase-driven settlement. Preserve actual quantities in transport; separate queued mutations from immediate state changes; define tick/population limits. Source currently has a compile blocker and no complete game objective.
- **Profile coverage:** AntColony's accepted-but-unused ROM fields reinforce the need for a field-to-behavior map. A typed profile is not a complete composition when goals, species settings or material layers are discarded during config conversion.
- **Cross-consumer evidence:** Drive0.0.8 proposes proving shared fixes in distinct games with separate device/workload budgets and return-to-baseline checks. Preserve that as proposed validation guidance; no release or current provider proof is attached.

### Animation, graphics and authoring — bounded extraction candidates

- **Playback:** NexusBuilder `01_EnvironmentAndToolchain/SkeletalAnimation/SkeletonState.cs` separates clock, pause, frame-step and pose/clip evaluation. Extract against explicit rig topology and coordinate contracts. Require per-track timing/interpolation, rest transforms and correctly bounded buffers before claiming general glTF support. Canvas bone lines are not mesh skinning.
- **Graphics lifecycle and feedback:** `CubePulse/{Managers,Systems}/` connects registered systems and GL resources to click feedback. Preserve framebuffer ownership and teardown; use validated time steps, frame-independent damping and camera bounds. Local classes named Nexus/Engine do not establish shared NexusEngine integration.
- **Shadow boundaries:** `CascadedShadows/Utils/CSMUtils.cs` is a small range/index math lead. Renderer promotion requires actual subclass wiring, distinct camera-frustum slices, valid light/sampler uniforms, correct draw ranges and the host's framebuffer/viewport contract.
- **Spatial authoring:** `ModelMaze/Core/` offers circle bounds and move-toward primitives, not obstacle pathfinding. Validate constructor invariants, transform spaces, collision continuity and exact persisted coordinates before using these contracts in composed games.
- **Finite decisions need executable evidence:** FlappyBird's event emission, ModelMaze's positive movement unit cases, and a shadow-pass class name cannot certify a game loop. A future list-based matcher should retain unsupported status until the selected capability has an active consumer, observable consequence and lifecycle proof.
- **Drive authoring alignment:**0.0.7 proposes common domain/Kit/Sequence/data contracts and literal/headless independence. Keep these as planning requirements; current source import/export bugs show why schema-valid output alone is insufficient.

### Agent simulation, biome rules and XR adapter boundaries

- **Agent sensing and control:** NexusBuilder `04_CompleteUXFlow/EmergentAgents/rust_core/src/simulation/` offers five-ray sensing, a small deterministic neural forward pass and bounded-population evolution. Keep observation, policy, movement constraints and fitness separate. A sensor intersection does not implement collision; generation count does not demonstrate learning.
- **Observer independence:** EmergentAgents' render-triggered simulation and unleased buffer are counterexamples for a future provider. Require one simulation clock, immutable or leased observer snapshots, explicit model/seed identity and reset. UI interaction must not silently add world ticks.
- **Biome composition:** `03_FullImplementation/SkyhookRunnerWorldchain/pygame_isometric_biome/{world,systems}.py` directly connects list choices to speed/yield. Pair resource depletion with explicit world-state transformations and bounded residency; preserve modified tiles across unloading. Native isometric rendering requires a separate Three/NexusEngine adapter.
- **XR capability levels:** `RealityWorkshop/crates/xr_core/src/lib.rs` supplies actual loader/system discovery. `OpenXR_Demo/src/lib.rs` supplies telemetry descriptors only. Track discovery, graphics binding, session lifecycle, swapchains, frame submission, actions and device proof individually; a lifecycle label or build-success log cannot stand in for the next capability.
- **Finite coordination:** Drive0.0.6 separates Sequence from domain execution. A future deterministic/low-thinking decision step should choose supported operations, preserve instance/node identity and await receipts; it must not treat a chosen action label as an executed action. Continuous game behavior stays in its owning runtime domain.

### Generation control, artifact acceptance and workflow browsing

- **Candidate execution:** LMStudioCodeGen separates generation/staging/execution/apply interfaces, but currently executes the old target then applies the untested candidate. A reusable build domain must bind each check receipt to the exact staged file hashes and propagate failed steps into admission.
- **Decision versus proof:** AlwaysPassGate and NexusStageManager's colored validation nodes show why a decision label cannot be a validation result. Jev/low-thinking choices may select checks; domain-owned checks must produce their own evidence.
- **Preservation and replay:** Extract overwrite policy and path validation concepts from TempDirSwapBatchWriter, not its atomicity claim. Preserve recovery data until rollback is confirmed; retain unique run identity, model receipt, profile hash and candidate identity.
- **Manifest routing:** NexusStageManager offers a compact stage/action-to-workspace table and bounded manifest scan. Keep source provenance and detect conflicting IDs; impose the same traversal/containment bounds on profiles and output browsing. Its UI is not an execution scheduler.

### Builder-Lite: deterministic expansion before model generation

Source: NexusBuilder `NexusBuilder/14_FinalReleaseGate/NexusBuilder-Lite/app.jsx`, `engine/validate.js`, `docs/library_seeds/IdeaEngine.json` (pass42). Reuse candidates: list-to-step expansion, manifest templates, bounded context extraction, small text validators. Require inherited loop context, global work bounds, immutable decisions and failure-propagating receipts before reuse. No game compiler, domain adapter registry or playable preview is supplied here.

AcrossTheCanopy's Drive Game Systems Master offers **design candidates**, not implemented adapters: traversal/carry constraints; body attachments versus container cells; route availability; heat/airflow as separate pressure variables; machinery latency and warning propagation. Trace any future implementation to engine ownership and direct evidence; do not count these specifications as current capabilities.

### AgenticRebuilder: reference shapes only

Source: NexusBuilder `NexusBuilder/03_FullImplementation/AgenticRebuilder/src/domain/entities/` and `infrastructure/services/FileIOManager.ts` (pass43). Source-file status and plan-dependency fields are architectural examples; browser FileReader is concrete. Do not reuse its mock inference, random terminal log, metadata-only ZIP or completion status as engine capability/evidence. Missing import paths prevent treating the collection as an assembled application.

### AutoSelfExpansion: bounded writer context and failure receipts still required

Source: NexusBuilder `NexusBuilder/04_CompleteUXFlow/AutoSelfExpansion/App.jsx` (pass44). Reusable concepts are distinct thinker/writer endpoints, next-cycle output feedback and editable memory. Current dispatcher changes action order, omits READ_FILE and treats error comments as generated artifacts. A trusted domain-tool executor would need ordered actions, one live run, authoritative results and durable revisions; this prototype supplies none of the NexusEngine runtime adapters.

### NexusBrain: composable records and worker boundary, not validated evolution

Source: NexusBuilder `NexusBuilder/04_CompleteUXFlow/NexusBrain/src/hooks/useAgentBrain.js` (pass45). Distinguish persona prompts, executable tools, lessons and pipeline definitions. Before reuse, wire the driver, validate tool payloads and dependency ownership, execute explicit functions, feed failed receipts into the next decision, and persist revisions. Current code has no verified capability promotion or game assembly; Canvas2D particles are presentation decoration only.

### Browser inference and catalogue enrichment (passes46–47)

NexusBuilder `WebLLM_Demo/index.html` offers worker-load/progress/stop UI patterns, with session and failure handling gaps. `LargeSpeciesTrainer/src/App.tsx` offers source-labelled taxonomy enrichment and explicit fallback records. These are candidates for **model-provider tooling** and **data-catalogue preparation**, respectively. Neither implements a NexusEngine game domain. Ecological inspiration from species descriptions must remain separate from validated movement, food-chain, habitat or simulation behavior.

### ConverterEngine-CLI: unify contracts before any reuse

Source: NexusBuilder `NexusBuilder/04_CompleteUXFlow/ConverterEngine-CLI/` (pass48). Candidate patterns: one model-provider port, typed step/log records, separated generation stages and artifact packaging. Current Python files are fenced snippets; interface/config/map mismatches and a mock entrypoint prevent assembled behavior. Treat extraction as future implementation work, never an already functioning deterministic harness.

### ConverterEngine React: transformation orchestration

Source: NexusBuilder/04_CompleteUXFlow/ConverterEngine/App.jsx at862ce825. Candidate reuse: editable categorical presets, staged source-to-plan workflow and artifact tree/ZIP. Add schema/path/dependency checks, durable ownership, bounded requests and real build/playtest gates before reuse. This is neither an engine domain nor evidence of generated-game correctness. Drive product-loop guide supplies proposed contract criteria; preservation tracker supplies historical leads only.

### ConverterEngine-DotNet: orchestration and persistence boundaries

Candidate source: RefactoringOrchestratorService.cs, LlmApiAdapter.cs and JsonConfigurationRepository.cs under NexusBuilder/14_FinalReleaseGate/ConverterEngine-DotNet at862ce825. Reuse ideas: feasibility before planning, explicit result propagation, cancellation-aware service ports and error translation. Existing layers disagree; launcher-only build and tests of local substitutes do not validate these components together. No game capability supplied.

### Audio and orbital presentation extraction candidates

- AudioNavigator/Services/SpatialMixer.cs: source-sample mixing, constant-power pan, distance gain, mute/solo and meters. Port math and source contracts to an engine audio domain only after sample-rate, thread ownership, lifecycle and serialization fixes; no device or3D/HRTF proof.
- NexusAgentThreeJsShowcase/src/engine/renderer.ts and game/world.ts: procedural mesh/material/light composition. shared/time.ts supplies delta-aware damping; engine/input.ts supplies edge-trigger snapshots. Add full seeded state, pause/reset/disposal contracts and an actual player objective before gameplay reuse.
- IdeaBuilder and NexusAgentTemplateShowcase: workflow/UI references only. Prompted recursion and explanatory template counts are not implemented combinatorial traversal or build capability.

### Native prototype fragments: simulation, interaction, presentation and authoring

- Simulation: SimTicker/SimulationEngine.cs supplies clone/snapshot/hash ideas; fix history-reset and bounds identity before claiming reproducibility. ShadowOffset DelayPipeline supplies tick-indexed delayed effects; require queue bounds, cancellation/reset and reentrant-dispatch handling.
- Interaction/progression: NeuralNest parent-child growth and threshold ending; PromptPet staged appearance. Neither establishes semantic model interpretation, varied player decisions or replay.
- Presentation: DiceOracle decelerating reveal; BreathBox smoothstep phase cycle; PixelPulse click pulse/glitch. Port as configurable, seeded, cancellable effects with shared engine time; these native2D implementations are not Three.js domains.
- Authoring: SystemMap Models.cs/MainWindow.axaml.cs contain nodes, boundaries, links and region views. Missing declarations, stale deletion references, weak drag/selection and no persistence prevent treating it as a working domain editor. BlueprintPulse is a malformed transport scaffold; preserve contract ideas only.

### Native builder: attempt staging and application

NexusBuilder/14_FinalReleaseGate/NexusBuilder/ViewModels/ShellViewModel.cs separates staged artifacts from explicit apply and opt-in overwrites with backups. Candidate shared harness pattern only: run writes task descriptions, not code; nested steps/model providers are unwired. Require upfront canonical path validation, immutable run inputs, unique attempt IDs, content receipts and transaction/rollback before reuse. ZipProvider finalization order, nonpersistent provider settings and weak model-test success criteria are explicit repair leads.

### Tool dispatch, passive discovery and animal-state leads

- Unity_Demo/server.js + unity_interface/UnityInterfaceBridge.cs: allowlisted per-target queued actions and main-thread dispatch. Reuse only after exact action/sender identity, cancellation acknowledgement, typed inputs, bounded waits and verified editor outcomes; late results currently can finalize another job.
- Unity_Demo/lib/mcp/browser-harness.js: real click/read/screenshot operations. Make completion depend on correlated terminal semantics; current selftest collects outcomes and can overlook failed/absent targets. Keep structured evidence compact and stdio logs separate.
- Unity_Demo/lib/scanner: observation -> entrypoint -> evidence references -> integration suggestions -> diff. This resembles the desired list-driven expansion, but fixed confidence scores and inferred action hints must not stand in for executable adapters. Windows/Linux are metadata-only; macOS controls aggregate by role.
- EscapeTheCoop custom ChickenScripts: state dispatch and NavMesh destination ideas only. Moststates arestubs, coop sampling returnszero, networkbroadcast disabled, scene bindings stale. Validate own behavior and vendor ownership before extracting an animal/domain pack; no completegame counted.

### Scanner evidence quality and UI state (pass62)

Unity_Demo offers a reusable observation/dossier UI pattern, not executable capability certification. Its saved scan contains40 missing-value shortcuts scored0.88;77 high-value menu routes lack matching desktop execution. Require valid locators, exact target identity, implemented action contracts, correlated terminal receipts, escaped observation labels and independent checks before Jev/list selection. Legacy Python vision/input is mock-only. Preserve incomplete status and historical-vs-live evidence explicitly. See findings pass62 and source receipts.

### Request admission and terminal evidence (pass63)

ThroughputApi Core/RequestConcurrencyGate.cs is a source-backed lease/timeout/cancellation pattern for bounded active work. Its API/worker/CLI are not a connected processing pipeline; recovery is an exception record, not restore/replay. Require bounded waiting, per-operation deadlines, explicit terminal failure and cancellation/lease tests before reuse. Keep this infrastructure domain separate from gameplay and deterministic simulation.

### Artifact execution and preservation boundaries (passes64-65)

NexusResearcher contributes phase/step/artifact UI vocabulary; all research/build steps are template writers and model probes are local syntax checks. SmartFileSystem contributes real C# scan→candidate→cart→preflight→confirmation→outcome code, but size/extension groups are not confirmed duplicates and ZIP completion precedes no restoration check. Reuse requires real operation receipts, content hashes, verified-finalized archives before removals, durable partial-operation journals and one authoritative configuration. Rust init/version probes are not scanning engines.

### Immutable preflight and honest completion receipts (pass66)

SmartFileSystem demonstrates why a cart-version flag alone is insufficient: asynchronous preflight stamps mutable current state, and controls allow edits during work. Lock/hash the complete input snapshot through confirmation and execution. OperationTimer disposal emits completed on error/cancel, so success must come from typed terminal outcomes, not event names. These are reusable negative cases for low-thinking/Jev routing and archive tools.

### Spatial orientation and deterministic list processing (passes67-68)

- ConstellationAppBasic `components/sky-canvas.tsx` / `lib/astronomy.ts`: spherical projection, target highlighting and catalog line patterns can seed navigation/sky domains. Validate time/visibility math, circular angle smoothing and sensor coordinate frames first; heuristic confidence and transient mark-found do not prove accuracy or gameplay.
- Acronym `Core/CommandManager.cs` / `Workers/SearchWorker.cs` / `Workers/MergeDedupeWorker.cs`: bounded FIFO dispatch, normalized exact/prefix/substring ordering and per-source identity suit deterministic catalog retrieval. Add immutable source revisions, load-before-persist ordering, source-change result invalidation and explicit terminal errors before harness reuse. Empty import/export and favorites surfaces are negative capability examples.

### Ingestion provenance and list-driven discovery (pass69)

GrantHarvestDesk supplies weighted target lists, JSONL subprocess events, canonical URL dedup and ranked review/export. Extract these as data/tooling patterns, not gameplay adapters. Its synthetic live-failure fallback, invented normalized fields, processing-time verification stamp, stale export settings and dispatch-only success are concrete negative cases for Nexus evidence gates. Require preserved unknowns, sample/live tags, per-source field receipts, immutable run IDs/configurations and confirmed terminal outcomes before using these patterns in recursive domain assembly.

### Domain availability versus generated specification completeness (passes70-71)

AudioNavigator_Init/BreathingWalls_Init/CascadedShadows_Init are empty module shells; use existing non-Init audit entries for actual behavior. UniverseSim supplies design contracts for deterministic state stepping, reference integrators, partitions and GPU upload; VoxelFable supplies candidate inventory/social/magic categories. Neither is an implemented adapter here. CanopyRelicRaid and Cortex packet filler, copied UniverseSim stage documents and RustVortex graduation claims are concrete negative cases: validate content, implementation ownership and lifecycle wiring rather than headings, stage labels or generated success text.

### Small-list interaction and build-artifact gates (pass72)

CounterApp/MoodLantern/QuoteVault contribute minimal click→state→visible-feedback examples and fixed-list cycling/selection. They are native UI demos, not game families. Before reusing persistence or packaging patterns, bind actions to immutable selected values, acknowledge only confirmed writes, serialize saves and verify complete runtime dependency closure. QuoteVault's early SAVED stamp and the three scripts' apphost-only exports are source-grounded negative cases.

### Actor identity, agent receipts and third-person extraction (passes73-74)

- Engine src/core-domains/actor: reusable creature→character→player registries, possession and generation counters. Resolve body/rig providers and enforce policy separately; coordinate cross-domain restore/reset.
- Engine src/core-domains/agent: observation/proposal/receipt vocabulary only. Repair closure/base-state divergence, observation identity, mutation-before-validation and accepted-by-default records before using as durable harness memory.
- Engine domain-kit/foundation: portable state and idempotency hashes are useful strict-tool foundations. Require synchronous typed outcomes or explicit awaited completion; manifest reference strings and generic schemas are insufficient acceptance.
- Experiments ThirdPersonFollowThrough/kits: camera lag and metric-ray adapter are local Three extraction candidates. Static rig markers, incomplete reset and missing legacy imports limit reuse; renderer-owned controller state must not become a second domain authority.

## Interaction and composition additions — passes75–76

| Reusable area | Source location in NexusEngine | What to extract / boundary |
| --- | --- | --- |
| Input and interaction intent | src/core-domains/interaction/input/ and interaction kits | Descriptor normalization and priority; device input and dispatch still host-owned. |
| Requests and completion | src/core-domains/interaction/ request-queue / request-fulfillment kits | Time/state operations and receipts; add caller-owned arrival/eligibility checks before treating completion as gameplay success. |
| Assistance and transfer | src/core-domains/interaction/ assistance / transfer-zone kits | Urgency, attachment references, type/capacity/dwell; no complete carried-object motion or once-per-subject transfer policy. |
| Cross-domain effects | src/core-domains/interaction/ adapters | Explicit request/transport/economy bridges; partial child changes need coordinated recovery. |
| Dependency composition | src/core-domains/composition/kits/composition-registry-kit/ | Registry/tree validation and deterministic plan order; no authored action→objective wiring. |
| Reviewed application | src/core-domains/composition/services/composition-apply-controller.js | Plan/executable fingerprints, host snapshots and rollback; host identity, concurrency and crash consistency remain separate proof obligations. |
| Compact model tooling | src/core-domains/composition/adapters/mcp/composition-mcp-provider.js | Targeted atom/recipe discovery and chapter resources; open object schemas and failed-tree error handling need scrutiny. |
| Authored causal game data | Drive: Point-and-Click V0 — Master Architecture (1tJoZLCXyoEnj1hz5qR6JpEGeEAohKl1jknM1GYBALmo) | Design lead for stable IDs, typed conditions/declared operations, cancellation, save order and consequences. Six-scene AST is proposed, not a verified engine feature. |

These are source/design extraction leads. Read receipts and exact hashes are in sources.jsonl; detailed limits are in the Engine repository record. No runtime or release promotion.

## Additional experiment boundaries — pass77

- **BirdRun:** experiments/BirdRun/ → local Canvas2D lane/motion/course descriptors. Rescue-window reachability and persistent failure are absent in the inspected composition; not a demonstrated reusable rescue game.
- **Mana Rift:** experiments/domain-mana-rift/ + experiments/_shared/scoped-domain-three-composer.js → Three.js and legacy ProtoKit shims. Forecast/ward/evacuation descriptors are a separate wall-clock-driven overlay, not player-driven state.
- **Source dependency closed in pass78:** all13shared-composer ProtoKit imports at0.0.2are read; keep them separate from current semantic Engine contracts.
- **Active search work:** remaining-audit.md owns the concise editable checklist; source receipts remain authoritative for what has actually been read.

## Legacy operations suitable for extraction review — pass78

- **Combat/state:** ProtoKits0.0.2 enemy-object/body/agent, damage-health, guard, parry-window, mana-meter and status-effect each provide local state APIs. No automatic shared-world wiring, current Engine contract or complete combat loop is established.
- **Placement/spatial:** vegetation-placement, route-clearance, terrain-ground-contact and world-zone provide individual geometry/query operations. Caller must compose route+overlap+ground checks and drain/bound event history.
- **Interaction:** interaction-domain-kit defers target/action validation to a tick; it neither enforces proximity nor executes objective effects.
- **Generation design:** Drive World Generation Rules describes volumetric fields, structural failure/deadwood, ecological succession and geography-driven settlements. Retain as game-owned procedural recipes, not implemented Engine APIs.
- Pin/path receipts in sources.jsonl; detailed dependency limits in the ProtoKits repository record. The active checklist now advances beyond this13-file import scope.

## Compact inference workflow patterns — pass79

NexusSkyServer's alternate main branch contains a reusable workflow AST, named transient slots, shared serialized model scheduling, backend transport interface and observable stage events. Exact paths: server/harness/contracts.py, server/harness/engine.py, server/runtime/scheduler.py, server/runtime/sessions.py and server/inference/base.py.

Treat these as source patterns requiring adaptation: JSON fallback is not typed semantic validation, ephemeral sessions are not campaign checkpoints, per-call limits are not whole-idea deadlines, and fake-backend tests are not model or game proof. Trace the README's LiquidPro-Harness attribution before counting this as an independent architecture. Full28-file receipts and detailed limits are recorded; no game-domain adapter is supplied here.

## Orchestration and authored-flow distinctions — pass80

- **LiquidPro core/chain:** compact prompt fields, explicit injection, named workflow slots, queued call metadata and a shared trace service. Acceptance is text/shape-level; do not inherit it as game acceptance. Proposed NexusRealtime tick supervision is absent from the inspected tree.
- **SkyServer comparison:** same broad layering, different implementation and routing policy. Keep one conceptual pattern with two source variants rather than claiming two independently proven game builders.
- **GoldRush design:** game-owned risk/extraction/mining/physical-value rules sit above generic state, interaction, presentation and replay contracts. Current document authority is not implemented feature proof.
- **Canopy Phase1design:** optional finite Sequence coordinates Before/During/After and Linear/All/FirstSuccess/FirstFinished/Choice through explicit operations/receipts; domain owners do the work. Frame-driven flow and authored loops are expressly excluded by this design. Exact current Engine correspondence remains to verify.

## Bounded list composition lessons — pass81

LiquidPro's complete chain/workflow source provides actual sequence/switch/loop/reference/join execution over named slots. Its shipped definitions demonstrate how a short outer list expands into up to28model calls; that is catalog arithmetic, not a quality or timing result.

For Nexus composition, preserve explicit node identity, inputs, outputs and traceability. Require child success as well as semantic acceptance; namespace/export memory deliberately; retain iteration-specific receipts; count the full expanded workflow before dispatch. Reply-shaped text and nonempty joins are insufficient for game acceptance. The fixed story recipe's unused page plan illustrates why rolled/planned data must be traced into subsequent behavior.

## Batch evidence and grapple-domain leads — passes83–84

- **Generation validation:** LiquidPro commands/benchmark-goal-audit.mjs and orchestrator-harnesses/orchestrator-batch.mjs supply manifest/review/promotion patterns. Require expected-run counts, mandatory metric evidence, live model/input/source identity and immutable review revisions; existing success labels are insufficient.
- **Semantic input:** ProtoKits protokits/action-input-kit/index.js owns held/axis/aim/object-intent state. Correct multi-binding/source release semantics and verify actual event scheduling before generic reuse.
- **Traversal and progression:** protokits/next-ledge-grapple-kit/index.js implements seeded routes, momentum swing, ballistic grapple/cable catch/reeling, stamina/rest and sector states. Split these only after preserving their causal loop; current branded kit is not a set of independently proven generic domains.
- **Presentation:** Experiments games/next-ledge-grapple/src/game.js is a small Three.js snapshot renderer and explicit input wiring example. XY gameplay with3D meshes; lifecycle, asset disposal, mutable dependency URLs and combined-kit validation remain open.


## Pass85–86 reuse refinement

- **Runtime event contracts:** current Engine preserves subscriber-produced events for the following tick; the mini helper discards them. Integration needs explicit latency and real public-package identity. Tick receipts do not promise rollback or complete dirty tracking.
- **Spatial risk/reward:** Next Ledge's base session implements swing/probe/reel/rest and consequential safe/pressure branches in local closure state. Treat this as a game-owned implementation candidate, not proof those rules already reside in reusable domain kits. Trace pinned settings kits and active cargo wrapper before extraction.
- **Evidence-led promotion:** GoldRush distinguishes historical references, game-specific rules, generic Core and approved runtime assets. Its tracker keeps maturity separate from required evidence. Reuse these boundaries; do not import contradictory DEC-007 workflow as current authority.


## Pass87 — Route, resource and pressure candidates

- **Procedural route geometry:** seeded Bezier/linear anchors and analytic projection are implemented. Final adapted-route connectivity, obstacle clearance and reachable gameplay remain unproven.
- **Traversal catalog:** eight tether/camera/vitals/recovery kits own settings only. Extract executable rules from the game session separately; do not equate provides tags with simulation.
- **Resource service:** real registry, passive rates, thresholds, locks and snapshot restoration. Add explicit spend affordability and actual-delta receipts before treating it as an economy transaction primitive.
- **Pressure service:** real bounded channels and passive transitions. Direct adjust/recover skips threshold events; failure is recoverable. Game consequences need explicit wiring.
- **Route ledger:** current sequential cursor conflicts with out-of-order completion and ignores required flags. Branch completion needs a coherent prerequisite policy before reuse.
- **Cargo composition:** wrapper is event-to-ledger/display synchronization. It does not gate the base game on cargo acceptance or pressure failure; its snapshot calls mutate auxiliary engines. Named local fractal trees describe fixed descriptor factories rather than recursive procedural generation.


## Pass88 — Presentation extraction boundary

- **Descriptor consumption:** cargo and guidance descriptors reach fixed particle effects, but most semantic parameters are ignored. Visual-fractal outputs have no consumer in the main renderer chain. Catalog size is not visible diversity.
- **Guidance:** confidence, release timing, line-of-sight and failure-floor signals are heuristic calculations; use authoritative gameplay predicates before presenting them as predictions.
- **Style and depth:** parallax offsets and style resolution exist as reusable data logic. Profile defaults/inheritance and actual renderer bindings need reconciliation; current host mostly hardcodes materials/fog and omits tile/occlusion/target-style application.
- **Reusable host candidates:** dynamic line buffers, contextual camera framing, event-linked light/scale/audio motifs and geometry metrics. Require bounded effects, one clock, restart identity, cancellation and complete disposal. Source implementation is not measured fidelity or runtime proof.

## Pass89 — Reuse boundaries

- LiquidPro: registry-derived controls and captured request payloads are reusable interface patterns; checked-in web execution is incomplete because /api/runs is absent. Keep CLI and Web evidence separate.
- Canopy: seven design outlines offer candidate domain relationships (equipment limits traversal, weather changes routes, NPC knowledge changes destination interest). They do not establish adapter contracts or runtime support. Require explicit owner, state transitions, data bounds and validation before catalog promotion.

## Pass90 — Cavalry extraction candidates

- **World/strategy:** campaign map owns Voronoi territory construction, biome recruitment, action refresh, draft transfer, weighted combat and rival decisions. Fixed size-derived layout; graph adjacency, selection rendering, victory semantics and conservation need correction before reuse.
- **Presentation/diagnostics:**17campaign/orders/logistics descriptor buckets, consumed by two local Canvas2D overlays. Supply, siege and winter names describe advice; no corresponding resource/siege/attrition state machine in this scoped chain.
- **Ownership:** Engine namespace imports are unused by the two overlay implementations; pure kits and campaign reducer are local code. This is a source of candidates to promote, not proof those capabilities already belong to NexusEngine.
- **Validation:** six direct smoke files cover shape/markers/counts; no live CDN/input proof. Evidence: repositories.jsonl:cavalryCampaignSourceAudit and pass90source receipts.

## Pass91 — Tactical and procedural rendering candidates

- **Tactical rules:** reuse explicit hex reachability, terrain stops, ranks/range and AP actions only after consolidating the two independent controllers. Current later controller lacks automatic victory scans and full restart.
- **World/render:** domain-warped terrain, biome coloring, river/brush ribbons and primitive soldiers are local handwritten WebGPU candidates, not Three.js or verified Engine domains. Extract seed, buffer budget, disposal and hit-test contracts.
- **AI:** embedded ONNX scoring is attempted; fallback is distance plus randomness, despite a memory-retrieval label. Preserve provenance and verification levels.
- **Evidence:** literal source-marker tests are stale; imported metadata reports with hardcoded success are not measured fidelity. See repositories.jsonl:cavalryTacticalHostSourceAudit.

## Pass92 — Spatial, Host, Policy and Diagnostics

- **Spatial:** reuse numeric math and explicit proximity queries; define axis conventions, degenerate inputs and action-to-scale wiring before promotion.
- **Host GPU:** reuse logical identities, usage union and lifecycle bookkeeping; separate this from native provider acquisition, completion, resource-content recovery and cancellation.
- **Policy:** base kit stores rules/descriptors; a real evaluator and enforcement owner are still required.
- **Diagnostics:** reuse normalized visual-debug packets and scoped clearing. Keep measurements and validation receipts separate from unverified caller payloads; bound payload size and accumulated descriptors.
- Source/test boundaries and pin: repositories.jsonl:spatialHostPolicyDiagnosticsAudit. No runtime or hardware validation.

## Pass93 — Reusable orchestration and network primitives

- **Asset:** keep descriptor identity, provider job ownership and runtime value readiness separate. Reuse dependency sequencing/cache ports after adding cycle checks and completion generation guards; do not infer ready-to-render from a receipt.
- **Foundation:** seeded selection and caller-clock state can support the Arcade roller. Validate restored RNG state, preserve ledger history and constrain replay inputs before treating them as durable deterministic infrastructure.
- **Network:** reuse explicit session transitions, packet sequences and timing estimates as pure data logic; add transport and authoritative state application through an owning adapter. These source contracts do not prove a multiplayer game.
- Details and source pin: repositories.jsonl:assetFoundationNetworkAudit.

## Pass94 — Runtime extraction boundaries

- **Startup:** reuse explicit preparation/launch records; require attempt-bound reports and fresh renderer/input evidence before Arcade acceptance.
- **Schedule:** reuse caller-clock recurrence after preserving custom first-run time and bounding catch-up work. Occurrences still need gameplay consumers.
- **Transaction:** separate duplicate-command receipts from actual effect commit; current applyOnce has no rollback or async reservation.
- **Data:** named random streams and package schemas can support compact game profiles. Preserve full service checkpoints, reject unsupported schema semantics and bind validation evidence to exact content and owner.
- **Persistence/lifecycle:** descriptor and installation ledgers are not disk saves or a complete playable lifecycle. Source details: repositories.jsonl:runtimeDataStartupAudit.

## Pass95 — Orchestration, execution and tool boundaries

- **Sequence:** reuse frame/event primitives and explicit node plans; enforce validation before deployment and define cancellation/reset semantics before treating named nodes as gameplay.
- **Compute/model:** reuse graph order and injected execution ports. Keep native providers and model loading in their owning adapters; bind asynchronous results to the active request/generation.
- **MCP:** reuse explicit registration and protected-tool approval. Do not treat the partial schema dialect as full type safety or a metadata snapshot as executable recovery.
- Keep graph validation, actual execution, completion evidence and recovery as separate claims. Full source pin and paths: repositories.jsonl:sequenceComputeMcpAudit; no code or tests executed.

## Pass96 — Reusable spatial and presentation pieces

- **Object/Placement:** stable descriptors plus grounding/anchor-fit math can support seeded scene assembly. Bind placements to object content and explicitly apply them through renderer/physics adapters.
- **Camera/Output/UI scale:** reuse follow/framing/smoothing and viewport calculations. Keep sample acquisition, input binding, renderer mutation and resize wiring with the consumer.
- **Graphics:** reuse material/LOD/pass contracts and instance deltas. Require valid graphs, supported resources and an initial upload after restoration before accepting rendered behavior.
- **Capture/Speech:** reuse provider jobs and request records; verify actual outputs and protect cancellation/reset from late completions before using their ready statuses in acceptance.
- **Sky/Audio/Animation/UI:** descriptor vocabularies need real rendering/playback/layout consumers. These are expandable inputs, not automatic high-fidelity output.
- Detailed pinned source boundaries: repositories.jsonl:objectPlacementPresentationAudit.

## Pass97 — Object generation inputs and acceptance boundaries

- **Shape:** reuse source/profile/candidate jobs and bounded fallback patterns; validate measured output geometry, preservation and actual resource cost independently of fidelity labels.
- **Fidelity:** reuse package publication and projected-size selection. Bind builds to full profile/source identities, keep per-build pending forms isolated, and verify assets before acceptance.
- **Vegetation:** species, ecology, seeded variation and natural tree plans are useful catalog inputs. Separate descriptor parameters from values actually consumed by bridge/growth/render implementations.
- **Tree pipeline:** wire explicit Shape targets and real capture/render resources; Compute descriptors need a provider implementing their kernels and binary layouts.
- Source/test references and concrete limitations: repositories.jsonl:objectShapeFidelityVegetationAudit.

## Pass98 — Reusable typed authoring workflow

- **Project authority:** use registered operations, immutable source documents, revision checks, preview and atomic commit as the existing foundation for model-driven edits.
- **Tool catalog:** reuse operation discovery and schemas, but audit their agreement with each real executor before relying on them for model output validation.
- **Recovery:** preserve receipts/checkpoints and reconcile pinned references when revisions are renewed; service identity snapshots do not replace Project source snapshots.
- **Composition and workspace:** reusable document structures keep editing intent separate from runtime installation and renderer behavior.
- Remaining algorithm source review stays under A02; detailed evidence: repositories.jsonl:authoringFoundationAudit.

## Pass99 — Bounded procedural construction tools

- **Mesh/Modifier:** useful deterministic tools for expanding lists into concrete geometry. Choose only within explicit operation profiles; evaluate output rather than relying on stored configuration validity.
- **Assembly/Scatter:** reuse hierarchy composition, typed resource relationships and seeded placement. Add consumer-level world-space/footprint checks when those are required by a game.
- **Sequence:** use receipt-confirmed ordered editing; keep retries, repair policy and whole-run recovery outside the current manual step executor.
- **Publishing:** use the provenance-linked mesh/material/rig/animation packet as a delivery boundary, with a separate renderer/runtime consumer and matching validation.
- All source identities and concrete limits are recorded in repositories.jsonl:authoringGeometryDeliveryAudit.

## Pass100 — Surface and motion authoring reuse

- **Surface construction:** reuse parameterized curve sweeps, brush/sculpt operations, tiled paint and bounded UV diagnostics in list-driven content assembly. Validate evaluated output and total work, not only independent settings.
- **Motion construction:** reuse explicit rig/skin/animation contracts, source hashes, locked weights and sampled bake checks. Treat runtime playback, normals/tangents, constraint interactions and renderer binding as separate obligations.
- **Quality claims:** declare the actual algorithm profile rather than a broad feature label. Procedural height normal maps, face-grid unwrap and rest-aligned retargeting have useful but narrow capabilities.
- Full source identities are in sources.jsonl; detailed limits are in repositories.jsonl:authoringSurfaceRigAnimationAudit.

## Pass101 — Reusable build pipeline boundaries

- **Keep:** normalized requests, target-specific source graphs, deterministic identities, exact source records, per-target failure isolation and inspectable receipts.
- **Before relying on long runs:** make plan payloads immutable and rehashable; validate cached/output bytes; bind output intent; bound process duration/output; record interrupted failures durably. These are source-grounded reuse gaps, not changes made by this audit.
- **Distinguish evidence:** plan approval is an identity check; an isolated directory is not process isolation; a receipt is not current artifact integrity; parity of supplied records is not execution parity.
- Remaining compiler/target providers must establish which builds actually work. See repositories.jsonl:buildOrchestrationSourceArtifactAudit.

## Pass102 — Compiler and platform reuse

- **Browser assembly:** reuse esbuild ESM bundling, target entry configuration, artifact lineage and optional service-worker cache. Require independent browser behavior checks and accurate capability gates.
- **Native building blocks:** reuse numeric Rust lowering and OpenXR packaging/helpers only within their explicit limits. Supplying the actual project program and wiring graphics, input and a game loop remain implementation gaps.
- **Model/tool routing:** classification labels, adapter names and successful package contracts must not be substituted for executable engine capabilities. Preserve unsupported requirements until their runtime path exists.
- **Evidence:** all Build source groups are reviewed; source closure is separate from execution or device proof. See repositories.jsonl:buildCompilerTargetAudit.

## Pass103 — Physics reuse boundaries

- **Fields:** uniform/point gravity, radial forces, wind corridors, region priorities and combined time scales are real calculations. Connect their samples to a validated body/provider consumer before claiming gameplay effects.
- **Lifecycle:** reuse ordered requests, readiness receipts, reset and snapshots for orchestration. Keep lifecycle-state restoration distinct from complete simulated-world restoration.
- **Provider bridge:** existing Simulation physics forwards descriptors and frames; articulation motor requests and pose blending are separate helpers. Reconcile its API name, weaker validation and reset semantics with canonical Physics before composition.
- **Contact policy:** supplied terrain samples produce grounding, slope/impact and recovery records; applying corrections and obtaining trustworthy collision samples remain external.
- **Evidence:** declared proven manifests and fake-provider fixtures are not runtime proof. Canonical test source paths are stale at the pinned commit. See repositories.jsonl:physicsBoundaryWorldAudit.

## Pass104 — Portable physics composition building blocks

- **Body/collider records:** reuse revision checks, deterministic command receipts and explicit state transitions. Resolve static-body normalization and keep dependencies valid across mutations before trusting composed scenes.
- **Shapes:** eleven descriptor types provide broad list-driven inputs. Add or verify downstream hull/mesh cooking, nested-reference validation and actual collision support before advertising them as executable geometry.
- **Materials:** deterministic pair policy supports varied friction/restitution choices. Density-to-mass, contact-frame anisotropy and physical response need separate consumers.
- **Sensors/triggers:** these kits select semantics; gameplay events require Detection and a consumer. No automatic objective consequence is supplied by the descriptor.
- **Evidence boundary:**153source paths and three dedicated tests reviewed; no solver, browser or numerical execution claim. See repositories.jsonl:physicsRecordsGeometryAudit.

## Pass105 — Reusable joint records and collision queries

- **Joint composition:** ten constraint types and a break-policy evaluator can describe varied mechanical relationships. Execution still needs a compatible solver and explicit body-deletion/provider synchronization.
- **Collision queries:** reuse CPU broad-phase, analytic primitive and convex reference algorithms where their supported-shape limits fit. Mesh/heightfield bounds are not mesh/heightfield collision; compound/scaled shapes need resolution; continuous collision is sphere-only.
- **Validation pattern:** reuse Constraints' sparse-array, large-number, identity, revision and receipt checks when hardening adjacent registries.
- **Composition boundary:** align Collider/Detection layer ranges, create unambiguous pair IDs and keep proxy data current before relying on collision-driven gameplay. Preserve unsupported/indeterminate status instead of interpreting both as a clean miss.
- Source evidence only; no backend, gameplay or performance validation. See repositories.jsonl:physicsConstraintsDetectionAudit.

## Pass106 — Reusable Render control components

- **Planning and admission:** declared feature/limit matching, memory budgets and queue dependencies can support deterministic profile validation. Bind them to measured provider capabilities before treating acceptance as hardware support.
- **Lifecycle:** reuse explicit startup/shutdown/recovery states and receipt identity checks. Coordinate devices/resources separately; lifecycle snapshots are not complete renderer restoration.
- **Camera diversity:** eight record types provide compact rollable view, projection, viewport, stereo, multiview, jitter, reprojection and binding parameters. A provider must turn them into actual camera behavior; record combinations alone do not diversify the player's view.
- **Hardening before reuse:** fix frame normalization round trips, completed-queue removal/restore and stopping-state snapshots; constrain generic mutations and stale references.
- Native provider implementation/proof belongs to the existing A04 kit audit. Current source evidence identifies useful boundaries, not working GPU playback.

## Pass107 — Reusable resource and surface boundaries

- **Resource tracking:** exact identities, dependency graphs, claims, reference ownership and deterministic eviction selection can track generated assets. Require real provider observations and coordinated cleanup before treating records as resident resources.
- **Safer registry pattern:** Surface combines expected revisions, tombstones, disabled raw mutators, reverse-dependency checks and replay-validated snapshots. This is a concrete source pattern for reliable compact composition records.
- **Rollable presentation:** dimensions, window/offscreen/swapchain choices, regions, formats and transition intents are compact parameters. Providers must implement them and validate real support.
- **Before reuse:** close late-reference release races, restore/live receipt-validation asymmetry and stale device/resource cross-links. Keep byte integrity and descriptor integrity separate.

## Pass108 — Buffer and Texture reuse

- **Deterministic admission:** explicit layouts, typed views, mip extents, block footprints and staging bounds can reject impossible composed render data before model or provider work.
- **Receipt comparison pattern:** Buffer update and Texture stream restoration compare recorded completion against the logical queue and exact request fields. Reuse that stronger pattern when reconciling Resource upload restoration.
- **Integration still required:** connect generated geometry/image bytes to these IDs, provider-supported formats/packing and actual GPU uploads. Stored format flags and completed receipts alone do not prove playback.
- **Lifetime coordination:** pending updates, staging buffers, parent resources and subresource residency must share release/recovery rules. Fix these gaps before relying on records for admission or cleanup.

## Pass109 — Shader and Material reuse

- **Compact generation inputs:** typed bindings, immutable source lineage and bounded permutations are useful deterministic structures for a generator.
- **Current dependency checks:** Material inspectCurrent resolves declared texture residency again and rejects stale validation; reuse this pattern rather than treating stored cache records as current.
- **Provider boundary:** program topology, artifact receipts and reflection records are not compilation or rendering. A compatible provider must compile actual bytes, supply all shader groups, bind resources and draw.
- **Integration risks:** reconcile queue/source identity on completion and restore, all inherited feature requirements, sampler/format compatibility and parent lifecycle before using these records as acceptance evidence.

## Pass110 — Simulation composition reuse

- **Gameplay material:** accounts, condition-sensitive inventory, facility output, service pressure, linear transport and timed upgrades supply real portable rules for varied games.
- **Explicit adapters:** connect returned progression/facility effects to target APIs while keeping source ownership separate. A consumer must schedule and validate those connections.
- **Required integration work:** make multi-target acceptance/recovery coherent, key effects to stable producer identity, preserve authored timing and verify consistent large/small steps before treating these primitives as reliable composed loops.
- **Spatial boundary:** transport uses ordered stop IDs; inventory uses planar coordinates and caller-validated interactions. These do not directly establish navigable Three.js scenes, physical pickups or visible feedback.

## Pass111 — Motion, pressure and resolution reuse

- **Reusable rules:** resource depletion, pressure escalation, periodic action quality, jumping/gliding, hazard avoidance and pursuit bands are actual calculations, ready to become explicit composition ingredients after their limits are addressed.
- **Pose calculation:** rig-space forward kinematics and two-bone IK produce useful transforms; assets, renderer application, joint limits and broader chain solvers remain separate.
- **Single-loop integration:** connect input, movement, world contact, recovery, objective consequences and visible feedback; stored motion/recovery frames alone do not close that loop.
- **Acceptance/recovery:** resolve/reset/snapshot and cooldown persistence need coherent ownership before these services support reliable generated games. Current checks are source evidence, not measured runtime reliability.

## Pass112 — Procedural spaces and environmental queries

- **Space generation:** seeded rooms, corridors and walkability can supply a reusable initial layout. Connectivity after obstacle placement needs a separate explicit acceptance check.
- **Navigation:** grid/navmesh paths and landmark progress provide ingredients; actor geometry, coordinate conventions, graph revisions and objective wiring are required composition contracts.
- **Environment:** terrain samples and water-zone queries can drive placement, material choice and movement consequences once consumer adapters apply them. Rendering and fluid dynamics are not supplied by these query modules.
- **Variation:** distinguish configurable metadata from executed algorithms. Current algorithm-list signatures alone cannot establish new spatial or gameplay families.

## Pass113 — Current Engine architecture map

| Reusable group | What it supplies | What the consuming game still needs |
| --- | --- | --- |
| Runtime/composition | State, schedules, deterministic selection, dependency order, receipts | Host execution, persistence and coordinated reset |
| Actors/objects/interaction | Identity, placement and request/progress rules | Device input, spatial admission and objective effects |
| Simulation/spatial | Motion, resources, pressure, timing, hazards and transform calculations | Contact integration, coherent recovery and visible consequences |
| World | Cell preparation, terrain/navigation queries, weather, feature/foundation composition | Concrete providers, meshes and application scene execution |
| Physics/render/presentation | Typed contracts, selected CPU calculations, visual policies and execution receipts | Solver/GPU/audio/UI implementations |
| Authoring/build | Geometry/painting/rig evaluation and compiler/bundler operations | Target execution and consumer validation |
| Compute/agent/network/MCP | Graphs, injected execution contracts, messages and tool discovery | Models, transports and application policy |
| Asset/policy/diagnostics | Provider jobs, portable authority and diagnostic records | Current evidence checks and actual external resources |

Use these groups to compare historical kits and games for missing concrete adapters. Preserve authored gameplay in products; extract reusable mechanisms into their owning domain. Catalog presence, hashes and model summaries do not establish runtime capability.

## Pass114 — Reuse across versions

- Preserve repository, commit, export path, configuration and state owner together for every reusable candidate.
- Translate old root/Core imports through the semantic migration map; name equality does not mean behavior equality.
- Reuse universal rules in Core, optional concrete implementations in Kits/providers, and authored layouts/loops in products.
- Treat generated ownership ledgers as classification leads; verify representative implementation and consumer wiring before claiming capability.
- Separate byte-identical relocations from changed implementations and generated catalog expansion.

## Pass115 — Useful shared-library extraction targets

- **Roll and resolve:** reuse graph/recipe normalization, dependency ordering, explicit missing/status/cycle diagnostics and seeded weighted selection. Current Engine Composition owns the canonical contract; legacy ProtoKit algorithms are reference material.
- **Visible scenes:** camera smoothing, instance bookkeeping and concrete GPU providers are separate reusable layers. Keep their provider/device proof distinct from portable descriptors.
- **Streaming worlds:** bounded patch preparation supplies practical cache/activation policy; pair it with reset/recovery and the World cell-provider contract.
- **Multiplayer:** reusable transport/controller algorithms require an explicit simulation snapshot/input/hash contract and real transport validation.
- **Admission:**95catalog placeholders have no entry file; scaffold wrappers can return empty shells only through explicit unresolved opt-in. Neither should be advertised as runnable capability.

## Pass116 — Descriptor-driven readiness as reusable feedback

- Next Ledge and Cavalry show a useful boundary: portable calculations produce route/risk/readiness descriptors; a host-owned canvas pass displays them while the game retains input and state mutation.
- This can supply optional spatial cues and decision context. It does not by itself provide an interaction, objective transition or new game loop. Validate overlays against the owning state and renderer version before reuse.
- Eight Next Ledge variants and seven Cavalry readiness themes share this pattern; they are authored feature variants over two underlying game families, not 15 demonstrated gameplay systems.

## Pass117 — Profile labels versus executable game capability

- The 100 AAA registry records provide broad themed profile data, while the shared host executes one four-node Canvas2D loop. Kit names, controls copy and palette do not become instantiated adapters or new mechanics in the current route.
- This is a reusable schema/host smoke reference, not proof of a hundred game families or NexusEngine/Three.js compositions. New profile fields should affect adapter selection and tested runtime outcomes before being counted as gameplay diversity.


## Pass118 — Legacy consumer migration lead

Zombie Orchard is an authored survival-loop reference, but its game adapter targets 12 direct factory names absent from the pinned current Engine root export surface. Its legacy `NexusRealtime-ProtoKits@0.0.1` alias is not yet mapped to an accessible canonical repository. Preserve its useful categories (movement, world physics, interaction, objective flow, navigation/pathfinding, combat, survival rounds, threat roster, horde pressure, and found gear) as design/dependency leads; do not advertise them as usable current Engine capabilities until the consumer is migrated and the import is verified. Exact comparison and access limitation: `repositories.jsonl:zombieOrchardLegacyEngineCompatibilityAudit`.


## Pass120 — Current-main integration boundary

The current public Engine constructor is `createEngine`; do not count an experiment that calls `createRealtimeGame` against the current `@main` module as Engine-integrated without an adapter/migration and matching consumer evidence. Signal Bastion’s readiness validators also cannot currently reject invalid presets. Fogline’s local relay/gameplay state machine, Signal Bastion’s defense/session composition, and Open Above’s flight stack remain potentially useful extraction inputs, but labels and import attempts do not make them supported runtime capabilities. Exact evidence and limits: `repositories.jsonl:experimentCurrentMainCompatibilityAudit`.


## Pass121 — Game, state, and presentation ownership

- Keep **runtime state ownership** separate from **domain descriptors** and **renderer handoff**. A route can import NexusEngine or expose its name while still running local gameplay state or a local mini-runtime.
- Reuse leads from experiments are concrete ingredients: terrain/scene generation and camera control, route/cargo and objective transitions, scan/relay/pressure consequences, seeded world queries, and descriptor-to-renderer cues. Promote a lead only after confirming the owning source, consumer connection, reset behavior, and runtime evidence.
- Treat readiness overlays as player-information/presentation candidates. They become gameplay only when actions can change authoritative state and that state advances the objective or consequence chain.
- Prefer Next Ledge as the current Engine composition probe; keep Fogline/Open Above/Signal Bastion as API migration candidates, and the local Three.js families as sources for reusable providers and authored spatial patterns. No browser/runtime claim is made.


## Pass122 — Engine kit host versus game-state authority

- A current Engine can install a compatible runtime kit through `createEngine({ kits })`; the kit may provide a bounded route/resource/pressure service without owning the full game.
- Keep the authored session as the declared state authority when it owns player movement and terminal outcomes. Treat installed kit snapshots as derived support state unless explicit wires make them authoritative.
- Require event receipts to connect service outcomes to the session objective; matching kit APIs alone does not create objective or win/fail behavior.
- Shared reset, snapshots and reads must cover both state owners before this pattern is used as a reliable replayable composition.


## Pass123 — Descriptor overlays as reusable information, not mechanics

- Cavalry’s diplomatic, medical, and logistics descriptors offer reusable decision-context categories: obligations/loyalty, capacity/triage/routes, and supply/transport/risk. These can inform a player-facing forecast layer.
- Keep the snapshot-to-descriptor calculation separate from the authoritative campaign reducer and from Canvas rendering. A cue is not an action or consequence unless an input changes campaign state through an explicit rule.
- Treat source-string/CDN-labeled tests as routing evidence only; actual CDN and browser behavior require separate execution evidence.


## Pass124 — Cavalry campaign readability extensions

- Campaign 039–041 add descriptor families for water security, frontier signals, and legion morale. They are useful risk/readiness overlays, not state-changing mechanics; connect them to explicit player actions and campaign rules before treating them as reusable gameplay capabilities.
- Reconcile current app route (041), experiment entry (038), cutover manifest (038), and domain plan (036) before relying on the declared stack.


## Pass125 — Cavalry strategic loop candidates and ownership boundary

- Reusable extraction leads: procedural territory graphs, constrained adjacent movement, troop/resource accounting, turn budgets, reinforcement and rival-turn resolution, battle resolution, and map-camera interaction. These are currently local to the Cavalry experiment, not Engine capabilities.
- Keep campaign rules in one explicit state owner. Snapshot overlays may calculate readability, but the current pointer and turn passes directly mutate the local map closure.
- Define terminal conditions around player success/failure and route all active action paths through them before reusing this as a reliable campaign loop. The current completion predicate and active overlay wiring need correction evidence.


## Pass135 — Sandbox composition and ProtoKit capability leads

- **Deterministic domain state:** V1 Flow Pressure provides a renderer/browser-independent state + tick/release/reset service with fixed-step headless test cases. V1 object recipe/field kits produce deterministic geometry and placement descriptors. Candidate for future capability reuse only after current package/API compatibility is confirmed.
- **Procedural geometry composition:** V2 separates deterministic helpers, surface geometry, layout, support axes, object composition, variant catalogs, and scene-context descriptors. The flower output is recipe data composed from generic kits; proof checks replay/shape/serializability, not rendering or game behavior.
- **Kit incubation workflow:** KitSandboxer turns a manifest into bounded staged candidate source, a contract, headless-proof artifact, and review record. Its sandbox/action policy is useful process tooling, not an engine runtime capability.
- **Runtime handoff limit:** historical generated resource-loop code exposes host-surface metadata but has no inspected NexusEngine import or consumer mapping. Keep it a candidate until installed/consumed through a pinned Engine API and validated by a real host.

All evidence is pinned to Sandbox commit `5a06ee1d85c75fd55c798a87be61e81947aaa3e3`; tests are declared/read, not run. See `collections.jsonl:a08SandboxPass135` and `sources.jsonl`.

### Private arcade: import/version map (pass136)

- **Shared route family:** 71 configs use one route/objective wrapper and shared `src/runtime/route-objective-game.js`; its vendored import barrel is statically missing the timing-window factory, grading function and state symbol.
- **Distinct deeper modes:** five wrapper branches remain crane, triage, elevator, network and seed. Their wrapper identity is not evidence they all share one mechanic.
- **Vendored-kit API risk:** the pinned six-game sample confirms absent named exports for each of freight-surge, it-pixel-place, riftwarden-wilds, tidebound-delve, tropical-jetski-rescue and you-thought-you-were-big. The missing-name lists are in `collections.jsonl:a09PrivateGamesPass136`.
- **Renderer/version reuse:** 14 Three.js entry pages span r128, 0.161.0 and 0.184.0, with one page lacking a Three URL in its entry HTML. The app manifest's `^0.184.0` range is not a universal per-game pin.
- **Evidence limit:** source/import-map inspection only. No source repo checkout, module resolution, build, test, deployment inspection or browser execution.

### Builder history and staged outputs (pass137)

- NexusBuilder-Lite is a list/manifest-to-text pipeline; text/JSON-shape checks do not validate a playable game.
- LMStudioCodeGen stages and applies source batches, but its recorded gate/order/error behavior does not demonstrate candidate acceptance or a successful repair loop.
- The native staging shell creates task-description artifacts; it is not a game compiler or runtime handoff.
- Historical PASS claims without their linked output, including the named but absent release-build log, remain unverified. All evidence is static and pinned; no tests/builds were run.

### Published game families and ownership (pass138)

- **Engine-composed:** HorrorCorridor, TheOpenAbove, PrehistoricRush, MyCozyIsland, TheLongHaul, AcrossTheCanopy and TheLastBell. Each remains tied to its own Engine commit and integration seam.
- **Locally owned runtime:** Cavalry of Rome, Zombie Orchard and Into the Meadow. Similar resource/event/kit APIs are not counted as shared NexusEngine use.
- **Independent implementations:** Phantom Command and The Unmapped House use their own rendering/rule modules; treat them as mechanic/presentation leads only.
- **Documentation/comparable-engine:** AetherVale is a Rust/Vulkan/Avalonia lane; ToyboxTorque has no implementation in its inspected default tree.
- **Identity limit:** current pinned source commits and dependency locks were checked; deployed URL/bundle identity and current playability were not inspected.

### Content and asset factories (pass139)

- **Game assets:** NexusFactory and Factory-Kits author FBX/GLB/PNG/JSON artifacts; Studio is a generic registry host. Factory preview and metadata checks are not an Engine game loop.
- **Engine-facing asset seam:** TreeFactory installs NexusEngine procedural object/tree kits plus a Three adapter, then exports tree/object data and images. This is asset authoring, not gameplay assembly.
- **Specialist providers:** WorldFactory creates seeded terrain recipes; Botany creates specimen/LOD/render artifacts; Aviation creates validated flight descriptors and visual aircraft previews; Shader/Texture factories produce raw WebGL material recipes; Celestial composes planet/terrain presentation kits with optional CDN loading.
- **Expansion rule:** catalog output type and import/export contract must be explicit. Do not promote an asset factory as a playable-game capability until an external consumer imports and uses its output.
- **Limits:** only source/manifests were inspected. No factory generation, Unity packaging, browser preview, asset import, Engine composition or game run occurred.


### Historical Unity roots and package/asset lanes (pass140)

- **Legacy Unity package references:** Killshot-Competition, MEGA-ARCADE, XR_ED_DEMO, EXPERIMENTING_EXPECT_BLOAT, XR_Education, BLACK-WHOLE-MOBILE and DontLookAway2-2026 declare or document the historical personal-owner NexusEngine package. DiskGolf-XR and WindRider-8-24-Release share the same `WaitForGoalHit : NexusSequence` blob; that is a reusable historical sequence example, not proof of current JavaScript Core compatibility.
- **Asset/package work:** NexusAssets declares a local package (version 1.0.33) alongside historical Engine/Factory dependencies. LL_AssetPacks contains multiple Unity project roots with different manifest eras; only two sampled manifests declare Engine packages.
- **Evidence boundary:** all ten named Unity root trees are complete at pinned commits, but LL_AssetPacks remains truncated at 41,254 entries. Versions and representative sources are indexed in `sources.jsonl`; no compile, scene execution, device, or runtime test was performed. Credential-bearing URLs found in manifests are omitted from this packet.


### Drive design references: deterministic breeding and procedural world (pass141)

- **LittleReef design lead:** frozen v0.1 specifies matrix-owned game state, deterministic seeded two-parent/one-child breeding, visible nursery, objective and atomic failure handling; Three.js is presentation. This is a design contract, not a verified Engine capability. A later handoff reports a service-driven Three.js architecture and explicitly says it is unreconciled with the frozen matrix model. Preserve both versions until A15 reconciles them against pinned source.
- **Nexus WorldGen tracker lead:** describes NexusEngine as the root ECS/runtime and Three.js as a presentation adapter for deterministic procedural world generation; its own matrix lists 34/36 tasks complete and two validation gates blocked. Those are tracker assertions, not independently reproduced results.
- **Reusable checks:** seed repeatability; state authority; identity-based selections; compatibility and capacity validation before mutation; deterministic child identity/traits; objective feedback; explicit failure recovery; renderer projections that do not own gameplay state.
- Drive source IDs, per-document status and limits are in `drive.jsonl` and `collections.jsonl:a14LittleReefAndWorldGenPass141`.

### Drive authority and project maturity (pass142)

- **Across the Canopy:** Phase 1 is now scoped as a finite authored point-and-click adventure. The live tracker is current at Drive revision 28; the older XLSX snapshot is historical. The tracker describes a limited prototype and records a failed start interaction plus open architecture/deployment issues. These are tracker results, not rerun browser evidence.
- **GoldRush:** project documents are planning and process sources. The named active implementation authority is `NexusEngine-GoldRush`; its art and opportunity boards remain open, with assets unassigned/not integrated. Board naming and status vocabularies differ.
- **PrehistoricRush:** the tracker reports 10 done, 23 not started, 33 later; it pins an older commit than current `main`. Its Engine ownership convention does not establish feature integration.
- **Quest Device Twin:** deterministic, typed ADB simulation and failure testing are explicitly separated from Android/Quest runtime, physical USB, and managed-provider evidence. This is a tooling/test adapter, not a general gameplay domain.
- **NexusVoice:** a separate speech tooling/product lane; package import, target builds, embedded inference, licensing and release remain open per its handoff.
- **NexusEngine 0.0.10:** the current packet authorizes planning direction only. Current Engine `main` remains `a74e8689d1a71c0b42236c009f0f4c46e9b89387`; 0.0.10 reports do not establish a release or completed capability.
- **NexusWorldGen:** its current-main deploy run `33285987471` matches commit `72d6c9f2325d162ba986ca828095d9abbd99fe71`; prior run `33285598780` succeeded on the previous fallback commit. The apparent ID discrepancy is sequential history. A deploy workflow success is not equivalent to validating all tests described in project documentation.
- Detailed Google Drive revision IDs, source pins, maturity distinctions and caveats are in `drive.jsonl` and `collections.jsonl:a14GroupedDriveAuthorityPass142` / `a15CrossSourceAuthorityPass142`.

### Audit closeout boundaries (pass143)

- The frozen 392-repository baseline remains unchanged. A16 resumed the one persisted Drive search cursor; Google rejected it as invalid. The page-seven results therefore remain unavailable; no absence claim follows. The complete exact-title filter and existing indexed pages remain the supported discovery scope.
- A17 retains explicit identity/access limits: one GitHub 451 source, eight 404 dependency identities, twenty empty repositories, selected-repository visibility, the truncated `LL_AssetPacks` tree, mutable CDN routes, and historical Drive pointers. A 404/empty/search miss is not treated as proof of nonexistence.
- A18 closes the packet at the connector-only boundary: source blobs/commit identities and Drive file/revision IDs are linked; planning, source inspection, historical test claims, successful workflow metadata and runtime evidence remain separate evidence classes. No repository code, test, browser, game, model, or deployment was run.
- Remaining metadata-only Drive rows have individual `auditDisposition` fields; they are still metadata-only, not content reads. The partial historical document remains explicitly bounded.
