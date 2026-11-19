# Findings and next extraction work

Audit checkpoint: 2026-09-21. Read-only connector evidence; no execution or visual review. Inventory and first-pass keyword screening are complete for readable roots; deep audit is still in progress.

## Coverage

392 repositories across nine installed accounts. LuminaryLabs-Dev: 195; LuminaryLabs-Agents: 24; LuminaryLabs-Publish: 15; thecrimsondeveloper: 129; CharlieDoesDev: 13; SoftStrangeStudio: 9; Charlies-World: 4; angelberger09: 2; Aldervon-Systems: 1.

363 root trees readable; 20 repositories explicitly empty (409); worldwalker blocked (451); eight src-p2pool dependency repositories unavailable (404). Every readable repository received four keyword searches. Results are capped, and known indexing omissions prevent negative conclusions. `repositories.jsonl` retains each result and pointed paths.

## Runtime ownership and compatibility

- NexusEngine README describes Core semantic atoms and isolated n:build tooling. Physics/Render records are not concrete physics/GPU execution. Providers remain separate.
- NexusEngine-Kits catalog confirms 140 entries: 23 official, 14 candidate, 8 scaffolded, 95 migration placeholders. `capabilities.jsonl` preserves factory, entry, dependency and proof paths.
- The shared migrated-kit smoke checks factory validity, installation, one tick and duplicate installation. It does not demonstrate each gameplay mechanic.
- `kits/migrated-gameplay/lock-and-socket-kit.js` initializes `filled: 0` and `unlocked: false` but has no system or mutation updating them. Its light/unlock methods optionally forward to interactionTargets. Treat socket completion as unproven, despite official status. This is a source finding, not an executed failing test.
- `interaction-target-kit.js` does implement action counts, completion events and reset. It also forwards each action to ObjectiveFlowAction. Review target selection, repeated completion and invalid target behavior before reusing as an acceptance gate.
- Next Ledge's active main loads `session-cargo-extraction-upgrade.js`, Three.js renderer, normalized input, HUD, runtime loop and synth. The session imports Engine from a moving `@main` URL and ProtoKits at `04d34f049f58ae359cf71d43466c429dac2a6d08`, creates a kit-backed runtime and calls route/cargo facades. This confirms causal integration for that seam, not complete runtime compatibility today.
- The Open Above package requests Engine `#main`, but its lockfile resolves `8a60167fc945109408851c586a9355b1147438d5`. The lock supports repeatable npm ci at that revision; updating the dependency can move it. Its native balloon kernel contains two numeric functions, not the entire browser game.

## Nested collections and duplicate boundaries

- NexusEngine-Experiments complete tree: 2,845 entries; 344 nested index.html paths excluding vendor/node_modules. These include apps, experiments, wrappers and variants, not 344 proven unique games. Its cutover manifest names 16 canonical routes; it must be reconciled with the larger tree.
- NexusEngine-Agent complete tree: 23,251 entries. `generated-games/` includes separate 3D-ten, gameplay-taxonomy-ten and reliability-live batches. `collections.jsonl` records pointed entrypaths. One 3D-ten campaign report claims 10/10 PASS, ten model calls and zero repairs. Its diversity calculation uses declared mechanics and fingerprints; do not credit behavioral uniqueness without reading the actual verifier and games.
- NexusRealtime-Sandbox root recursion truncates in .agent. Separate subtree reads cover SandboxBuilder-V1 (143 entries), V2 (31), KitSandboxer (37), and Core (9). V2 deliberately separates deterministic/geometry/structure/environment/proof kits from flower recipe data.
- NexusRealtime-Ideas has folder-scoped atomic domains, families, composite loops, host bridges, render descriptors, incubation and promotion. CascadeSeeder Lite is a folder-ontology idea expander, not evidence of finished games.
- NexusArcade-Prototypes has registry records and 12 nested HTML entrypoints. Preserve migration identities when matching standalone Publish repositories.

## Non-Nexus Engine Three.js sources

| Source | Observed ownership | Reuse candidate | Qualification |
| --- | --- | --- | --- |
| LuminaryLabs-Publish/TheWrongFloor | game/src/game.mjs owns schedule, door state, deadlines, outcomes and score; docs explicitly defer Engine integration | Encounter scheduler, bounded input windows, pause-aware clock, failure/retry rules; Factory-generated geometry/materials | Three.js and Factory reuse, not NexusEngine gameplay ownership |
| SoftStrangeStudio/LittleReef | package dependencies are Three.js and Cannon; BreedingService delegates to local FishGenome/FishService; NexusFishFactory adapts local procedural fish to Three.js | Seeded inheritance, lineage, morphology-to-mesh, swimming, schooling, obstacle avoidance | No Engine dependency in inspected package/modules; local Nexus-named fish code is not proof of Engine integration |
| CharlieDoesDev/MushyCore | main.js directly constructs Three scene/camera/renderer and Cannon world; local ECS folder exists | Charged jumping, chunk terrain, camera, collectibles | Reviewed main is local runtime code; broader dependency closure still to audit |

Additional leads: KoolVFX, NexusPrototypes' orb-runner variants, LittleReef's local fish generator, Website game collections, LuminaryLabs TestOutputs, and NexusAgent harness outputs. All require implementation-level classification.

## Drive reconciliation

- Four-Layer Architecture chat record: historical, partial source. Domains own truth; Kits expose capability; Sequences coordinate finite flows; Game AST owns authored selections. It explicitly warned against decorative engine imports.
- Across the Canopy's `08 - NexusEngine Composition Guide` documents immutable presentation packets, stable IDs, normalized input, hydration and deterministic replay. Correlate with `LuminaryLabs-Publish/AcrossTheCanopy/docs/NEXUS_COMPOSITION_LEDGER.md` and `source/` before admitting a reusable implementation.
- LittleReef TechnicalDesign (August 24 baseline) specifies a sole authoritative matrix and says repository implementation was not started at that baseline. Current README and files describe implemented service-owned behavior and explicitly acknowledge the unresolved matrix reconciliation. Keep these as a documented architecture mismatch, not evidence that either state is current everywhere.
- A title-filtered Drive search returned 26 documents with no next page, including the Engine tracker, starter, roadmap, composition guide and LittleReef design set. This does not exhaust folder-contained or differently titled engineering material.

## Expansion order suggested by inspected evidence

1. Admit existing behavior only after checking implementation and behavioral proof; distinguish official catalog status from functional completeness.
2. Reuse action/target/objective, deterministic schedules, route progress, reset and snapshot contracts before adding specialized game presets.
3. Extract local mechanics from complete source paths into optional Kits when they genuinely fit; preserve renderers as adapters and retain historical source lineage.
4. Match random profiles to verified contracts. A bounded decision model may choose an adapter or gap category; it cannot establish that a selected capability works.
5. Verify small compositions with action-to-state-to-consequence checks and deterministic replay. Compare gameplay behavior, not labels, hashes or declared mechanics alone.

These are audit recommendations. No source changes, promotions, tests, deployments or model calls were performed.

## Follow-up: published consumers and actual entrypoints

The following classifications are source observations, not runtime acceptance. Every readable Agents and Publish repository now has a complete tree read (except the known Sandbox root truncation) and README review; 32 readable repositories are classified in repositories.jsonl and seven empty Agents repositories retain their 409 evidence.

| Published repository | Current implementation and reusable seam |
| --- | --- |
| HorrorCorridor | Root app/GameHost.tsx loads src/App through Next. src/game/composition/nexusRuntime.mjs imports semantic Engine domains and orders local kits. Engine a74e8689 and Three0.185.1 pinned. README still emphasizes the older V2 subtree; use the root app entry for current work. |
| AetherVale | README/tree describe Rust deterministic combat/state engine, Vulkan client and Avalonia prototype. Comparable engine lead; no Three.js consumer established. |
| TheOpenAbove | Three flight game; declared Engine main with lockfile pin8a60167f. Flight/wind/world/provider boundaries remain extraction candidates. |
| TheCavalryOfRome | cavalry-of-rome/src/main.js imports local runtime.js, local strategic kit and Three visual-upgrade-renderer.js. Local runtime implements resources, events, dependency-ordered kit installation and phases. Nexus-style API does not establish shared Engine ownership. Extract turn phases, action budgets, gold/recruitment/card cycles with an explicit adapter. |
| PhantomCommand | Current game.html loads src/campaign/campaign-scene.js: Canvas2D rules/rendering plus src/menu/crt-renderer.js raw WebGL postprocess. README's Three.js description does not describe this route. Candidate seams: waves, selection, tower/roster rules, CRT presentation. |
| PrehistoricRush | src/pages/game.js loads Engine modules; core-assembly.js installs actor/input/spatial/motion/physics/world/render contracts. runtime-versions.js uses NEXUS_REF=main for active URLs despite a separate validated commit4d550be6. Pinning and concrete provider ownership remain checks. |
| ZombieOrchard | src/game.js installs local resource ledger, pressure, world, construction, roster, inventory and session kits into src/kits/runtime.js. Command/tick/snapshot pattern is reusable; no shared Engine dependency in inspected package. |
| IntoTheMeadow | Default web host calls local game factory without an external kit. Factory selects local meadow fallback; local game-state.js already advances movement and walk-the-path/inspect-tree objectives. README's future interaction milestone is stale for this source. Default WebGL renderer is local, not proven Three/Engine-backed. |
| MyCozyIsland | src/adventure/composition-runtime.js installs Engine objects/transactions and official agriculture domain, plus world and interaction kits. package pins Engine4fac5c2e and Kits2218856c; authoring uses another Engine revisiona74e8689. Agricultural interactions and state ownership are concrete reuse leads. |
| TheUnmappedHouse | src/game.js owns local story flow; StageKit imports Three0.160 CDN, scene/camera/raycast/render targets. Non-Nexus Three.js source candidate for fixed-camera stages, hotspots and scene transitions. |
| TheLongHaul | src/app/bootstrap.mjs imports Three and nexusengine; product-kits.mjs injects Engine API into truck/course/run/contracts/world factories. truck-kit.mjs consumes world clock. Reuse seams: truck dynamics, route generation, streaming, contract/progression loop. Import-map version still to verify. |
| AcrossTheCanopy | source/src/game/nexus-runtime.js imports navigation, world, interaction, locomotion, persistence and presentation domains. package pins Engine8a60167f/Three0.165. Corresponding Drive Composition Guide provides a strong integration reference, not execution evidence. |
| TheWrongFloor | Local deterministic rules plus Three/Factory-generated scene content; shared Engine integration remains explicitly deferred. |
| TheLastBellofSaintOrison | create-modular-game.js imports Engine semantic domains and composes campaign/location/projection kits. package pins Enginebacc8fc0 and Three0.180. Reuse candidates: room/campaign state, inventory, presentation projection. |
| ToyboxTorque | README only; no implementation in default branch tree. |

## Follow-up: duplicate collections and weak proof gates

- KitBuilder03 has 36 direct docs/games directories but only 16 distinct Git tree SHAs. Twenty directories repeat an already-present complete tree. Its three active launcher entries all resolve to tree e27a33cce3e7e94ae8af05a758e24eeee7b2a5ae, which appears in five published folders. Thirty-five run/generated directories also match published trees. These are exact content duplicates, not inferred from names. Distinct trees still do not prove distinct gameplay. Compact groups are retained in collections.jsonl.
- Experiments AAA registry contains 100 top-level game records. Sample Core Diver routes under apps/, experiments/ and experiments/aaa-batch/ all converge on startAaaBatchRoute. The generated-app router reserves a distinct route for the Roman cavalry game; other routed IDs use the shared batch host.
- The batch host owns a local four-node loop: pressure rises, resource drains, the player position advances automatically, and named actions add 18/31/42 charge to the next unfinished node. kitStack is copied into state and displayed; it does not install those named kits in this host. canvas-renderer.js uses getContext("2d"). Preserve these as concept/action-contract data, not 100 unique Nexus 3D implementations.
- runSmoke() directly calls completeNode(45) until completion after dispatching the configured actions. A successful smoke record therefore does not establish that normal player actions can complete the game.
- Exact directory hashing did not collapse Experiments' wrappers: all348 examined directories had different tree SHAs. The sampled shared routing proves why hash difference alone is insufficient for game diversity.
- NexusEngine-Agent's deterministic proof harness does launch a browser, collect errors/screenshots and send real keys. However its input gate only checks an inputSequence increment, and it uses commands such as openAllGates, teleportRegion, forceFailure and forceCompletion. Its start click can fall back to a direct start command. These are useful diagnostic checks, not proof of normal-input completion.
- Its campaign diversity checks compare declared mechanic signatures, camera/spatial signatures, renderer fingerprints and rolled genome leaves. They should not be treated as behavioral diversity measurements.

## Follow-up: Drive and version reconciliation

- Read Engine Starter, Agent Operating Guide, Version Roadmap and September3 0.0.5 Architecture Review. The guide prioritizes exact source, one mutable-state owner, public semantic exports and provider-owned backend handles. These align with the domain extraction boundaries above.
- Roadmap baseline September5:0.0.5 active;0.0.6 Sequence planned;0.0.7 authoring,0.0.8 multi-game scale,0.0.9 visual quality,0.0.10 distribution proposed. This is planning evidence, not implementation.
- September3 review records17/67 packages complete and Physics Constraints unproven at bacc8fc0. Current fetched .agent/versions/0.0.5/failure-point.json still records17 proven/50 pending and releaseReady=false, but references sourceSnapshot f0ff535d and old proof runs. This confirms the checked-in record, not a fresh test of engine readiness.
- Read-only audit has not rerun any tests or followed deployment links. Missing native Doc link targets in plain-text extraction remain to recover from richer document metadata if needed.

## Follow-up: Agents capability sources

- NexusEngine-TreeFactory pins Enginec5548de5, Kits9673594d and ProtoKits956fe543 in CDN wrappers. Tree object contract adapter, seed factory, procedural tree suite and Three renderer adapter are concrete entrypoints; check version compatibility before extraction.
- KitBuilder01 describes16 experimental fleet/rollout/telemetry/rollback kits with deterministic device simulation. Candidate reusable concepts are leases, ledgers and rollback; no real fleet transport is proven.
- KitBuilder02 describes5 experimental room/host-routing/ONNX/server/tunnel kits. Deterministic fake adapters and manifest lifecycle status do not establish live network operation.
- NexusEngine-Builder isolates input staging and packages static/native wrappers. Keep this in distribution tooling, not game capability counts.
- NexusEngine-LOD-Showcase embeds its real app in six gzip/base64 text shards; index reconstructs and patches UI. Packed implementation needs read-only decoding before classifying actual Engine usage.
- PrintGen and OmniScraper are other tooling; RebootOutreach is research/planning. TestRuns is Unity queue/RPC tooling. Kickback-Running, LLM_Runner_Example and VerticalAscent are README-only on their inspected default branches.

## Historical engines, aliases and additional consumers

Read-only follow-up on September21. Classifications identify observed source/dependencies; none implies fresh execution.

### Repository identity

GitHub returned permanent redirects for the historical URLs. Matching immutable repository IDs confirms:
- LuminaryLabs-Dev/NexusRealtime -> LuminaryLabs-Dev/NexusEngine (1264035892).
- LuminaryLabs-Agents/NexusRealtime-ProtoKits -> LuminaryLabs-Agents/NexusEngine-ProtoKits (1266731854).
- LuminaryLabs-Agents/NexusRealtime-Experiments -> LuminaryLabs-Agents/NexusEngine-Experiments (1266703650).
- LuminaryLabs-Dev/NexusRealitime-Kits -> LuminaryLabs-Dev/NexusEngine-Kits (1282733112). Preserve the historical spelling in dependency evidence; the differently spelled NexusRealtime-Kits URL returned404.

These are aliases, not additional repositories. A redirect does not establish compatibility across old package APIs.

### Distinct runtime lines

| Repository | Source boundary | Reuse direction |
| --- | --- | --- |
| thecrimsondeveloper/NexusEngine | Unity package1.1.105, Unity2022.3; LuminaryLabs.NexusEngine namespace; GameObjectHandlerSequence derives NexusSequence. Separate legacy and Dart folders. | Event completion, lifecycle, nested sequences and component handlers. Port semantics explicitly; do not swap in JS Core APIs. |
| thecrimsondeveloper/NexusEngine-Meta | Historical Unity OVR package1.0.5 for Unity2021.3. | Meta input/interaction adapter patterns; dependency/scene validation required. |
| thecrimsondeveloper/Nexus_Engine_Dart | Flutter/Dart NexusSequence with nested children, lifecycle and property metadata. VulkanGraphicsApi is explicitly unimplemented and throws. | Sequence/property model only where implemented; no native Vulkan capability credit. |
| thecrimsondeveloper/NexusManager | Python entry launches local NexusApp; not proven canonical Engine. | Related authoring prototype, pending UI/source inspection. |
| LuminaryLabs-Dev/NexusEngine-Deprecated | Rust/Avalonia native V1; Projects/VerticalAscent, CityGridRunner, Boating-Debut. public_claims.md treats NexusRealtime/ProtoKits as future inputs. | Runtime health/frame/input proof ports, native build and scene contracts; historical native line. |
| LuminaryLabs-Dev/NexusJS | Local src/ecs/World.js, component/system/event modules and XML serialization. | Small JS ECS/event/serialization patterns, separate contract from modern Engine. |
| LuminaryLabs-Dev/NexusEngineWeb | GameRuntime.tsx uses local engine/core, Three and Cannon; XML projects/scenes, cutscenes/dialogue. | Boating/ship/world/render-host ideas; README warns npm test discovers zero tests. |

### Direct browser consumers and tools

- Gold Rush: src/kits/goldRushRuntime.js imports createRealtimeGame from nexusrealtime and invokes installed extraction/ProtoKit facades. package.json uses legacy moving main dependencies and Three. Candidate capabilities: mining, extraction route, checkpoints, match lifecycle, procedural terrain and party/network commands. Do not credit the README's multiplayer range without network evidence.
- Yarnasaurus: src/main.js creates the game domain service and Three WebGPU stage renderer. kits/yarnasaurus-game-domain-service-kit/index.js imports createGameKitComposer and composes movement, food/growth, inhabitation, body traits, physics, affordance, objective and feedback kits. Legacy moving main dependencies require reconciliation before reuse.
- Battle Clash: src/composition/create-battle-clash.js imports public Engine runtime/world/simulation/input/network/presentation domains and local combat, navigation, progression, player and encounter kits. package pins Enginec9218a79 and Three0.185.1. Strong candidate for spatial combat, army orders, territory graph and persistent progression.
- BattleClash-Player: src/adapters/browser-page.mjs drives public observation/input and visible controls. Good bounded semantic-action harness lead; mocked demonstrations are not live-model evidence.
- InHell: src/game-runtime.mjs imports vendored createEngine, defineDomainServiceKit and installRuntimeKit. Source contains first-person combat, route/gate, persona, rounds and persistence logic. Keep vendored revision and large local runtime scope explicit; diagnostic completion commands do not prove normal gameplay.
- NexusEngine-Editor: installed-nexusengine.js resolves public Engine/Composition exports and refuses registry entries without installability, subpath and export metadata. Candidate for profile-to-installed-factory admission and accepted composition trees.
- NexusSimulator: NexusSimulator-V1/src/nexusengine-runtime-simtime.js invokes configured executable/proof commands. It is an evidence host, not the implementation of the behaviors it names.
- NexusARDashboard: apps/host/src/nexusRealtimeThought.ts installs engine.n.arEditorThought for readiness/launch signals. This is bounded Engine use; phone camera/hand tracking must not inherit that classification automatically.
- NexusSplats: src/domain/gaussian-splat-domain-bridge.mjs requires injected Engine and GaussianSplatModule; owns descriptors/import/presentation handoff. Reconstruction remains external.
- FreeDoom: web/shell.html imports pinned Enginec5548de but catches import failure and permits Doom startup. This is an optional bridge, not demonstrated causal domain ownership. The smoke script verifies mounted WADs and a playable Doom frame, not the README's entire proposed domain list.

### Historical Unity consumers

Manifest reads confirm the personal-owner NexusEngine package on development in MEGA-ARCADE, Killshot-Competition, NexusAssets, XR_Education, EXPERIMENTING_EXPECT_BLOAT, BLACK-WHOLE-MOBILE, DontLookAway2-2026 and PlayTime. EXPERIMENTING_EXPECT_BLOAT also references NexusEngine-Meta and Unity Entities. Runtime scene reachability remains untested.

DiskGolf-XR and WindRider-8-24-Release contain identical WaitForGoalHit source deriving NexusSequence and finishing on an event. XR_ED_DEMO's integration document identifies historical OSC sequence use. These consumers belong in the Unity line, not the modern JavaScript capability count.

Several historical manifests contain credential-bearing dependency URLs. No credential was used or retained in this packet. Source pointers: NexusAssets, XR_Education, BLACK-WHOLE-MOBILE, DontLookAway2-2026 and PlayTime manifest files in sources.jsonl. Exposed credentials need owner review/revocation; history/source cleanup is outside this read-only audit.

PlayTime's current README explicitly limits PlayTime-Nexus to bridge prerequisites. QuickJS backend, shared gameplay kits, browser lab and device validation are still listed as incomplete. Its existing Unity and web prototypes must be treated separately.

### Additional nested collections

- NexusArcade-Private:100 direct NexusArcade-V1/builds folders,100 _site mirror folders,99 exact tree matches,216 index.html entries across the full repo. Do not count mirrors as additional games.
- Reef Rescue is a concrete traced sample: index importmap resolves vendor/nexusrealtime; game.js creates terrain/fishing-derived rescue kits, writes InputState, ticks Engine, reads FishingSession/CatchLog/TideState/WeatherState and consumes events. Vendored reef-rescue-kit.js delegates to createFishingKit. This is stronger source integration than a descriptive kit label, but build/runtime compatibility remains untested.
- ArcadeHarness-V1 separates plain-text model adapters from command parsing/linting, idempotent tools, validation and retained lessons. Potentially reusable bounded-command structure, not a proven complete generator.
- NexusPrototypes contains three orb-runner variants and bird-explorer. Orb-runner package/loop uses Three and locally owned world logic; bird-explorer packages ReactThreeFiber, Three and Rapier. No Nexus dependency in these inspected manifests. Local world/reward/control/physics seams need individual extraction.
- NexusBuilder contains22 HTML entrypoints across stage-numbered prototypes; some are dist copies. It includes local React/Express NexusEngine2D, Rust/Flutter/Avalonia experiments, SkyhookRunnerWorldchain, and blueprint/export tools. Stage labels do not establish release quality.

### Drive correlation and capability foundry

Engine folder traversal discovered title-independent architecture records under Standards, Work, Evidence, Guides and version packages. Domain Ownership Map, Kits and Providers Architecture, Public API and Composition Model, Architecture Gaps and 0.0.5 Release Readiness were read.

The composition document defines a useful audit test: semantic input changes authoritative Nexus state and downstream consumers observe it without a parallel local path. This is architectural guidance, not evidence all consumers satisfy it. Provider descriptions and0.0.5 readiness remain planning/recorded status.

KitUniverse RAWG Capability Foundry Handoff describes evidence -> mechanic normalization -> contract -> implementation -> tests -> NexusSimulator proof -> admission -> placement -> game reuse. It records historical628 runtime-proven kits and581 placements but explicitly marks them stale, with audit HOLD. The inspected default branch has168 entries and does not independently substantiate those counts. Record the handoff as a discovery pointer, not a current kit inventory.

KitUniverse's DSK translator source supports configurable subdomain count/depth through LMStudioProvider. NexusRealtime-Automations has DomainExtractor/SubDomainExtractor/KitBuildingTurn/IdeaToProtoKitLoop and evidence-batch harnesses. Reuse their input schemas and stage gates only after inspecting their proof scope.

LittleReef CurrentState and GitHubBuildReference (August27) now corroborate local service-owned fish/genetics/breeding/Three/Cannon modules and explicitly preserve the matrix-authority design conflict. They list persistence/economy/capacity/release acceptance as incomplete. Their deployment PASS is historical documentation, not a deployment checked during this audit.

### Metadata-only and inaccessible repositories

42 complete root trees contain only README/LICENSE/gitignore or one workflow-result JSON, with no directories. These are separately classified from implemented projects. Five QTDT result-only repositories were read: all record failed controller execution, no written files and no preview. The two Three.js-named repositories in that group contain no generated game artifact.

The20 explicitly empty, one451-blocked and eight404-unavailable repositories have explicit inventory classifications. Inaccessible source is unknown, not evidence of absence. Metadata-only classification is limited to the inspected default branch.

## Recursive coverage and nested output pass (2026-09-21)

### OligarchOverflow: direct semantic composition

`LuminaryLabs-Dev/OligarchOverflow/src/main.js` installs core data/simulation plus game-local domain kits, samples input, ticks fixed1/60 steps, renders snapshots and starts requestAnimationFrame. Engine is pinned to d90dccb6bb23678a9cba0b7cac7351819f4f4eb0; Three0.185.1. `kits/oligarch-overflow-game-domain-kit/kits/product-funnel-domain-kit/index.js` consumes ExecutiveBurst, advances explicit transit, emits ProductFiled, and exposes reset/load/getSnapshot. Candidate extraction: transit completion, collection-to-progression event chain, fixed-step snapshot presentation. Proof-mode advance/loadSnapshot remain diagnostic, not player proof.

### Hidden output collections and false positives

`LuminaryLabs-Dev/NexusAgent` has81 index.html paths across tools and outputs. Five `MigratedHarness/NexusGLMHarness/games/game_N/main.js` inspected: first collection/physics, next three obstacle/coin variants, fifth rotating-cube boilerplate. Lite `projects/20260625-065813-original-massive-goal-three.js-voxel-sandb/index.html` references absent src/main.js (complete tree + connector404), yet HARNESS_SUCCESS.md records validation_ok=True/max_iterations. Thus archived success labels need entrypoint/dependency closure before reuse. `CharlieDoesDev/MatchThreeJS` all scripts and index empty; `Charlies-World/Runner01` controls image-processing workflows.

### Portfolio duplication and local rules

`thecrimsondeveloper/Portfolio`:84 index.html paths;23 game.js files yield8 distinct blob SHAs. Groups of10,5,2,2 exact copies. Storm Root and subterranean-artifacts-guard-break share code. Storm Root local Three0.184 code implements dash, pulse knockback/stun, pursuit/contact damage, relic collection, unlock, timer, restart. Extract capabilities from rule functions, not branded wrapper count. Additional JSON/shared hosts and documented ChatHub-Output branch remain to inspect.

### Presentation versus gameplay

KoolVFX src/main.js/world.js provides configurable Three room, cameras, lighting, GLB and particle slideshow, not established gameplay. Dev/LuminaryLabs archived threejs-node-app is a50-line animated scene; flow-small-game-app is a separate DOM timed dot-click game. Personal Website HarborExperience exposes star-caught/render-mode events with WebGL/fallback, useful presentation lead; full factory source pending. Dev Website nexus-arcade/app.mjs supplies catalog/install/cache/session host; embedded release routes are not automatically new games.

### Fallback and version boundaries

kickbacks-protokits-sandbox has342 ProtoKit directories but Blackwake runtime can use supplied NexusRealtime or local fallback; compatibility adapter can supply local DSL objects. NexusCelestialFactory V2 returns null on CDN failure and retains local composite kits. LostPages declares pinnedEngine55b7f33f6d008b2e3b120e370f09b96ed73105e9; its inspected src/game/runtime.js uses local Three/player code, so AR-domain ownership still needs tracing. No import or directory count establishes authoritative behavior.

### Unity dependency sweep

111 manifests across93 repositories inspected; six additional repositories declare historical Unity NexusEngine dependencies: BLACK-WHOLE-OVR,TOYBOX-XR,LL_Package_Template,LL_AssetPacks,TOYBOX_CONSTRUCTION plus separately inspected PaperDinosaurs. NexusFactory,Gold_Rush and Needle exporter are related dependencies, not modern JS NexusEngine. Manifest-negative projects remain scoped to inspected manifests; embedded scripts may still carry capabilities. LL_AssetPacks tree truncates at41254 entries. Mixed repositories with Unity fixtures (NexusBrain,NexusGameKit,NexusVoice,NexusWorldFactory,LuminaryAssets,UniLint,MuseumMultiverse) still need product-level inspection.

### Historical Drive architecture reconciliation

September4 Workspace/Versioning record confirms repo implementation authority versus Drive coordination and explicitly dated17/67 readiness versus stale12 count. September5 Sequence record specifies optional finite operation-driven domain, nested Before/During/After, no engine.tick advancement; this is design history, not implementation proof. April12 Comprehensive doc describes older C#/Dart sequencing lineage, while current JS ownership differs. WorldGen Current State reports Aug30 main72d6c9f and CPU-Vulkan checks, explicitly missing phone/GPU-browser/device timing; not fresh runtime proof.

### Source safety

PaperDinosaurs manifest adds another credential-bearing dependency URL location to prior owner-review findings. No credential values retained, used or copied into this packet. Revocation/remediation requires separate source authorization.

### Procedural factory and tracker follow-up

WorldGen uses direct Engine ECS input/simulate/resolve stages in src/runtime/nexus-world-runtime.ts; seeded terrain and biome generation in src/world/generate-world.ts. Its Engine dependency is8a60167fc945109408851c586a9355b1147438d5. Drive Current State documents CPU-Vulkan/static evidence and explicitly missing browser GPU/device timing. WorldFactory shared/world-generator.js exposes deterministic recipe climate/biome/mesh/material/light-bake functions; this is reusable generation-provider material, not a gameplay loop. Botany custom-specimens/runtime.js evaluates supplied JavaScript via new Function with shape validation; the helper API does not sandbox code. Aviation builds validated flight descriptors/fuel/time estimates, not flight physics. ShaderFactory has implemented GLSL shape/noise/blending, while README Triceratops path disagrees with Stegosaurus tree.

Master Tracker: all12 tabs A1:Z150 read. Work Packages has74rows:1mission+6domain+67atomic; atomic17Complete/50Planned. Dashboard54Planned includes4aggregate domains, explaining the apparent count mismatch. Source snapshot8a60167f is historical; validation lists Physics, Render, provider replacement, composition, consumer and release proof Pending. Version Register0.0.6Planned,0.0.7–0.0.10Proposed. Rows151–1000 were then read on all12tabs and returned empty; the full currently allocated sheet values are covered. Formatting, comments and linked-document contents are separate.

## Source expansion and remaining-repository classification (2026-09-21)

These are connector source observations, not executed validation. All 392 inventory entries now have a scoped classification; nested behavior and branch coverage remain incomplete.

- **OpenECS:** `openecs-js/src/index.js` defines its own ECS, generational handles, command buffer and ordered/fixed-step systems. `openecs-gamekit/src/index.js` supplies movement, render synchronization, lifetime and arcade systems. The Three demo `openecs-demo/src/index.js` drives movement with sine/cosine values, not keyboard input. Extract scheduler/adapter patterns, not a claim that NexusEngine already implements them.
- **NexusFactory-Kits:** `src/catalog.js` declares 45 domains and 11 kits. `src/contracts.js` and `src/domain.js` define parameters, validation, exports and scoped randomization groups. Ballista runtime wraps generate/validate/reroll/export; aquatic phased-kit invalidates downstream output across nine phases. Reef-kit produces 2D pixel images, not a Three.js reef world. Capability/media type must be part of a rolled asset contract.
- **NexusFactory:** tree contains 223 index.html paths and 218 unique HTML blobs, overwhelmingly sweep previews. These are procedural-asset outputs, not 223 distinct games. ArcaneTotemFactory, ChestFactory, ModularForgeFactory and ui have separate preview entrypoints; generation ownership still needs deeper tracing.
- **Agora:** `agora-sources.lock.toml` pins Engine bacc8fc0073bf92910e26776a6695d2b8ec45858/OpenXR build target. `crates/nexus-engine-host/src/lib.rs` is a 24-line metadata wrapper; that alone does not establish executed Engine runtime. The separate OpenXR runtime crate needs capability-level tracing.
- **Lumina:** `Lumina-Alpha/app/bootstrap.js` creates Engine with domainKits:false, installs contract-defined kits and ticks around bridged calls. The locked Engine revision is a74e8689d1a71c0b42236c009f0f4c46e9b89387. Python child-process JSONL owns learner operations; Engine service hosting is not evidence of engine-native learning.
- **GlootieAR:** blueprint validation plus `src/builder/action-runtime.js` provides a closed action set (set/increment/decrement/toggle/append/remove/navigate/reset). Useful precedent for small-model schema-to-action dispatch; app-state operations are not yet spatial gameplay domains.
- **nexusheadlessplayer:** `src/index.mjs` includes actual keyboard/mouse actions, timed holds and recording, but also arbitrary evaluate actions. Evidence must distinguish observed normal inputs from diagnostic script mutation.
- **x402-MOBA-testnet:** `src/simulation/basic-match.mjs` has local fixed-step lane combat, commands, damage/death/respawn and core victory. It is a rules extraction candidate, not a Three.js or demonstrated NexusEngine game.
- **ProjectArrowhead-2025:** opt-in `ProjectArrowhead-Stegosaurus/AgoraLauncher-NexusEngine-V2/` has authored menu state/control XML and ECSR shell/network event routing. Historical launcher composition is a useful state/action example; configuration declarations alone do not verify native handlers or modern JS Core compatibility.
- **ProjectLightspeed-05-2026:** `Lightspeed-Glass/src/core/trace.js` owns bounded ray branching, intersection, reflection/refraction and medium tracking; `src/adapters/three/index.js` renders objects/ray segments. Good light-routing puzzle candidate after validation. Static concerns: exiting always targets environment IOR rather than an enclosing medium; total internal reflection does not explicitly redirect all transmitted power; existing mesh IDs update transforms without rebuilding changed shape/material. These are source-derived validation targets, not measured failures.
- **nexusspace:** Three.js/data-source simulator documented in memory.md, with Horizons/CelesTrak/fallback boundaries in the tree. `NexusSpace/src/time-state.js` stores milliseconds but tick adds scaled seconds; verify intended speed units before reusing the clock. No runtime test performed.
- **TheCountryClubWeb:** one Canvas2D/PeerJS host contains five distinct rule branches: farming (tool/seed/water/harvest/sell), reapers (shrinking hazard zone/scored collection), pond (currents/finish crossing), mushrooms (fog/search/decoy), swimmer (race). All are non-Three. Randomness uses Math.random; client win claims directly call endGame despite a validation comment. Extract rules behind seeded and authoritative action contracts before reuse.
- **Texture authoring:** personal TextureFactory has `TextureFactor-Stegosaurus/lib/TextureEngine.js` raw WebGL texture passes; Dev NexusTextureFactory's Spinosaurus core has shader/mask/blend recipes. These provide material/texture generation leads, not game loops. NexusIdeaFactory's Avalonia orchestrator chains idea lists via LM Studio and unseeded Random; it is concept tooling, not deterministic executable composition.
- **False positives and alternate runtimes:** Pygame3D is a C SDL/OpenGL/ImGui editor stub; GrimmsPenance-Feb2026 is Pygame2D; Tetris is Canvas2D; WestXEast is a Three dress viewer; bzaar-demo-forked is a React Three Fiber editor; DidItHappen is a Three scene/presentation prototype. Echo3DURLViewer lists asset URLs, VR-Relieve-WebDemo contains a compiled Unity web distribution. Keep these distinct from complete Three.js games.
- **Duplicate/historical docs:** NexusCentral-Deprecated V0.2 and NexusCentral-Deprecated2 V2 README have identical blob 14147ead0252b93973e623812742f7823c214ea2. Nested review artifacts in Website-Private, Software and three NexusSimulator exports remain source-tracing work, not additional independent games.

### LittleReef Drive reconciliation

Read all 13 value tabs in [LittleReef-ProductionTracker](https://docs.google.com/spreadsheets/d/1JL1YuEZYvZc9XcoUrJZNIW6dK_iABD8MPgRw6tz1e-o/edit). GitHub Build records 28 tasks: 13 Complete, 1 Blocked, 9 In Progress, 5 Not Started. Its last listed handoff revision is b53dc72440be466b01e1f76b54ab84dc64ded587 (2026-08-27), not proof of today's source state.

Sandbox Work has six Completed rows and Milestones marks M0–M2 Done, but all 25 Acceptance rows remain Not Started. The live-build tab explicitly blocks matrix authority (LR-GH-003), leaves nursery capacity, dev dashboard and cross-surface agreement unimplemented, and calls browser evidence partial. Preserve these scope distinctions. Source services/geometry may be reusable while full save/eligibility/capacity/release contracts remain unfinished.

## Official kit behavior audit (2026-09-21)

Inspected actual implementations behind all 23 official catalog entries (including the previously read lock/socket source). `capabilities.jsonl` now distinguishes implemented behavior from settings/forwarding/descriptors. No kit tests were executed.

- Five nominal mechanic kits—lock/socket, moving target, sorting, reveal light, symbol alignment—primarily initialize state and forward to interactionTargets. They do not implement their named physical/rule behavior. Admitting them solely because status is official would overstate build coverage.
- The shared migrated-gameplay smoke verifies exports, schema validity, installation, one tick and duplicate installation for 20 kits. It does not validate each mechanic, failure, reset, spatial condition or player interaction.
- ObjectiveFlow stores durations/timeouts but does not enforce failure. Its reset reconstructs old steps with old progress/complete overriding defaults. Both ObjectiveFlow and ARExperience emit completion whenever completed, and inspect the old step's complete flag for step events. Treat reset/event correctness as open until directly tested.
- InteractionTarget forwards objective progress even without a valid target; an explicit target is not checked against the action or complete state. SurfacePlacement can submit placement via the anchor event and directly via objectiveFlow. Action-to-consequence validation must cover these joins.
- Combat is a scalar health counter; companion arrival is elapsed progress; ragdoll is kinematic/procedural posing; camera collision is terrain sampling/sphere pushout. These are reusable bounded behaviors, not general physics/pathfinding.
- Forest placement implements useful seeded route/slope filtering, but its cache key uses route length rather than coordinates and excludes terrain changes. Greybox room presets/render descriptors need a renderer and collision adapter.
- Agriculture is a stronger reusable example: revision-checked plan/commit, transaction idempotency, growth and snapshots, with inventory settlement explicitly external. Seed-kit provides named deterministic streams and snapshots. Fishing contains a substantive action/state loop, while documented input/persistence/full-game boundaries remain external.

### LittleReef source check against tracker

Current `src/breeding/BreedingService.js` rejects missing/duplicate parents, then creates a seeded child and lineage. It contains no eligibility/capacity check. `src/fish/FishGenome.js` uses categorical parent selection, numeric blending/jitter and a separate seeded 8% mutation branch. Thus the tracker's older risk assumption of no v0.1 mutation is not a reliable description of current implementation. `src/game/GameStateService.js` tracks discovery and breed-count goals; its healthy-reef goal is body-type count plus breed count, not measured population/health. Source-level meaning must be retained when extracting reusable progression.

## Game collection runtime ownership (Private100 and canonical16)

Static source inspection, not gameplay execution. Full per-entry paths/hashes and renderer classifications are in collections.jsonl; inspected files are in sources.jsonl.

### Private arcade: counted code, not titles
- LuminaryLabs-Dev/NexusArcade-Private has100 build configurations and100 HTML entrypoints inspected.95 game.js files share21 unique blobs; five games keep logic inline in HTML. Published _site mirrors remain separate deployment copies, not extra games.
-71 entries use the identical212-byte route-objective wrapper. The shared src/runtime/route-objective-game.js installs timing, local simulation and pressure kits. It implements lane/route steering, hazard damage, pickup/action gates, score/resource feedback and objective/finish checks. Genre/fantasy prose and config kits names do not install new behaviors. Only one of71 configurations enables each of requiresAction, timing.enabled, campaign.enabled and winRequiresCampaign; numeric tuning still varies.
- Five entries share the216-byte deep-replacement wrapper but select genuinely separate code branches: crane grabbing/depot drop, greenhouse cell maintenance, elevator passenger capacity/unloading, network charge/infection actions, and seed pickup/room delivery. Thus unique wrapper hashes alone also undercount behavior.
- Shared deep runtime requires target progress AND campaign time for success; default72minutes is not proof of a rich campaign. Elevator wave IDs use Date.now(), so deterministic replay needs clock/identity replacement. Runtime mode lookup falls back to network for unknown values; a future compiler must reject unknown IDs before execution.
- Renderer tracing yields14 Three.js and86 Canvas2D entrypoints. This is a static source classification, not a claim that all entries load or are playable.

### Reusable private mechanics and required extraction
Paths below are under NexusArcade-V1/builds/ in the Private repository.
- the-infinity-bean-stalk/game.js: local Three.js grapple/anchor attachment, rope/tangent movement, grounded jump and release boost; separate traversal semantics from camera, geometry and direct input.
- industrial-overgrowth-flight/game.js: local Three.js flight, boost/overdrive cooldown, collision lives/invulnerability, and spendable repair/speed/dodge upgrades; seed/reset economy and actor state before reuse.
- aether-threads-rpg/modules/QuestSystem.js and InteractionSystem.js: local quest states and interaction coordination. Quest completion unlocks a portal through EntityFactory; extract IDs/state transitions without retaining global browser ownership.
- relayfall-sky-below/game.js: local EcsWorld/ComponentStore, fixed-step movement modes, dash resource, relay restoration and hazard damage. Similar architecture is not NexusEngine provenance.
- skyline-idle-builder/index.html: local Three.js placement/upgrades/income/save loop; inspected income formula uses lot tier/base income and district multiplier, not demonstrated road/service economics.
- infinite-tropical-jetski/index.html: local Three.js water/wake/trick/vehicle candidate. tropical-jetski-rescue/game.js is a different Canvas2D Nexus kit consumer.
- LGT-Bosses, cozy-fishing, reef-rescue, tidebound-delve, freight-surge, midnight-pizza and it-pixel-place show additional concrete kit consumers; follow their imported kit versions before extracting. neon-drift-courier uses the separate OpenECS shared runner, not NexusRealtime.
- procedural-nav-lab is navigation/procedural tooling. LGT-Fighter's transformer/MoE naming does not itself establish trained-model behavior.

### Canonical Experiments: namespace imports are not ownership
All16 canonical HTML routes were traced to their active primary entries. They reference114 external script entries in total; supplemental readiness modules remain partially inspected.
- ThirdPersonFollowThrough uses Three.js and a Nexus debug engine with local follow/rig behavior. Its rooftop rescue entry adds DOM descriptors and GameHost counter actions; those functions do not enforce spatial anchor/rope/triage conditions. Do not claim physical rope rescue from those counters.
- vr-platformer-board uses Canvas2D local platform collisions/collectibles and pointer-simulated head pose. Boot discovers an Engine factory but does not instantiate it. This is not WebXR execution proof.
- The Cavalry of Rome's active terrain-pass uses raw WebGL2 with a Canvas overlay and local campaign state. It is 3D, but not Three.js in that inspected base implementation; follow subsequent world-action/tactical scripts separately.
- Signal Isles imports NexusEngine in main.js, while game-composition.js owns a plain session/kits object and returns kits as engine. Its local scan/resource/build/gate/cargo chain is valuable, but not already canonical Engine domain behavior. Static risks: reset does not clear scan-site __progress, survival compares absolute elapsed>36, stop does not guard tick/flushInput.
- Hellscape imports Nexus namespace for metadata but creates gameplay through its own1000-byte protokits/runtime.js: resource Map, queued events and kit systems. Renderer is Canvas2D. Harvest, building, fortification and defense should be extracted with an explicit runtime adapter.
- Fogline Relay and Zombie Orchard actually instantiate/tick Nexus engines, with local session/gameplay kits; both prefer Three.js with Canvas fallback. Fogline scan range/facing, gate progression and wraith patrol/chase provide a bounded semantic extraction lead.
- Next Ledge connects a pinned generic-route-cargo-extraction kit (ProtoKits04d34f049f58ae359cf71d43466c429dac2a6d08) to a local visual session. The Open Above creates/ticks a Nexus ProtoKit flight/flock/environment stack.
- Tropical Island's importmap redirects26 ProtoKit URLs to src/local-kits.js. Several fluid/water exports merely create ready:true state with no system. A name such as WaterPhysicsKit cannot substantiate buoyancy or fluid simulation.
- Infinite Radial Terrain can continue when Nexus import fails. Meadow primarily supplies scene/presentation descriptors. Cozy Island currently starts cloudbar.js with descriptor-based terrain, foliage, smoke, clouds and local camera/player motion; the older rail loader is not its main entry.
- Sora is a DOM compatibility/launch gateway into The Open Above, not another independently established flight game. Peer Scene is a DOM/navigation host. Signal Bastion uses a real Nexus engine and defense kits with a Canvas renderer.

### Drive cross-reference and generator consequence
The previously read Drive document [08 - NexusEngine Composition Guide](https://docs.google.com/document/d/1DGna5BkLfgm4a8zrbhIkjLluaTY23rHSb1TIs0Rzmyw) is an Across the Canopy ownership guide: semantic/persistent state belongs to Engine/project kits; Three.js consumes presentation and emits input intents. It is architectural context, not certification of these other games.
For future list/Jev routing, distinguish canonical runtime implementation, local semantic implementation needing extraction, presentation descriptor, and prose-only claim. Each candidate needs an exact source/version and executable input-to-state contract. Keep deterministic validation authoritative; probabilistic matching may select candidates but cannot promote a label into a capability.

## Readiness extensions and API compatibility pass

All114 script paths referenced by the16 canonical HTML routes, plus8 imported from ThirdPerson app/index.js, were retrieved and screened:122 modules. Fourteen selected readiness domain bodies were additionally inspected. The coverage is source/import/function analysis; it is not122 proven behaviors.

### Readiness is often derived presentation
- Cozy sea-turtle-hatchery entry constructs tides, heat, predators and volunteer coverage from Date.now() sine waves, then calls domain.evaluate and paints a panel. It does not read actual nest or player-care state. This is an animated descriptor example, not a demonstrated hatchery loop; wall time also defeats seed-only replay.
- Infinite Radial Terrain avalanche extension fabricates surrounding rescue samples from camera offsets and trigonometric height/climate formulas. Domain scoring/markers are useful visualization material, but not evidence that an avalanche or rescue operation occurs.
- Zombie antidote press creates1–4 queue descriptors with applesNeeded/readiness/label; the inspected function does not remove ingredients, produce an antidote or heal. Its entry merges descriptors into GameHost.
- Open Above medicine-sling readiness derives alignment from clearance/speed/roll and emits dropCall text. No release, impact or delivery transaction is implemented by that descriptor function.
- Signal Isles freshwaterProgress derives scores from generic harvest/build/cargo/gate counts plus optional named facts. The base composition inspected previously does not generate scan.desalination.site, build.solar-still.01 or purify.cistern.01. A high score is not an actual purified-water resource.
- Tropical cistern boil readiness uses cosine time, marker counts and hash values; minutesToSafe is a displayed calculation, not a verified thermal/contamination simulation.
- Sora sterilizer status is a formula over pad stability/time; Signal Bastion healing wards are readiness rings based on credits/lives/waves. Neither sampled function performs sterilization/healing.
- All14 scoped factories are retained as descriptor/readiness candidates in collections.jsonl, not promoted to gameplay adapters. Uninspected transitive domains remain unverified.

### Concrete gameplay contrast
Cavalry campaign-world-actions and space-select passes implement territory adjacency, troop movement, one-action budget, turn reinforcements and greedy rival moves. tactical-grid-pass imports hex-engagement-pass, whose resolveActive compares weighted army strength and applies deterministic losses; retreat cancels before commitment. These are local mutable campaign rules, not canonical Engine domains. The hex presentation does not establish a separately controllable per-unit tactical combat simulation.

### Current public API versus historical consumers
Connector-resolved main heads:
- NexusEngine:a74e8689d1a71c0b42236c009f0f4c46e9b89387.
- NexusArcade-Private:1c602f3a93bf299521ffb6c3e4b9d47f81d89823.
- NexusEngine-Experiments:b05957890f514356d2ce42e2510bbba6f424e3c9.

Pinned re-reads confirm the current Engine index blob6cbdd4f224cf3cd7a4feb6f976ddc9fd627ba8d1 and Private vendored index blob7bb76a62579f4440ccc9525eecd48637b9fdf6a3. Engine package/release metadata declares0.0.4. Reading the public index and all its direct star-export modules yields54 explicit root exports, including createEngine but not createRealtimeGame, createRealtimeEngine, createRenderer or the legacy gameplay factories.
- Zombie Orchard's kit-stack directly calls12 absent legacy root factories, including movement, world physics, objective flow and pathfinding. Historical API usage is not current-main compatibility.
- Next Ledge probes old factory names but falls back to createEngine; absent aliases alone do not prove that fallback fails. Its renderer fallback contract still needs reconciliation.
- ThirdPersonFollowThrough imports src/game-kit-composer.js from Engine main; the exact-main-commit connector read returned404 for that path.
- Private route-objective-game imports createTimingWindowKit, gradeTimingWindow and TimingWindowState, absent from its bundled index. This shared dependency affects the71 route wrappers under the inspected importmap.
- Six further Private consumers request absent bundled names: freight-surge (transfer zone), it-pixel-place (economy/facility/lifecycle/occupants/requests/schedule/transport and state exports), riftwarden-wilds (camera/locomotion/physics aliases), tidebound-delve (locomotion), tropical-jetski-rescue (assistance/transfer), and you-thought-you-were-big (affordance/landmark/scale).
- These are source-level mismatches, not observed browser failures. CDN cache state, server rewrites, uninspected alternate entrypoints and published deployment state are outside the present read-only proof. Exact missing-name lists are in collections.jsonl.

### Drive reconciliation
Eight further Docs were read with revision receipts in drive.jsonl:
- Runtime and Lifecycle Architecture prescribes public createEngine, manifest-backed kits, n:* / engine.n API assertions, deterministic tick and lifecycle cleanup.
- Documentation and Evidence Standard explicitly rejects imports, installed kits, ticks, labels and resemblance as sufficient proof.
- Validation Strategy requires source/export, deterministic/lifecycle, provider, cross-domain, consumer and release evidence.
- Version Management and Decision Log distinguish repository authority from Drive coordination, frozen0.0.4 and intake-only0.0.6.
- 0.0.5 Overview/Scope/Work Package Map preserve67packages and3343detailed rows, with Open Above consumer rebuild/main-SHA proof required. Their current text is planning/status documentation, not evidence those release gates passed.

These documents explain why historical working snapshots must be kept with their runtime source/version. Future expansion should extract semantic transitions from a pinned candidate, adapt them to the canonical API, then separately prove renderer mapping, normal input, reset and deterministic replay. Jev/list matching may select a candidate or identify a missing contract; it cannot make a descriptor-only module executable.

## Nested Lite and Portfolio source audit (2026-09-21, pass10)

Scope:205 additional connector file reads; no source changes or runtime execution. Resolved heads are NexusAgent main1458aead98aab5714a72f89e41deb62d91a593e3, Portfolio development629a8bb14c86862e8c6f0f98a18b35a331282605 and ChatHub-Output32f4c6201286177c5bf7b6104c13522333763530. File identities are in sources.jsonl; duplicate groups and entry counts are in collections.jsonl.

### NexusAgent-Lite: distinguish executable rules from success packets

Under LuminaryLabs-Dev/NexusAgent/NexusAgent-Lite/projects,23 game/solar src/main.js paths collapse to5 exact blob groups:
- 045425 sample:126-byte main.js and112-byte index.html contain plain-text task labels. HARNESS_SUCCESS.md says validation_ok=True; that does not establish executable output.
- 050215 representative,8 identical main scripts across differently named tasks: actual local Three.js collection loop, six pickups, three oscillating enemies, three lives, success/failure and reset. Movement and hit cooldown are frame-based; enemies use absolute animation time, so reset does not reproduce their phase. No Nexus runtime import in this source.
- 052920 representative,2 copies: House Below Station9 foundation. Full nine-module game closure read. Proximity interaction hides log/fuse meshes, records inventory and lowers the gate. Flashlight battery drains; objective changes are visible. Entity labels progress dormant/listening/stalking/hunting, but movement is a sinusoidal orbit and proximity only updates pressure; no pursuit damage or completed ending. Player has bounding-box clamp but no gate/office collision. Audio module returns text, not sound. Save loads semantic flags while recreating visible items/closed gate without restoration, so saved state and scene can disagree. Frame-based movement/battery need explicit time contracts before reuse.
- 070458 representative,3 copies: voxel terrain preview with pointer-lock look, planar movement, item catalog/hotbar, panels and position save. Local source closure has no mining/placement interaction, collision/gravity, recipe consumption, health/stamina/breath simulation or functional pause buttons. F only writes a torch toast; Tab switches a label. Recipe buttons have no handlers. scripts/validate.mjs contains JSON-like project description, not executable validation. Treat terrain/catalog/UI as separate extraction leads, not a completed survival system.
- 081020 representative,9 copies: Three.js solar editor with raycast selection, orbital motion, radius/speed/color controls and JSON/localStorage. Randomize replaces the planets array while panels retain the old array; import changes the panel array without rebuilding meshes. SphereGeometry(radius) plus scale(radius) squares the visible radius. Rebuild clears groups without disposing geometries/materials. Screenshot action only writes screenshotRequested metadata. Existing validation checks filenames and text markers; it cannot catch these state/scene defects.
- The previously sampled065813 voxel folder still has no src/main.js in the complete tree. Later source-bearing versions do not repair that earlier output. Other NexusAgent harness lanes remain separately scoped.

### Portfolio: entrypoints change the interpretation

All84 index.html paths were read;81 are under Portfolio-Vite/Pages. They divide into15 arena pages loading ./game.js,4 dedicated game scripts,6 shared Canvas host pages and56 archived shared-host pages. Three remaining indexes are site/tool entrypoints.

All56 archived pages resolve ../arcade-bootstrap.js to absent Pages/arcade/archive/arcade-bootstrap.js. Eight neighboring archived Three.js game.js files are not referenced by those pages. Their presence cannot establish a Three.js playable entrypoint. The61 existing referenced JSON configurations cover26runner,5phaseDrop,8orbit,6pulseGrid,8harbor,5echo,2labRift and1rhythm; archived cli-wizard's referenced configuration is absent. Server rewrites/deployed copies were not tested.

The shared Pages/arcade-runtime.js is Canvas2D, with real mode-specific rules:
- runner: lane obstacles, timed stages, checkpoint lanes, bonus holds, combos, burst patterns and hidden-obstacle reveal.
- orbit: pointer targeting, rotating targets and combo scoring.
- pulseGrid/rhythm: timed input windows and scoring.
- labRift: spatial pickup collection opens an exit; sentries animate but no damage/collision branch exists in that mode.
- phaseDrop: lane/phase matching with collision failure; score uses floor(dt*28), but the common frame driver caps dt at0.033, so the nonnegative increment remains zero.
- harbor: pointer attraction/inertia plus current bands and buoy collection. Restart resets position/pickups but leaves velocity.
- echo: reveal a pattern, accept mapped inputs, penalize mistakes and complete a sequence.
These are useful gameplay semantics for future Nexus domains, not current Nexus-engine integrations. Several shared handlers lack running/pause guards, and some modes update particles in addition to the shared driver. Replay and lifecycle semantics need normalization.

The23 game.js files collapse to8 inspected blobs. Among the15 actual arena entrypoints:
- Ten share a configurable arena implementation. Template names adjust pursuit, movement bias and scoring; relay_chain still collects any nearby relic rather than enforcing an ordered relay graph. extraction_maze has ending wording without a maze-specific branch. Broad narrative seed fields are not evidence their promised mechanics execute.
- Storm Root and subterranean-artifacts share a baseline dash/pulse/pursuit/relic-exit implementation.
- pier-spin adds contact deflection/stun during a0.6-second spin window.
- rooftop-while adds patrol vision-angle/range checks, alert pressure, crash disabling, hold-to-capture uplinks with decay, spotted capture penalty and held extraction. This is a stronger reusable stealth/capture lead; vision has no occlusion test in the inspected function.
- dock-spin has sequential disks, conditional surge/vault, vertical fall damage, electrified wedges and final-beacon completion. Its JSON still says route_runner/targetRelics, while updateGoal does not gate on relic count. Extract the actual disk-transition and hazard rules, not that label.

Four dedicated scripts:
- Aurora Beacon Run: Three.js three-lane boat, bonus/pressure phases and beacon collision. Boat y0.25 versus beacon y1.4 gives minimum distance1.15, exceeding the distance<1.1 hit threshold; source therefore cannot reach that collision path under these fixed positions.
- Lantern Rift Lab: Three.js sequence memory, timed reveal, correct-input extension, speed escalation, wrong-input ending and restart. keyMap uses Digit1..4 but indexes event.key; numeric key instructions do not match, while lowercase q/w/a/s can match.
- Pulse Relay Forge: Canvas2D target reaction, combo and shrinking deadline; same Digit/event.key issue.
- Tideforge Arena: Canvas2D circular movement boundary, incoming hazards, replenished pickups and survival score; not Three.js.

### ChatHub-Output branch and builder provenance

Branch tree is complete at1749entries. outbox/games has one game, Neon Relic Sprint; latest-game.html and the archived page share blobab7d4d86834bee9e5d7c4ff10db6c4c17674c12c. It is a DOM collector/avoidance game with45-second timer and120-point target. Restart does not reset vx/vy. latest-result.md labels it direct-validation-output, not evidence it was generated by the current model pipeline.

Development ChatHub-Harness/game_spec_renderer.py normalizes a bounded numeric/cosmetic spec into one Canvas2D collector/dash/hazard template. The generic workflow describes runtime-fit planning; it does not expand the renderer into arbitrary rolled mechanics. Output branch DOM code differs from that Canvas renderer. Preserve this provenance distinction when mining lessons or counting families.

### Drive correspondence and reuse boundary

Two further documents read with revision receipts:
- Architecture Index (1jXz2lIl76YjcRd6ObYGsJhQqG4UAnyTl-DrzO8GQlso) explicitly orders manifests/exports/executable source/tests above catalogs, architecture prose and historical plans. Its repo pointers are pinned to historical8a60167f.
- Risks and Blockers (1pFScXK0oHQ43zhGl41YeKo74kjPWYqnXXK0Pf6euxhc) records pending physics/render/providers/cross-domain/Open Above/release proof, plus an unverified immutable0.0.4 reference. This is the document's recorded status, not a new execution result.

For list/Jev-driven composition, candidates should carry implemented action, state transition, consequence, reset dependencies and source identity. Prioritize sequence memory, capture-and-decay, patrol sensing, contact deflection, disk transition, current steering and semantic scene restoration. Keep pure editors, static catalogs, decorative threat labels and repeated copies separately classified. A typed decision can choose among source-backed mechanisms; it cannot promote missing runtime behavior.

## Harbor, Lost Pages, hosted games and WorldGen correspondence

### Harbor factory: useful generation structure, bounded proof
thecrimsondeveloper/Website has a substantive factory at factory/harbor-world-3d/src/factory.mjs, layout.mjs and terrain.mjs. Named seeded streams generate curves, heightfield, placements and asset/world recipes. High/auto/low inventories retain stable prefixes. GLB/PNG export and geometry validation are implemented. Source metadata refers to NexusFactory-Kits; that alone does not establish NexusEngine runtime ownership.

layout.mjs tries32 placements and may retain best-clearance even when it violates spacing. scripts/validate-layout.mjs separately checks pairwise spacing and bounds for its configured example. Its historical technical-gates.json reports pass for seed crimson-harbor-604 with revision working-tree-before-final-commit, not a general all-seeds guarantee. reroll(stream) changes the global seed while retaining parameters; it does not preserve unrelated branches.

src/components/shader-renderer/three-backend.js implements raycast selection, caught-ID deduplication, line/catch animation, localStorage total and respawn after collecting all stars. scripts/validate-star-interaction.mjs invokes the production raycast/catch/update methods on a constructed backend and compares state/framebuffer changes. It does not send a browser pointer event; it substitutes water material. The stored report says pass, but was not rerun. Performance report is triangle/draw/payload accounting, not measured frame pacing. Clock and respawn timer continue across rendering pause, so seeded generation does not imply deterministic interaction replay.

### Lost Pages: actual maze services versus named mechanics
MuseumMultiverse-TheLostPages pins Engine55b7f33f6d008b2e3b120e370f09b96ed73105e9. That historical root exports the AR/gameplay kit factories used by session.js; do not substitute current main's narrower root surface.12 pinned dependency files were inspected and retained as separate version receipts where current-path evidence already exists.

The local character-map chain is implemented: wall placement -> unfold -> seeded DFS maze -> opening-checked cardinal movement -> coordinate goal. canvas-maze-map/service.js selects a farthest reachable goal; character-map-experience/service.js blocks movement before unfolding and coordinates resets. Invalid-size validation, snapshot validation and full lifecycle still need attention before extraction. Declared services become capability tokens; defineDomainServiceKit installs the returned API object without restricting method names, so different token/method wording is not itself a missing-method failure.

The other named facades at the pin (micro-platformer, symbol-alignment, moving-target, sorting, reveal-light, lock-and-socket) initialize descriptive state and forward actions. They have no systems implementing jumping, angular tolerance, moving targets, sorting-zone checks, overexposure or socket filling. session.js passes sceneRecipe/interactionDataset where several factories only read flat config fields. interaction-target-kit advances a target counter and emits ObjectiveFlowAction even without a matching target. Explicit target IDs bypass action matching and can select completed targets. objective-flow-kit counts action names without checking geometric/timing constraints. Those datasets describe intended behavior, not implemented rules.

Additional source-level concerns: ObjectiveFlow reset reconstructs from existing steps, whose trailing spread preserves old progress/complete fields; duration/timeout declarations have no time-based failure logic in the inspected kit. The immersive session's render handlers call runtime.handleSwipe but the function returns an object without declaring runtime in its scope. Unfold setTimeout is not retained/cancelled by stop/reset. These are source findings, not executed failures.

src/game/runtime.js is a separate Three.js scene/player adapter: hub and eight pages share movement and proximity-goal completion. It imports no NexusEngine directly. Different page labels/assets do not establish different gameplay. Restart resets location/completion but does not explicitly clear input state.

docs/RELEASE-VALIDATION-2026-09-08.md explicitly calls the release partial: build/static routing evidence, no finished gameplay/device-AR acceptance, no real Website staging. New source targets /lostpages/; the existing Website/apps/lost-pages/ build is intentionally retained. The older July audit's NexusRealtime-dependency statement is superseded by current package/source, while its presentation/rules ownership concerns remain relevant.

### Hosted non-Nexus games and duplicates
LuminaryLabs-Dev/Website games/aether-threads and games/the-infinity-bean-stalk game.js blobs match their NexusArcade-Private V1 copies. industrial-overgrowth-flight is a different version with a canvas-readiness start wrapper; keep both source identities. All three HTML entries load Three r128 from CDN. Cosmic Invaders and Viscous use Canvas2D, so exclude them from the Three.js3D count while retaining mechanic leads. The20 apps/lost-pages HTML routes share the same entry blob; they are route wrappers, not20 games. Deployed JS bundle identity against newer source remains unverified.

### Drive: exact versions and evidence boundaries
Three WorldGen documents read: Overview, Delivery & Validation Summary, MNT-357. Fresh GitHub lookup agrees with their commit72d6c9f2325d162ba986ca828095d9abbd99fe71/tree3829ba2449e97912a0d12879553817204d72b55b. Source runtime/generator were previously inspected; this pass adds renderer structure and test-source checks. Nine tests cover seeded model inventories/variation, clock/movement/input and scan/tutorial state; they are not a complete playthrough. One test titled all four biomes asserts only at least three. Historical native-render and fallback-browser claims explicitly exclude live GPU/mobile/physical-touch/performance proof.

The Engine Release Process Drive document requires exact candidate identity and lifecycle/provider/integration/consumer validation. Its immutable0.0.5 release steps are policy, not proof of publication. Preserve source version, host path and evidence mode on every reusable capability record.

## Pass 12: publish entrypoints, packed LOD, and historical builder copies

Source-only review through connectors. No games or tests executed.

- **LOD Showcase** (`LuminaryLabs-Agents/NexusEngine-LOD-Showcase`): decoded six `payload/p*.txt` parts as data, preserving blob receipts and decoded SHA256 in collections. Source is a local WebGL2 laboratory, not an imported NexusEngine/Three consumer. It implements projected-size LOD (tree thresholds220/90/35/12; building300/130/48/16),14% hysteresis, two mesh/three splat levels, batching, far/direction culling, seeded populations and GLB parsing/normalization. Rebatch checks at140ms with movement/angle thresholds. Its96x96 CPU raster silhouette/color/depth comparison is a proxy, not rendered browser acceptance. Objaverse catalog has one generated procedural reference. Useful render/asset-domain extraction, no completed-game claim.
- **HorrorCorridor** (`LuminaryLabs-Publish/HorrorCorridor`): active root route resolves to BrowserGame and createHorrorCorridorV2, not the historical V2 folder. Engine pin a74e8689; root browser uses fixed-step accumulator, visibility handling and teardown. Composition separately coordinates engine/domain ticks. `nexusRuntime.mjs` validates dependency ordering and injected navigation services.
- Corridor `definitions.ts` rolls lengths24/32/40,widths6.4/7.2/8.4,height3.8/4.15,side fixtures and role from seed/index; entry/exit aperture3m. It is one corridor grammar, not a catalog of distinct room mechanics. `places.ts` retains previous/current/next plus threat corridor, derives collision and0.5m navigation cells from definitions, checks snapshot definition drift and offers idempotent clue discovery. Opening residency can contain two places.
- Dread `stalker.ts`: injected pathfinder, three spawn candidates,750ms repath,movement budget and blockage state,snapshot/load/reset. `placeExperience.ts`: EngineSequenceNode flow, ordered checkpoint restoration and idempotent entry/departure events. Reuse these contracts with seam/collision/path agreement tests; do not move gameplay ownership into rendering.
- **Drive cross-check**: current Handoff published f2888fb equals GitHub main; earlier Evidence Index references539982a. Older V2-destination guidance is historical. Current handoff reports traversal,capture/restart,reward and automated checks, but explicitly withholds visual/audible acceptance and long-run performance proof. Its eight-hour ambition and124 manifestations are not unique-content evidence. Latest root source supports the stated corridor ownership; historical check claims were not rerun.
- **TheLongHaul**: `index.html` resolves Three0.165.0 and NexusEngine b941c9b2995e3449c6987908657753e2cf2df242. This closes the import-map uncertainty; remaining application chunk ownership still needs inspection.
- **ZombieOrchard**: `src/renderer/world-canvas.js` renders rectangles in Canvas2D, while HTML renderer dispatches active-session commands. Keep its local domain architecture as a reuse lead; exclude from Three3D counts.
- **NexusCentral**: three ad-hoc RPG variants have identical17-file src trees. They are DOM/grid scaffolds; NPC repeats token/quest changes, combat is placeholder, and load does not restore authoritative state. The named waterfall intake instead implements a Three lane runner; failure hides the player and restart omits visibility restoration. Score is frame-dependent, spawns use Math.random and removed obstacles are not disposed in the inspected path. Repair these shared invariants before extraction.
- **NexusBuilder**: SkyhookRunnerWorldchain has source-visible classic-script parse blockers (top-level return and literal escaped quotes); its source acknowledges a truncated model result. Boxes/camera movement do not establish a game. NexusAgentThreeJsShowcase is an orbital presentation/input toy: no objective/end states, partial pause/reset and mixed seeded/unseeded geometry. Other stage outputs remain pending.
- **DSK Proposal** on Drive describes the useful promotion boundary: APIs,state,events,dependencies,reset/snapshot,renderer separation and multi-configuration proof. Treat its interoperability/native-host ambitions as proposals; forwarding facades found elsewhere in this audit do not yet satisfy its capability claims.

Extraction order from this pass: corridor geometry/residency contract; injected pursuit/path-following; checkpointed sequence coordination; render LOD/batching/asset normalization. Each requires version-compatible packaging and fresh consumer proof before promotion.

## Pass 13: Long Haul ownership and remaining browser prototypes

- **TheLongHaul**: all20 `src/game/*.mjs` files now have source receipts;17 app chunks and the core bridge are mapped at bed3b4d. Product composition installs13 local DSKs: seven world, two truck, two delivery, and two run/wildlife kits. Engine dependency remains b941c9b; its index explicitly exports legacy factories absent from the previously audited current-main API. A dependency upgrade therefore needs compatibility proof.
- **Actual state owners**: course kit tracks explored edges/discovered depots; delivery kit owns candidate/accepted/de-duplicated checks; run kit owns clock/status/distance/penalties/recovery; wildlife kit interpolates seeded crossing hazards only during running state. Truck kit consumes its injected dynamics resource, with bounded substeps, grip/steering, suspension, aerial state, rollover and safe-pose recovery. These are real implementation bodies, not only descriptors.
- **Course generator**: Core Data random streams; bounded32 attempts; six-segment trunk plus five branch profiles with collision/intersection rejection and optional connector roads; one random valid depot and12 crossing wildlife hazards. A generated seed changes geometry and destination inside this structure, not arbitrary family topology. Score combines time, penalties, damage, cargo and extra distance.
- **Catalog versus behavior**: installed road-class, terrain-policy and seven delivery-contract catalogs expose values, registration and snapshots, but no gameplay consumers for those APIs were found in the inspected src/game and17 app chunks. The active delivery kit still accepts one valid depot; the multi-stop catalog row alone does not implement a three-stop mission. WorldAtlas stores generated sectors/settlements but its roads registry is initialized empty and never populated in that module; browser horizon code calls the pure sector generator directly.
- **World generation**: semantic adapter registers base terrain, road grades, settlements, hills/biomes and portal roads into Engine worldFeatures/worldFoundation. Macro-sector portals hash sector/edge independently; adjacent edges are not guaranteed to share endpoints. Extract a shared boundary-key policy before claiming continuous macro roads. This is a source-derived risk, not a reproduced traversal failure.
- **Streaming**: current shared constants and tests specify160-unit cells, radius1 active3x3 and72 visual-frontier cells around it. Browser targets also retain preloaded route cells, so81 is not a bound on every realized host. Historical render-audit note still mentions192 units and explicitly lacks a digest linking preparation, Core World cells and presented frame. Do not treat the old note's size or an idle queue as current performance proof.
- **Ownership leakage**: bootstrap loads17 classic scripts in an explicit order, with chunk11 last to start RAF. Chunks13–17 replace earlier rendering/surface/gameplay functions. Final chunk17 owns impact severity, penalties, damage, rollover consequence and recovery admission in the browser layer. The product DSKs are reusable candidates, but extraction must include these currently host-owned rules. Foundation sampling in chunk15 catches errors and falls back to legacy terrain; final chunk17 also replaces its surface classifier.
- **Validation boundary**: `tests/long-haul-game-smoke.mjs` uses local resource/event/semantic-feature stubs and manually invokes systems; it is not evidence that the pinned Engine scheduler or browser works. Atomic kit test checks counts/catalog fields/finite states. Neither was executed here. An unconditional “game-stable” field is author metadata, not promotion evidence.
- **SkyhookRunnerReact**: `NexusBuilder/00_ProductDefinition/SkyhookRunnerReact/src/App.jsx` is a non-Nexus Three flight/gate game implementation:220 seeded gates,110 moving hazards,boost/brake,collision invulnerability,stage upgrades,pause/restart and local best/history. It is materially richer than the separate Worldchain box preview.
- Source-visible Skyhook risks: RESULTS effect depends on recentRuns and writes a new recentRuns array on every run, creating a repeated-update loop; nine nonrepeatable upgrades exhaust while the game can still request another choice; no completion when gates are exhausted. Player mesh is positioned8 units ahead of collision/scoring z. Settings include audio/particles/shake without corresponding behavior. Release Check initializes all minimum items PASS and tests toy copies of logic; it cannot certify the actual loop. These are static findings, not executed failures.
- **NexusAgent other lanes**: GeminiHost page1/page2 are static host samples; page3 is an orbiting cube/torus Three0.162 demo with no objective. Its external OrbitControls import needs dependency-resolution verification. `volcano-runner.html` is a pasted chat plus truncated HTML/CSS fragment, not a complete runner. NexusAgent-Demo is a model/workspace chat client with a virtual greet-code seed, not another game.
- **Drive correspondence**: the Arcade Game Standard demands300 seconds active play,120-second cumulative pause lease and420-second wall cap with deterministic ending and a related progression tree. These are product requirements, not observed compliance: Long Haul's600-second run and unlimited manual pause differ. This audit does not change either project or impose that document on historical prototypes. The Game Development Guide contributes player-loop and evidence criteria. Broad “Long Haul” search also returned unrelated documents; these are excluded from capability records.

## Private Arcade module and vendored-kit ownership (pass14)

Pinned source: LuminaryLabs-Dev/NexusArcade-Private@1c602f3a93bf299521ffb6c3e4b9d47f81d89823. All25 inspected file receipts match the already-read pinned tree. Paths below are relative to NexusArcade-V1/builds/. No game or test executed.

### RPG: local Three gameplay mechanisms
- aether-threads-rpg/modules/{CharacterController,NPCSystem,StealthSystem,DialogueSystem,InteractionSystem,QuestSystem,EntityFactory,AudioEngine,ShaderLibrary}.js contain local gameplay/presentation, not evidence of Nexus domain ownership. Character input normalizes every nonzero gamepad axis to full direction; NPC wandering uses Math.random and bounds, without pathfinding. Guard sensing uses radial40/60-distance thresholds, without view-cone or occlusion tests.
- InteractionSystem edge-latches interaction near NPCs; QuestSystem implements unassigned/active/sequence_active/ready_to_turn_in/completed. EntityFactory owns the terminal sequence and portal mutation directly. Keep quest state and scene effects separate during extraction.
- DialogueSystem's typewriter uses uncancelled scheduled callbacks: closing hides/clears the UI without cancelling active typing. EntityFactory cleanup disposes top-level geometry/material but not nested groups recursively. Collision result fields can be overwritten by later overlaps. These are source-visible lifecycle/aggregation risks, not reproduced failures.
- AudioEngine supplies procedural effect/music scheduling and closes its AudioContext on stop; it is not an asset audio catalog. The main game already applies a permanent speed upgrade after completed-quest runs; do not infer a missing upgrade solely from dialogue/module inspection.

### Riftwarden: meaningful mechanisms, unresolved binding and authority
- riftwarden-wilds/index.html maps nexusrealtime to /vendor/nexusrealtime/src/index.js. The checked-in _site/vendor/nexusrealtime/src/index.js exports no createLocomotionKit, createPhysicsKit or createCameraKit, and contains no wildcard re-export. game.js imports all three. Thus the inspected static-site snapshot has an ES-module export mismatch; a differently served vendor remains unverified. Do not label this snapshot runnable.
- Vendored action-movement-kit implements acceleration/drag, jump, dash cooldown, glide fall limit, terrain height/normal queries, slope correction and boundary respawn. It retains game-specific zone names and frame-step-driven animation stride. character-ragdoll-kit implements single-position knockdown integration, authored pose fields and recovery; it is not an articulated rigid-body solver.
- character-camera-kit computes smoothed follow, look-ahead, FOV and ragdoll framing. camera-occlusion-kit adds sampled terrain clearance and sphere push-out. Its cameraSafe checks camera height only; it does not prove target visibility or arbitrary mesh occlusion. Neither file supplies the absent createCameraKit export in this snapshot.
- light-combat-kit is rising-edge strike/health/combo bookkeeping without spatial hit tests. companion-command-kit progresses a timer toward arrival without navigation. shrine-puzzle-kit checks seed count plus supplied companionArrived and activation; ShrineCharged repeats each tick while conditions hold before opening. corruption-world-kit increments by cleanseRate per step, without multiplying delta.
- game.js owns gatheredSeeds, sentinelHits, companionCommanded, shrineOpened and riftCleansed locally. It passes commanded as companionArrived, marks shrine opened in handleAction, and sets cleanseProgress=1/riftCleansed=true before feeding that state back as cleanse input. Spatial permissions also include progress-based alternatives to proximity. Kit installation therefore does not establish kit authority over the objective.
- forest-placement-kit generates stable seed/chunk/index descriptors with route clearance and slope rejection. Its cache signature includes focus chunk, active radius, count, route length and seed, but omits route coordinates, terrain revision, chunk size and several placement settings. Such edits can leave descriptors stale.
- forest-scene.js projects terrain snapshots and forest descriptors into procedural Three meshes. Terrain's queryVersion early return can suppress a cleanse-only material update; forest entries already present by ID are skipped rather than updated for changed transform/LOD. Removed forest groups lack recursive geometry disposal.
- asset-resolver.js fetches manifest/status but resolve always chooses procedural fallbacks; forest dressing ignores the resolver result. character-animation.js is a custom procedural joint/keyframe rig. recording-route.js derives checkpoints from state flags, hardcodes heroVisibleExpected and defaults cameraSafe unless false; this telemetry is not visual proof.

### Seeded road assembly
- The separately inspected drift-road module builds CatmullRom mesh tracks and places ECS items from supplied component definitions. Most track topology is fixed; seeded connectors/loop dimensions vary. mainNodes/branchNodes/nodes remain empty, so the returned network is not a connected navigation graph. Companion afterburn/fuel modules return configuration only; their descriptors alone do not implement the behaviors.
- Reuse prospects: curve/mesh sampling, item-placement quotas, seeded dimension variation. Extract explicit track connectivity, collision authority and runtime property consumers before listing broader driving capability.

### Documentation correspondence
Targeted Drive searches for Riftwarden and Aether Threads returned no documents in this pass; this is not proof of absence. Existing Architecture Index/Evidence Standard and Arcade Game Standard are relevant contract references, not direct implementation certificates. The source audit strengthens their distinction between installed kit, consumed behavior and verified player experience.

### Pass14 Drive folder and release-identity follow-up

Listed51 previously recorded folders;30 returned no direct children. Added compact pointers to version0.0.6–0.0.10 planning, handoffs, LittleReef systems/assets and nested evidence folders. New child folders and unread documents remain pending; empty direct listings do not prove global absence.

Read three frozen0.0.4 records (Known Gaps, Immutable Release Record, Version Overview) and two blank review/evidence templates. Frozen records refer to8a60167f and explicitly lack verified immutable release identity. A fresh connector read of Engine releases and git/matching-refs/tags/ returned empty arrays. The ordinary tags endpoint was rejected by connector policy; no claim about external package registries follows. Templates require exact commit, acceptance, scenario/provider, expected/observed results and explicit limitations. They provide a schema for future adapter evidence, not completed validation.

## LittleReef implementation and Drive reconciliation (pass15)

Source pin: SoftStrangeStudio/LittleReef@b53dc72440be466b01e1f76b54ab84dc64ded587; content tree fdaa5e9d707145131aa6d91e301bbf11d85d5e4a.31 additional source receipts match the pinned tree. This is a non-Nexus-engine Three.js/Cannon application with local procedural Nexus-named asset helpers, not an installed NexusEngine runtime.

- **Actual loop**: src/main.js loads five enabled GLB asset IDs before constructing LittleReefApp. The app spawns8 seeded founders, renders an interactive tank menu/dive, enables fish selection and parent breeding, controls the first fish with pointer/depth input, and updates collection/breeding goals. BreedingService rejects only absent/same parents; it does not enforce the documented eligibility, nursery capacity, supported-trait/schema or objective failure contract. App changes state to breeding before that validation and returns on failure without restoring the prior state. No app-wide restart/disposal method is present in the inspected app.
- **State ownership**: FishService Maps own identity/genomes, Cannon owns dynamic positions, Three objects feed steering, and GameStateService owns goal sets. This differs from Drive's single authoritative matrix/selector architecture. The reef-population goal counts discovered body categories plus breedCount rather than living population. Eight starters and unbounded offspring differ from the historical two-parent/one-slot fixture.
- **Genetics**: FishGenome chooses categorical parental traits, averages numeric traits with seeded jitter, and rolls8% mutation. Child seeds include worldSeed, nextId and ordered parent seeds; generation is max(parent)+1. Repeatability therefore requires the same prior creation sequence and parent order. A mutation may select the current trait again. Broad replay determinism is not established by seeded genomes.
- **Data-to-render gap**: NexusFishFactory forwards genome.bodyFamily, but src/nexus/fish/generator.js:createFishDefinition reads overrides.speciesFamily. The visible species falls back to a seed roll rather than directly consuming the inherited body category. Genome finScale is also not read by createFishDefinition. Preserve these as explicit mapping gaps, not visual diversity proof.
- **Procedural fish candidate**: local src/nexus/fish/{generator,geometry,textures,math}.js separates definition, anatomy, appendages, face, generated surface textures and model composition. NexusFishFactory adapts mesh arrays/materials/textures into Three and caches by seed+parameters. FishRenderer immediately returns the factory result; its subsequent primitive renderer is unreachable reference code. Near/mid tiers share detailed meshes; distant uses one simplified mesh. FishTransformBuffer copies transforms into a Float32Array; no instancing or worker execution follows merely from that buffer.
- **3D steering candidate**: ControlledFishController casts pointer onto a camera-relative plane, adds vertical offset, clamps to SwimVolume and replans every0.18s. RoutePlanner3D inserts one side waypoint around the nearest intersecting sphere, without checking both new segments against all obstacles. ObstacleAvoidanceSolver supplies predictive local correction. This is useful bounded steering, not complete navigation/path reachability.
- **Physics/camera**: FishPhysics uses Cannon spheres, tank walls, forces and fixed1/120 step with up to6 substeps; copies body transforms to Three. Schooling/separation read object positions. FishCameraRig smooths horizontal heading/follow height; no camera occlusion solver is present there. Tests cover selected route, avoidance and framing fixtures; no tests were run.
- **Asset pipeline**: CoralAssetLoader really loads/parsesGLBs; ten catalog entries/files are present, five enabled by default. CoralPlacement chooses assets/scale/yaw/jitter at18 fixed anchors while keeping a central route. It is bounded layout variation, not arbitrary topology. CoralField uses catalog sphere proxies; its disposal disposes the shared library, requiring ownership/refcount decisions before multi-field reuse.
- **Rock arch candidate**: RockArchFactory combines symmetric cubic path, named seeded noise streams, variable cross sections, capped indexed geometry, opening/clearance metrics and sphere proxies. Geometry/material caches have reference-counted disposal. validateRockArchGeometry checks finite coordinates, degeneracy, duplicate faces, edge/manifold/orientation and connected components, but create does not call it. The quality field changes cache/encoding identity without changing build parameters in this implementation. Geometry validity is separate from collision/visual agreement.
- **Source checks**: coral tests parse assets and check checksums, bounds, geometry and selected route fixtures. Their presence is not a fresh pass. No binary assets were downloaded or rendered in this audit.

### Corresponding Drive contracts and asset prototype

Read LittleReef TechnicalDesign, GeneticsModel, BreedingSystem, FishSystem and ReefSystem working documents plus BaselineManifest. They preserve an August first-playable direction: matrix authority, two parents, one nursery slot, independent parental selection and mutation disabled. Current source has a substantially different structure; record this as design/source drift without treating the old Not Started label as current code absence. BreedingSystem itself retains two conflicting LR-FAIL code mappings; the explicit superseding header must be distinguished from historical body text.

Baseline folder listings contain17frozenDocs and5frozenSheets, agreeing with manifest counts; contents were not compared for equality. The coral Drive packet is a separate native-Three/Lavapipe prototype with25PNG renders across five families. Its source recursively generates branching/staghorn forms and simpler fan/tube/brain forms, produces contact sheets and manifests, and has noGLB export. It hardcodes a sandbox sharp module path and assumes bundledLinuxLavapipe paths. generator-parameters.json describes fixed camera/light and1200x900 output. validation.json records a passing byte-hash repeat for one branching variant; source dimension checks compare assigned metadata rather than decodingPNG dimensions. Images were not visually reviewed. Five Selected Assets family folders returned no children. Do not equate this25PNG packet with the repository's tenGLBs without a source/export/checksum link.

### Engine numeric version identity

Later Drive records, main bacc8fc Validation Snapshot and0.0.5 Version and Architecture State, supply a more specific version reference than the earlier frozen records. Connector lookup confirms refs/heads/0.0.4 ->16aee598c06efcb7b511e4827ee3f7e23ce3549b; refs/heads/0.0.5 returns404. The0.0.4 package reads name=nexusengine/version=0.0.4; package and entry blobs match its untruncated2456-entry tree. This confirms a branch pointer and source version, not an immutable tag, release artifact or passing execution.

The bacc8fc historical report says341manifest-backed contracts and matrix checks passed, while aggregate/strict/release checks failed at physics constraints, with independent docs/ownership drift andWebGPU provider-boundary failures. It also distinguishes current runtime sequence from proposed finite operation orchestration and a proposed Game AST. These claims belong to that historical SHA and were not rerun at current main.

## Prototype source closure and atmosphere reuse (pass16)

Pinned NexusPrototypes: `17d9744a12395a0b04fcc1565f64878b1775b1bf`, content tree `000ea9cc00af4f43a0c25c10c08e9fc4dc890320`. Its untruncated110-entry tree contains **six HTML entrypoints**: Bird Explorer, three Orb Runner folders, and two standalone Ref scenes. This is not six completed games. All are local Three/R3F implementations rather than NexusEngine consumers in the inspected owners.

### Bird Explorer: useful components, incomplete composition

- `bird-explorer/src/systems/SceneController.js` parses XML into registered systems, commands and sequence listeners; `BaseSystem.js` dispatches execute<Action>. App.init subscribes only after init has run sequence0. The scene's synchronous terrain/weather/physics configuration and infinite-terrain mount events therefore precede App subscriptions. App starts with null terrain/weather; configuration values cannot be assumed visible.
- Sequence commands execute before listeners; async results are not awaited; sequence listeners are never removed. Snapshot only clones non-null system states. Sequence index, narrative timer, chunk state and weather animation are not checkpointed. UI's Pause button restores the start snapshot rather than implementing an ordinary pause.
- `BirdModel.jsx` has pitch/yaw input, pitch-linked speed, boost, Rapier velocity and a chase camera. It freezes the first300 rendered frames, computes orientation before that frame's input, forces gravity off, and mounts at fixed[0,500,0]. PlayerSystem terrain placement is overwritten by mount-time Spawn; its position is not synchronized from live body movement. Treat flight as an extraction candidate, not proven integrated terrain flight.
- `ChunkSystem.js` emits LOAD/UNLOAD for a square neighborhood; default radius2 gives25chunks. LOD remains constant1 and lodDistance is unused. XML wraps settings in ChunkSystem while configure shallow-merges its outer object; reconfigure resets lastUpdatePos but early-return tests lastCenterChunk.
- `TerrainSystem.js` pools meshes; `TerrainMesher.js` samples world coordinates and blends plains/mountains. Infinite mesh geometry is hardcoded5000/32segments, does not consume the XML biome settings or scene seed, and has no terrain collider binding. `FastNoise.js` initializes from Math.random. The separate static `World.jsx` is seeded and supplies a Rapier trimesh, so static and infinite terrain do not share one authoritative surface.
- `PrefabSystem.js` uses hardcoded ring/cluster XML instead of the checked-in library; positions differ. It parses recursive grandchildren and scale but instantiateEntity does not apply those child overrides or scale. IDs use wallclock/random; cycles have no explicit guard. Renderer initially reads all entities then later root-only updates, omits children under collider-bearing nodes, and has no intersection callback to triggerEvent. ScoreValue is metadata; triggerEvent merely returns commands. No complete score/objective loop is wired.
- `Weather.jsx` implements day-color/fog/sun interpolation, instanced clouds and rain points. XML presets never reach a bound weather ref, humidity stays at the default from App, and randomness is unseeded. UI telemetry/title are placeholders. SkyboxSystem stores/emits config; current scene neither registers it nor consumes its cubemap paths.
- Reuse priority: fix lifecycle/event ordering and single surface authority before extracting flight, chunk residency, prefab composition or weather as trusted domains. Main GLB exists in the tree; asset presence is not rendered proof.

### Orb Runner: base mechanics versus malformed variants

- Base `orb-runner-three/src/game/{world,loop}.ts` owns seeded placements, acceleration/damping/sprint, circular bounds, proximity pickups, a decaying score multiplier, bounded replenishment and60-second game-over. `main.ts` starts requestAnimationFrame; renderer/HUD are concrete. These are useful collection/pressure-loop mechanisms.
- Input lifecycle defect: main calls Input.frame before wasPressed; frame clears every pressedFrame flag. Pause/restart edges are therefore consumed before their checks. Holding movement uses separate down state. Source-level defect, not a browser reproduction.
- Replenishment exhausts12placement attempts without a success flag, then still adds the default-position mesh. Removed pickups and scene reset do not dispose resources; world.dispose is a no-op. Restart would reuse the same seed/layout. End state increments elapsed before returning; no saved-best or distinct win condition.
- The two agent variants have identical package manifests and HTML boot routes to their own main.ts, but different malformed bodies. Agent1 main mixes Python-style named arguments, top-level return, Node subprocess/path APIs and empty movement methods. Agent2 main contains JSX in .ts, redeclares imported Injector, requests a missing Orb.tsx and imports libraries absent from its package. Supporting modules also contain invalid non-async await/function syntax and placeholders. They are failed generation artifacts, not additional playable families; do not extract them as trusted adapters.

### Ref scenes: additional sources rather than game loops

- `Ref/terrain.html` is an independent Three r128 viewer: biome terrain,225resident chunks at radius7, five camera perspectives and ascend/travel/descend teleport. It disposes unloaded chunk geometry/material. Its named spherecast is five height samples that raise camera Y, not swept collision or line-of-sight. Noise and destination sampling are unseeded; no gameplay objective.
- `Ref/weather.html` provides editable day-color keyframes, humidity presets, fog/sun/freezing-level transitions, instanced foliage/clouds, rain/snow switching and orbit-camera controls. New Seed recreates terrain/clouds/water without disposing them and adds another rain system without removing the old one. Foliage height omits the terrain's fine noise; cloud wrapping handles positive boundaries only. Pause stops day advance while weather/particles continue. Extract atmosphere state/renderer separately and add reset/resource/seed contracts.

### Drive correspondence: RhymeStudyGuide is a distinct lead

Searches for NexusPrototypes, Bird Explorer and Orb Runner did not establish a matching prototype design document. NexusPrototypes returned two maintenance trackers; Bird Explorer returned broad matches, including a useful but different project; Orb Runner returned none. These bounded results are not absence proof.

[Handoff](https://docs.google.com/document/d/1_5p52Eyq9bBkk0_GaJnontl4tRuVUhnVrqpL7HrOcuo/edit) concerns **RhymeStudyGuide**, not Bird Explorer. It names commit`993cbb0a45a87da7f7051e40249823bd6bfc2451`, now matched to repository source and content tree`1710b1785ab54b02ac4166184b0c84a50fd24b4b`.

- `src/domains/atmosphere/flock-path.mjs`: deterministic60-second cubic path, staggered formation, tangent-derived facing, bounded±0.16bank and independent wingbeat. Browser `foreground.mjs` projects this into image/CSS rigs; `flock.mjs` projects it into Three geometry for native validation. These share motion math, not identical render assets.
- Browser controller dynamically imports `world-renderer.mjs`; actual Three scene in `world.mjs` is animated paper/star/particles. Foreground birds/clouds are DOM/CSS, not a Three game. Controller owns visibility/reduced-motion/pause propagation; renderer adds intersection gating, capped pixel ratio and context-loss fallback.
- `tests/atmosphere.test.mjs` checks loop closure, separation/mobile count and bounded bank. Native renderer script checks same-state framebuffer equality, changed-time inequality and flock-period equality. It depends on an external render-runtime directory; it does not validate the browser image rigs.
- Historical `validation/release/atmosphere/browser-results.json` lists59checks, whereas Drive says58. QA source inspects bank/facing variables and cloud pause/visibility; it does not establish screenshot-based correctness at every curve point. Neither historical JSON contains an exact source commit identity. No current runtime execution or screenshot review performed.
- Reuse: deterministic path/orientation/wing separation; host-owned pause/visibility and fallback; split browser/native proof. Before cross-renderer extraction, address CSS horizontal scale using facing only versus Three uniform facing*scale, resource/listener lifecycle, and test final transforms/assets as well as shared math.

## Pass17: reusable agent controls, not additional game families

Source: `LuminaryLabs-Dev/NexusAgent@1458aead98aab5714a72f89e41deb62d91a593e3`; content tree `3e5da9bf125d43a21d3e01b2d14459c9c9aafe91`. All53 inspected file receipts match pinned tree blobs. Static audit only.

- **A1-Harness:** `commands/create-it.mjs` dispatches planning, step artifacts, kit recommendations and summaries; most other registry selections become `selected_not_executed`. `commands/code-it.mjs` emits plan/write/review/rewrite Markdown drafts. Reviews are not parsed into an acceptance gate; turn-cap exit can still report ok. Registry command strings do not establish tool execution. `core/model-controller.mjs` bounds request time but lacks finish-reason/schema/capability validation and can substitute reasoning text for final content. Reuse the compact action list and prompt versions; do not count this as an autonomous game assembler.
- **LiquidUniversal-Harness/artifacts:** deterministic-builder, artifact-validator and artifact-service produce/validate/publish a hashed JSON game contract with seeded presentation/difficulty fields. Fixed rule descriptions are not executable Three.js behavior. The artifact selftest checks deterministic equality, basic validation and hash tampering only.
- **LiquidUniversal routing:** `conversation/capability-router.mjs` selects tools, deterministic functions, benchmark-marked specialists or provisional specialists with fallback. Promotion statistics are supplied by the caller, not independently bound to evidence. `core/decision-gates.mjs` checks required keys/size/forbidden strings/repeated failures; outputSchema is not a full runtime schema validator. ACCEPT/FALLBACK/STOP and orchestrator PARTIAL distinguish fallback use from direct success.
- **Recursive control limitations:** `conversation/recursive-executor.mjs` bounds per-node depth and attempts, but does not impose a global tree/call/deadline budget. Its default validator is non-null, successful child outputs bypass combined-parent validation, and parent callCount omits child calls. `conversation/tool-runtime.mjs` timeout races do not cancel the underlying operation. A tool still running must not be treated as safely stopped.
- **Evidence limitations:** `evidence-store.mjs` defaults additions to VERIFIED; `answer-composer.mjs` excludes only REJECTED cards and allows empty evidence; `final-answer-gate.mjs` checks referenced evidence but does not require every claim to reference proof. Controller receive compiles a mission plan; it does not itself execute that plan. These components need explicit observed-result binding before Arcade acceptance.
- **Memory limitations:** `progressive-fact-ledger.mjs` enforces introduction-turn visibility for the current value, but overwriting a key replaces its prior history; it is not a full historical fact log. `artifact-version-store.mjs` is in-memory, hashes JSON serialization and truncates later versions on restore. Reuse ideas selectively; do not equate them with durable append-only campaign evidence.
- **Benchmark scope:** `tests/conversation-benchmark-selftest.mjs` obtains50 calls from a scripted answer function; its100 deterministic conversation cases supply cards with empty evidence. `tests/run-all-selftests.mjs` runs11 suites plus a conditional LiquidPro suite; live validation is separate. `evidence/lfm-350m-conversation-baseline.mjs` records latest reproduction memory7/13, exact formatting2/6, lexical31/50 and13 duplicate responses, PARTIAL. These are historical results, not new model execution.
- **BonsaiPro-Harness:** `core/state-store.mjs` owns SQLite WAL/FULL transactions, attempts, events, approvals and leases. `artifact-store.mjs` saves immutable requests/receipts/checkpoints and hash manifests; receipt recovery checks action identity and checksum. `core/orchestrator.mjs` adopts durable receipts after a crash and holds unknown non-repeatable mutations. Useful extraction candidates: durable action identity, receipt recovery and explicit mock/dry-run/live boundaries.
- **BonsaiPro constraints to repair before reuse:** resume checks workflow hash, not recorded code/registry identity; state is marked running before lease acquisition. Thirty-second lease renewal occurs between iterations, so long awaited work can outlive it. Terminal completion is evaluated before wall-clock/runtime budgets. Action gates check receipt success, artifact existence and outcome routes; completion checks terminal stage plus required-stage membership, not game semantics. `adapters/process.mjs` uses shell:false and an abort signal but only SIGTERM, with unbounded captured output. These are source-derived risks, not reproduced runtime failures.
- **BonsaiPro validation scope:** `scripts/smoke.mjs` contains mock/planner rejection, symlink escape, retry/budget, two crash windows, durable approval, parallel-lane and offline research fixtures; its RAWG campaign is explicitly dry-run and enforces zero network attempts. No fresh execution and no browser game proof obtained.
- **Drive correspondence:** Project Manifest `17HpcupgTn9aFj9_hVp4mkaaq87mP-lyU` exactly matches commit, content tree and LiquidUniversal subtree `ddeb7fe2c181bec3f3a37ca75cc3fae5035153ed`. Current handoffs retain NXA-010/011 formatting/synthesis gaps and raw-LFM provisional status. “Validated release” reports12 full-materialization/11 subtree suites; source confirms suite selection, not historical execution. Nexus Engine Agent Operating Guide reiterates single authoritative domain ownership; it is guidance, not implementation proof.

**Arcade extraction priority:** reuse bounded action registries and durable receipt/recovery primitives; strengthen evidence binding, aggregate budgets, cancellation and lease renewal. Keep capability selection/low-thinking decisions outside gameplay authority. None of these three lanes adds a verified playable game family.


## Pass 18: LittleReef lifecycle and HorrorCorridor encounter/presentation ownership

Source scope: 25 additional pinned files matched their repository tree blobs; 10 native Drive documents read. No game, model, browser or proof command executed.

### LittleReef: usable presentation pieces, incomplete product lifecycle
- At `b53dc72440be466b01e1f76b54ab84dc64ded587`, `src/menu/MenuTankScene.js` has raycastable Play and Settings targets, but `src/app/LittleReefApp.js#handleMenuPointer` handles only Play. `scripts/test-menu-navigation.mjs` verifies picking/transition geometry, not Settings behavior.
- `TankDiveTransition.js` provides a 3.4-second menu-to-reef camera/veil transition. Selection climbs mesh parents to fish IDs; it is a reusable entity-picking pattern. App control stays with the first fish; inspecting another fish does not transfer control.
- `UIService.js` holds two parent IDs and enables breeding by count, without eligibility/capacity checks. App enters breeding and plays audio before validation; a failed breed returns without restoring the UI/game phase. No whole-app reset/save/load/dispose or visibility pause is exposed.
- `ReefAudioService.js` provides gesture-unlocked ambient sound plus seven event tone presets; collision timing uses wall clock. Event history is unbounded; muting only adjusts ambience. Its fake-context test does not prove browser audibility; app does not call its disposal.
- Frozen first-playable Drive docs specify two fixed starters, an 8x6 matrix, nursery constraints, seeded Stripe discovery and Reset. Current app starts eight Math.random founders; treat the frozen architecture as historical intent, not implemented authority.
- Provenance remains unresolved: pinned Dev/NexusFactory tree `e26a5a80eb85a0102ad728d7552f23b72a9e22f1` (24,282 entries, untruncated) contains no fish-named source outside .agent and no exact blob matches for the five inspected LittleReef Nexus helper files. This excludes exact copies at that pin, not older/transformed origins.

### HorrorCorridor: distinguish selected content from active behavior
- At `f2888fb831149993858bdc8bfe6ce6874481d514`, `src/providers/threeScene.ts#buildCorridorWindow` uses the composed-place path and returns before the 12 richer facade builders. Active BrowserGame selects composed mode. Rich geometry remains an extraction candidate, not proof of active scene variety.
- `src/content/corridorContentRouting.ts` deterministically selects generator/service-door mesh-part profiles. These are presentation parts, not implemented power generation or door interactions.
- `src/content/monsters.ts` defines 124 profiles (30 families x4 manifestations plus4 legacy), using five movement modes, three flashlight responses, six sensory channels and six silhouettes. Count underlying behaviors separately from catalog entries.
- Dread pacing uses a90m safe opening and a five-interval cycle; seeded selection avoids three recent families and filters by place/response feasibility. Spatial stalker spawn/repath delegates to corridor route queries. The weave mode modulates speed rather than defining a lateral weaving path.
- `createHorrorCorridorV2.ts` computes beam contact from horizontal angular difference; no pitch, distance or occlusion test in that contact calculation. Navigation connectivity is not line-of-sight evidence.
- Encounter loop: warning, approach, early study/repel or blackout, last-chance collection/capture. Moving replenishes last-chance time; standing response teaching needs review. Expedition tracks distance/study/collection/offering scores and keeps Index state on restart; this is an endless survival loop, not a terminal campaign victory.
- `spatialAudio.ts` has six procedural motifs and stereo bearing pan with bounded event history. Stereo panning is not HRTF/occlusion or headphone acceptance; pause does not establish silence for scheduled cues.
- Network clients publish intent, but inspected host message handling processes presence rather than applying client intent. Snapshot replication/mirrored party state does not prove independent cooperative play.
- `persistence.ts` correctly waits for IndexedDB transaction completion before reporting success. Its error-only localStorage fallback can diverge: a successful empty IDB read does not consult fallback, and successful IDB clear leaves fallback intact.
- `scripts/prove-runtime.ts` describes deterministic progression/recovery checks; source assertions are not newly executed evidence.

### Drive reconciliation and extraction order
HorrorCorridor's six design/acceptance documents use older commit539982a/Engine0630572; current source uses f2888fb/Enginea74e8689. The old missing-spatial-stalking statement is superseded by a current implementation, but not by current execution proof. Historical 24simulated minutes contain nine unique contiguous minutes. Preview geometry and scheduled audio cannot certify play or fear.

Reuse candidates, in order: (1) stable domain snapshots and encounter selection/pacing; (2) entity picking and transition lifecycle after reset/disposal fixes; (3) procedural materials, facade parts and audio motifs with explicit presentation contracts; (4) transaction-complete saves with unified fallback semantics. Keep transport replication separate from a future cooperative-control capability. Jev/low-thinking routing can select catalog IDs only after active implementation ownership and evidence class are attached.

## Pass 19: The Long Haul pinned-engine ownership

Dependency pin: NexusEngine `b941c9b2995e3449c6987908657753e2cf2df242`, content tree `879a2add755d87b6cc34da1aeb161866c353b3f6`; recursive tree1,185 entries, untruncated. Inspected28 files and rechecked root index. All28 receipt blobs match this tree; all extracted immediate relative import/export targets exist. This is scoped static compatibility, not a complete transitive module-load or browser test.

- **Export contract:** mapped all17 browser REQUIRED factories in LongHaul `src/app/app-chunk-1.js`, plus `createDataSchema`, `defineResource`, `defineEvent`, to declarations under the pinned index/export paths. No missing declaration found in these20 selected APIs.
- **World lifecycle:** `src/core-domains/core-world-domain/world-domain.js` wraps world-builder registration, focus, cell queries, snapshot reconciliation and reset. LongHaul explicitly sets `childDomains:false`, so installing the parent does not activate foundation/feature-family descendants. Product-specific terrain/features remain separate owners.
- **Provider sequencing:** `kits/world-builder-runtime-kit/index.js` orders foundation/classification/population/presentation, checks required capabilities and rolls back previously prepared providers on failures. Provider methods and descriptor getters reject Promises; asynchronous preparation must happen before synchronous activation. LongHaul's provider requests a patch, pumps once, then throws if still unavailable; simply replacing its generator with an async model/worker is not a compatible change.
- **Patch preparation:** `preparation/world-patch-preparation-controller.js` separates desired, queued, inflight, ready, active/retained records with version/settings cache keys. However, pump.maximum limits starts per call, not concurrent jobs or wall time; repeated calls can accumulate inflight work. Cache eviction excludes active/prefetch/inflight records, so cacheLimit is soft when protected sets exceed it.
- **Reset/recovery caveat:** patch reset clears maps/sets but does not abort pending executor Promises or attach an epoch check. Late callbacks can touch shared ready/inflight bookkeeping after a new run starts. loadSnapshot validates schema/id, resets and restores focus only; it does not restore cached descriptors, desired sets or pending jobs. Reuse as a reconstruction checkpoint, not exact in-flight recovery.
- **Synchronous idempotency:** `core-kits/core-transaction-ledger-kit/index.js#applyOnce` checks an in-memory record, invokes the callback, then structured-clones/stores its result. No persistent backend, pending reservation or atomic external side-effect transaction is provided. Promise results are not supported by structuredClone; callback side effects can precede recording failure. LongHaul calls it with synchronous result objects and applies penalties/recovery after the recorded decision; the narrower use is traceable.
- **Camera:** `core-camera-kit/smoothing.js` provides position/look/FOV smoothing, quaternion slerp, delta clamping, teleport snap and snapshot/reset. Camera kit advances it in resolve phase; actual Three camera assignment remains in the app. Stored shake/mode descriptions alone do not implement camera collision or shake rendering.
- **Instances:** `core-graphics-kit/instance-batches.js` stores cell descriptors, calculates changed index ranges, caps active instances and reports overflow. It owns no GPU resources. Snapshot load restores CPU previousInstances and clears dirty; a fresh renderer needs explicit full upload/reconciliation rather than assuming the next incremental flush repopulates empty GPU buffers.
- **Input and semantic features:** core-input factory supplies descriptors and a configurable API; LongHaul reads keyboard state in its app and supplies custom setIntent/getIntent. Semantic feature kits normalize geometry, sample influence and emit foundation contribution descriptors; `implemented:true` defaults from the spec and does not independently prove corresponding meshes or gameplay.
- **Proof boundary:** LongHaul smoke source uses a substitute engine and always-valid semantic feature stub. Its assertions do not exercise this real pinned export/service graph. Current device timing, GPU reconciliation, async cancellation and complete playable run remain untested in this read-only audit.

Extraction priorities: reuse the existing provider-phase/capability contracts and camera math; preserve the descriptor-versus-renderer boundary; add explicit sync/async and restoration requirements to each reusable catalog entry before low-thinking/choice-based routing selects it. Do not count every mounted core descriptor as a separately demonstrated mechanic.

## Pass 20: nested native NexusWorld in NexusBuilder

Owner: `LuminaryLabs-Dev/NexusBuilder@862ce82513c9aa1a020e9e2677c1fef32c626231`, prefix `NexusBuilder/01_EnvironmentAndToolchain/NexusWorld/`. Eighteen source/config receipts matched the pinned tree. This is a separate local Rust ECS prototype with a .NET9 cargo launcher; it does not import the JavaScript NexusEngine or Three.js.

- **Actual pieces:** Rust typed component stores/indices, typed event bus, RON scene specifications, deterministic height arrays, transform tweens, Rapier3D stepping and an eframe/egui UI. `nexus_app.rs` uses an accumulator for60Hz physics and a separate UI snapshot channel; its fixed sleep is not evidence of120Hz throughput.
- **Active rendering boundary:** `nexus_render_man.rs` only logs mesh/entity counts. `nexus_ui_man.rs#GuiApp::update` manually projects a rotating unit cube and draws a sky gradient/HUD. UI snapshots carry named entity positions, not terrain mesh buffers. Do not advertise the generated terrain/ECS world as rendered gameplay.
- **Scene/terrain integration gap:** `nexus_scene_man.rs#apply_scene` creates heightmaps while loading the scene. `nexus_terrain_gen_sys` creates mesh and terrain collider only for terrains lacking a heightmap, so the successful scene-load path skips that setup. LOD chunks use placeholder flat quads; changing chunk.lod does not rebuild terrain detail.
- **LOD lifetime defect:** each LOD call computes `Instant::now().elapsed()` immediately and stores that near-zero value. It is not an advancing shared age clock, so normal multi-second pruning cannot work as intended.
- **Physics/controller boundaries:** bootstrap attaches the same ground-sized cuboid helper (half-extents1000,1,1000) to dynamic players. Both legacy player movement and character movement run for the same dual-tagged player; velocity writes force vertical speed0, and jump_force/is_grounded are declared but not used there. Camera-follow system exists but is absent from the inspected app schedule.
- **Input/UI boundary:** stdin input is processed through a Vec popped in reverse order. A typed UI-axis route exists, but active GUI update only wires menu toggling while older rendering/control helpers remain separate. Controls/state structures are not proof of a playable route.
- **ECS consistency:** component insertion duplicates values into typed registry and public legacy maps. Systems mutate legacy maps directly, while typed iterators read registry copies. This requires a single authority or explicit synchronization before reuse.
- **Events:** typed publish/drain/subscription APIs are concrete; process_subscribers intentionally leaves queued events intact, so repeated processing repeats callbacks until drained. Its test checks queue retention rather than proving subscriber side effects.
- **Scene safety:** apply_scene ignores its dry-run argument and mutates; it is a loader prototype, not a safe preview transaction. Source tests exist, while the tree's tests/ui_and_movement_tests.rs is empty. No compilation or tests run here.
- **Drive correspondence:** a NexusWorld search returned seven metadata hits dominated by the separate NexusWorldGen project and general upkeep. No matching native-prototype design document established by that bounded search; do not conflate their ownership.

Reuse priority is low for direct Arcade extraction: typed events, scene descriptor ideas and fixed-step coordination can inform contracts, but the current JS engine already has closer equivalents. Native renderer/terrain/controller wiring must be repaired and verified before any catalog entry promises a usable game capability.

## Pass 21: staged Builder sources, menu scaffold and WorldChase
Pinned NexusBuilder commit `862ce82513c9aa1a020e9e2677c1fef32c626231`, content tree `1f12680381785a40ba9e74bc4c6ff6b1b5f6dad4`. All61 additional receipts matched pinned tree blobs. Source inspection only.

### Native menu: architecture vocabulary exceeds implementation
Under `NexusBuilder/03_FullImplementation/RustInfiniteScroll3DMenu/`, Cargo/README and19 Rust implementation/test files show a registry/queue/selection scaffold. Cargo has no GPU backend; winit runner prints and steps once without a window/event loop. README's demo binary has no corresponding target in the inspected tree. Asset registration checks path existence but does not load glTF; missing files remain registered. Boot marks itself complete despite manifest failure and asset import discards the result. Scene assembly holds IDs; rendering increments an upload counter with a thread assertion. Device-loss tests reset that counter; memory-budget and streaming-latency tests exercise bookkeeping, not graphics or I/O.

Streaming enqueues three neighbor jobs per step; inspected engine schedule never drains the job queue. Selection uses Euclidean wrapping, whereas streaming/assembly use signed remainder that can omit far-negative indexes. Menu inertia exists, but snapping is a comment. Reuse selection/descriptor patterns only after bounds/error/lifecycle fixes; do not publish GPU streaming as implemented.

### Startup-only entries
21 `01_EnvironmentAndToolchain/*/Program.cs` files only print the project name and return0. Names are preserved in collections.jsonl rather than duplicated here. These include rendering, input, gameplay and editor labels. PostProcessing also contains separate Rust implementation files, so only its C# entry is classified as a stub; its Rust code remains pending.

### WorldChase: non-Nexus Three.js game source
`NexusBuilder/14_FinalReleaseGate/WorldChase/` uses Next14, R3F, Three0.160, Cannon and Zustand; its inspected active dependency graph has no NexusEngine import. `app/page.tsx` loads `GameScene`, which mounts terrain, player and chaser. Useful source leads are a25-chunk window (five lateral by five longitudinal), vertex-colored procedural heightfield, instanced foliage, pursuit HUD and time-based difficulty ramp. There is no per-run world seed: noise permutation/hash are fixed.

- `Terrain/Chunk/Foliage.tsx`: terrain and foliage are render meshes without Cannon bodies; Physics wrapping alone supplies no ground collision. Chunks retain carve factor at creation, while foliage samples uncarved heights; neighboring creation times can change terrain seams. Foliage allocates treeCount instances even after filtering placements, leaving unused slots. Explicit custom-geometry disposal is present.
- `Player.tsx`: constantly requests20m/s forward velocity and5m/s lateral steering; distance score integrates desired speed, not measured body displacement. Vertical velocity ref stays0 and is never subscribed to physics. Stall timer has no setter/trigger. Camera lerp factor0.2 is frame-dependent. No bounds, terrain collision callbacks, jump action or reset effect are wired.
- `Chaser.tsx`: begins after5seconds at z0; speed10 to18.5m/s never exceeds the player's20m/s scored advance. With no active stall trigger, its threat-distance<2 failure is unreachable through the nominal path. It does not actually follow playerX despite the comment. No success condition exists; classify as incomplete endless pursuit rather than a completed race.
- `store/useStore.ts` resets scalar HUD/timer/progress state only. Player body, camera and held input remain outside reset. `useControls.ts` has no blur clearing; Space is captured but unused. Chaser conditionally unmounts below5seconds, unlike the player.
- `docs/final-acceptance.md` claims ACCEPTED using UI/store inspection and reported build/lint success; `docs/vertical-slice-check.txt` claims functional parity. Later stage14 VALIDATION correctly limits its PASS to static documentation reconciliation and cites an uninspected build log. These do not prove collision, catchability, reset or performance. No runtime executed in this audit.

### Drive correspondence
NexusBuilder Step Skeleton (`11ri9-yCikL6nQ6A6mxCg_YMsJCXNIg2z9xgHcmI2gRk`) is confirmed empty via native paragraphs and text fetch. Exact RustInfiniteScroll3DMenu and WorldChase searches found no documents; broader World Chase returned22 metadata hits without an established project match. This is bounded search evidence, not proof that no document exists.

### Extraction decision
Prioritize WorldChase's terrain-window/height/presentation decomposition as repairable source material. Require one shared height/collision authority, actual displacement/progress, catchable pressure and full-world reset before adding Arcade adapters. Keep menu simulations and startup stubs out of capability counts. These examples are valuable negative cases for any future low-thinking/Jev evidence classifier: labels, folders, PASS files and method names are insufficient.

## Pass 22: separate story composition from misleading engine labels
NexusBuilder remains pinned at `862ce82513c9aa1a020e9e2677c1fef32c626231`.20 new connector receipts matched its content tree; two large files received explicitly scoped runtime/entry reads rather than a claim of exhaustive line review.

### StoryEngine owns a DOM interpreter, not a 3D engine
At `14_FinalReleaseGate/StoryEngine/`, package and App wire React/Redux/Konva/JSZip editor tabs; no Three dependency is declared. `src/engine/{GameLoop,Interpolator,NodeParser,StateMachine}.ts` are empty methods, but this does not mean the entire project is empty. Actual play logic is inside `src/components/editor/Play/PlayTab.tsx`: clone project, follow control nodes, display story choices, evaluate conditions, assign state and update entity properties via animation frames. `src/utils/Exporter.ts` separately embeds another interpreter in a ZIP.

- Preview and export render text/buttons only; updated entities are never drawn by those play paths. The Build editor's entity view does not establish runtime/export rendering.
- Control chains use unbounded while loops; `Validation.ts` checks node/choice targets and entity existence but not cycles, numeric properties/durations or safe expressions. A cyclic control graph can trap the synchronous interpreter. Missing malformed structure is not guarded by a runtime schema.
- Starting Play clones project but does not clear animationsRef; prior tweens can apply to the new session. Invalid-start handling clears React session but leaves sessionRef/tweens.
- Conditions use Function construction. Export inserts raw JSON into an inline script without escaping script-closing content. Treat these as trusted-author prototypes, not validated model-driven bundles.
- ZIP export has only index.html, engine.js, style.css; source test checks those entries exist. Validation tests check no-nodes and a200-node story ring, not control-loop behavior or exported runtime parity. Tests were read, not run.

### NexusEngine2D contains stronger composition ideas in a different implementation
`03_FullImplementation/NexusEngine2D/app.tsx` schema and lines745-930 provide local DOM entity presentation, start/pause/reset, RAF interpolation, nested child sequences and linear/parallel_all/parallel_any coordination. This is source-owned React logic, not the shared JS NexusEngine. Its project JSON saves entities/assets/nodes; the standalone HTML build button has no implementation.

Important extraction boundaries: parallel_any completes once but leaves losing branches running; no executor cycle/depth budget exists; story timing/children are not traversed by the control-only runChildren path. Root launch special-cases start_node despite configurable first node. Choice numbers add to global state, unlike StoryEngine's assignment semantics; entity operations update a different store. Conditions use new Function and remain visible when evaluation throws. JSON import only tests truthy nodes/config. Reuse the composition concepts with explicit cancellation, typed state operations and bounded traversal; do not merge these schemas by naming similarity.

### Three other 2DEngine folders are service/auth scaffolds
- `Rust2DEngine/Cargo.toml` lists auth-domain/application/infrastructure/main_app. The actual main declares internal mock traits/services and exposes /login, /ws and /llm. LLM proxy forwards caller text to a selected HTTP endpoint; no drawing/frame/gameplay loop is present in the inspected entry. It is not evidence of a Rust game engine.
- `Avalonia2DEngine/src/Client/App.axaml.cs` references MainWindow/MainView/MainWindowViewModel, with no matching files in this pinned project tree. LoginViewModel supplies authentication state/commands; navigation is commented. No ready game-rendering capability established.
- `Flutter2DEngine/NexusEngine2D/lib/main.dart` imports core DI/router/theme files absent from the pinned tree. Supplied login screen imports further unsupplied helpers/bloc definitions and leaves successful navigation commented. This is an incomplete app/auth skeleton, not a 2D game engine.

Exact Drive StoryEngine and NexusEngine2D document searches returned no hits; no corresponding document inferred. These bounded searches do not exclude untitled or differently named documentation.

## Pass 23: native postprocessing reality, gravity-flip loop and visual roadmap
NexusBuilder remains pinned at `862ce82513c9aa1a020e9e2677c1fef32c626231`.14 added source/log receipts match pinned tree blobs. Three native Drive roadmap documents read with revisions; no builds/tests run.

### PostProcessing Rust is separate from its C# startup stub
`01_EnvironmentAndToolchain/PostProcessing/src/main.rs` owns a real winit event loop and Vulkan renderer setup, but no scene geometry is drawn; camera updates are not consumed by rendering. `Cargo.toml` declares Vulkano0.33 yet omits vulkano_shaders used by all shader modules. Checked-in `errors.txt` contains missing-crate, unresolved API and signature/generic errors; these are historical failure evidence, not a fresh compilation result.

Concrete `src/renderer/` gaps: core.rs toggles bloom twice per B input (net no change), clears HDR instead of scene rendering, and waits on GPU every frame. Bloom dispatches threshold/horizontal/vertical stages, but the vertical result is written to temp while caller tone maps final (horizontal output); original scene is never composited back. Dispatch sizes floor-divide by16 and shader image accesses lack edge guards. ToneMapper.apply binds pipeline/descriptors/push constants but performs no dispatch; Reinhard enum does not select another path. ColorGrader.apply is empty and no LUT binding/upload is implemented. Out-of-date acquisition returns without swapchain recreation. Texture-clear usage and provider API compatibility also need validation. Source contains shader/math ideas, not an available high-fidelity stack.

### OneButtonDrift: stronger native interaction example with reset caveats
`01_EnvironmentAndToolchain/OneButtonDrift/GameState.cs`, `MainWindow.axaml.cs` and XAML implement a 2D gravity-flip obstacle game. Space/pointer flips gravity with impulse/cooldown; moving gaps collide with the player, passed obstacles score once, score increases speed/tightens spawn interval, game-over input resets and best score is saved. This is native Avalonia, not Three or shared JS NexusEngine.

Reuse the causal chain and parameter relationships. Reset clears obstacles/velocities/score but preserves current Gravity and RNG state; a new constructor with the same seed is deterministic, repeated Reset is not equivalent to the original start. Timer supplies a synthetic1/60 dt per16ms callback, so its accumulator does not measure real elapsed time. XAML player is36x36 while collision is30x30. Sound hooks only play existing files, and the pinned project tree has no WAV assets. Save/audio exceptions are swallowed; neither persistence nor sound is proved. Existing determinism tests compare two fresh states without input, do not assert game-over must occur, and do not cover restart or UI interaction. No test execution here.

### Drive visual roadmap: proposed requirements, no delivered release
Read `0.0.9 — Version Overview` (184cQGcQabPyq5BjMtIwchvns28rvKjMbqTwbeJ4Sf1M), `Scope and Acceptance` (1qvlycWvJ3wsLLpm2hjUuII4MGV--1GAhzZFxL46VCb4), and `Work Package Map` (1rKCOHzqCIc72eNHSRJa4uKsLw2Gm04sWb1RSnmK06Po). They explicitly mark scope Proposed, implementation not assessed, no source commit/candidate/goals assigned. They are current NexusEngine planning guidance, not proof that the older native PostProcessing experiment implements it.

Useful requirements for capability extraction: Render owns semantics/quality; providers own backend implementation; game art direction remains outside core. Choose reference gaps first, then material/light/shadow/reflection work, scene/motion coherence, then capture/performance regressions. Require still and motion comparison, actual provider versions, CPU/GPU/memory budgets, cancellation/unload/resource release, tier fallback/rejection and immutable evidence. Dependencies on0.0.8 target budgets are entry conditions, not verified completed prerequisites. Exact OneButtonDrift Drive search returned none; PostProcessing search led to these roadmap docs and unrelated records, not an exact native-project document.

## Pass 24: VoxelWorld libraries do not form an integrated voxel viewer
NexusBuilder@862ce82513c9aa1a020e9e2677c1fef32c626231, `01_EnvironmentAndToolchain/VoxelWorld/`;15 source receipts checked against pinned tree.

- **Active owner:** `apps/world-viewer/src/main.rs` creates a WGPU line-grid renderer. Its vertex shader directly emits clip-space positions; there is no camera/world/terrain/stream integration, depth buffer or game loop. Cargo does not declare env_logger used by main. Resize lacks a zero-size guard. This is a native grid viewer, not a Three or Nexus voxel game.
- **Actual terrain algorithm:** `crates/voxel-terrain/src/lib.rs` implements seed-based splitmix64 lattice value noise, fBm height/cave sampling and air/dirt/stone/bedrock classification. Grass/sea-level settings are not realized. Cave rejection runs before bedrock assignment. Chunk fill order is x-fastest then y then z, whereas `voxel-chunk/src/lib.rs` indexes x-fastest then z then y; direct reuse of one buffer by the other transposes axes. Terrain's VoxelId is separate from voxel-core's trait/type family; no active adapter connects them.
- **Unimplemented realization:** `voxel-mesh` only emits a dummy triangle. `voxel-render`'s WGPU facade is empty; actual line drawing lives separately in the viewer. `voxel-stream` returns default-filled16-cubed chunks, ignores coordinates and has an assert(true) test. Those names do not prove terrain meshing/streaming.
- **Cache boundary:** `voxel-world/src/store.rs` provides async mutex-protected map/pin/insertion bookkeeping with synchronous generation. If pinned resident count exceeds capacity, eviction rotates pinned keys forever while holding map/LRU/pin locks, preventing unpin. Reads do not update LRU; simultaneous misses can generate twice; no cancellation/byte/time budgets. Its test only covers three unpinned inserts into capacity2.
- **Keys and stepping:** `coord.rs` masks each coordinate to21bits without range rejection; valid round-trip interval is[-1048576,1048575], outside values alias. `timeloop.rs` clamps frame time but does not reject zero/negative fixed_dt. Camera/controller helpers exist but are unused by viewer; prose positive-forward sign differs from actual negative-local-z convention. Existing tests are narrow source evidence only.

Exact Drive VoxelWorld query returned no documents, not proof of absence. Reuse terrain math and cache contracts only after schema/order, bounds and lifecycle corrections; keep runtime integration explicitly missing.

## Pass 25: UnitBuilding component scheduling versus rendered gameplay
Same pinned NexusBuilder commit; `01_EnvironmentAndToolchain/UnitBuilding/`;27 source receipts. Local C# component/system design resembles engine organization but is not shared JS NexusEngine or Three.js.

- **Active picture:** `MainWindow.axaml.cs` feeds synthetic0.016dt and renders one wireframe cube through `Managers/WorldManager.cs` and `Systems/RenderSystem.cs`. WASD moves the one shared transform; pointer pulse changes rotation/tint and attempts Console.Beep. Any key-up clears movement; held-key composition/focus clearing are absent. Pulse speed decay subtracts per frame, not per elapsed second.
- **Scheduler:** `Managers/Engine.cs` registers ordered Update/FixedUpdate systems with eight-step catchup clamp, but FixedDeltaTime has no positive validation and host supplies synthetic time. Scene/effect runners use DateTime.UtcNow by default with injectable clocks, so they do not share fixed simulation time automatically.
- **World realization gap:** terrain manager generates sin/cos triangle arrays; terrain system keeps a3x3 neighborhood around transform. Active RenderWorld only draws the cube. SceneManager stores nodes and schedules SpawnObject receipts; parent attachment is explicitly deferred. No uploaded/drawn terrain or instantiated scene-node geometry is established.
- **Effects are receipts:** RenderManager.UploadMesh, ParticleRenderer/ParticleManager, AudioPlaybackService/AudioManager append IDs/positions and log; they do not upload meshes, draw particles or play spatial sound. Existing OrganizationalStubsTests assert registration and DidUpdate flags only. Do not confuse the separate Console.Beep attempt with an audio backend.
- **Challenge boundary:** `ChallengeUIManager.StartChallenge` synchronously generates length events and declares success when count equals length; it does not wait for player interactions. The UI immediately awards points; DemoChallengeSystem likewise manually marks success/failure. Score persistence swallows errors. These are reward/scheduler demonstrations, not gameplay completion proof.
- **Determinism:** AmbientEventGenerator has seeded intensity; AmbientEventScheduler overwrites generated timestamps with interval ordering. ResetToStart resets timestamps/count but not RNG. A completed challenge clears its remaining limit, allowing later ambient events; consumers must distinguish challenge completion from scheduler exhaustion. Level/effect JSON supports delayed particle/sfx/position descriptors but does not validate referenced runtime capabilities.

Exact Drive UnitBuilding query returned none; no matching design document inferred. Good reuse targets are descriptor schemas, event ordering and reward formulas, with explicit observable-effect and player-earned-success gates before catalog admission. No native build/test execution.

## Pass26 — BreathingWalls variant ownership

At NexusBuilder commit `862ce82513c9aa1a020e9e2677c1fef32c626231`, `01_EnvironmentAndToolchain/BreathingWalls/GameState.cs` implements six moving AABB walls, timed expand/contract signals, normalized keyboard movement (window handler), collision failure and reset. There is no success objective or seeded layout; the nominal spawn remains safe when idle. `SetBounds` rebuilds walls on the same event bus without unsubscribing old walls, retaining obsolete instances. Window ticks use synthetic 1/60 time and held keys are not cleared on focus loss/reset.

`03_FullImplementation/BreathingWalls/` is a different scalar pulse/threshold UI, not a completed extension of the spatial game. `Features/UI/UiDemo.cs` has literal standalone `n` tokens in normal compilation source. Even ignoring that syntax blocker, its fast scenario path never starts or manually advances the pulse: decay from zero plus positive move assertions cannot prove timing gameplay. `MainWindowViewModel.OnPulse` adds0.3 and decays0.05 only per pulse, producing0.25,0.50,0.75,0.95 then0.95 with default threshold0.4; there is no recovery window or spatial player movement. Property updates originate on the timer thread and window disposal does not call the viewmodel disposal path.

`Program.cs` ignores the documented scenario argument and converts GUI startup exceptions into headless fallback with exit0. Headless tests reference absent `3_Populate/BreathingWalls`; README/archive and vertical-slice PASS claims are historical only.19 source receipts checked against the pinned tree; no compilation or runtime executed. Drive exact-title search found no document; this is not absence proof.

## Pass27 — arena/progression implementation versus probe claims

NexusBuilder `03_FullImplementation/ColorSyncArena/` contains a local typed-component dictionary and velocity integration, but `App -> MainWindow` only displays a bootstrap label. No active engine, input, update or renderer connects these helpers. Collision mismatch has a comment instead of a consequence; the state manager and arena/HUD controls are empty. Do not count the feature directory as a playable color-matching game.

`ArcadeQuest/src/arcadequest/app.py` implements a native Pygame player rectangle and bouncing ball; score increments automatically on boundary bounce. Collision uses the ball center and can reverse repeatedly on sustained overlap. No completion, failure or restart loop is supplied. Deterministic initial values do not make the wall-clock HUD or two-second demo a replay/acceptance proof.

`NexusPygameNeonArena/main.py` owns concrete movement, autoaim shots, enemy pursuit, pickups, score objective, health failure and restart. Its Sample sibling has identical main, pack and README blob identities: one source implementation, two copies. Enemy replenishment replaces survivors; bullets ignore walls; movement uses integer rectangle positions and unnormalized diagonals. The seeded RNG is not consumed, so restart repeats fixed content.

`NexusPygameNeonArena_v2/main.py` adds a real title/briefing/play/phase-clear/end state machine. `campaign_pack.py` controls per-phase targets, health, speed and fire cooldown. The speed reward executes +=0; rapid-fire and boss-gate rewards only enter an unused unlock set. Changes attributed to rewards actually come from phase parameters. Hazard pulse/storm descriptions have no area/timing realization; hazard_damage only increases enemy-contact damage. Critically, longplay injects score, replenishes health, adds shot counters and revives failure; demo also injects score. The movement assertion observes status/score rather than position. These probes prove neither ordinary completion nor control quality. Original scripted output prints PASS even when required assertions fail, and combat success is not part of its return-code conjunction.

## Pass28 — shared Pygame release template and documentation boundaries

`CloudHopperReleaseCandidate/main.py` and `DepthOfDiscovery/main.py` are the same blob (`b3ff69979c575295f94099873aef3c91b0000103`), with distinct packs activating side-scroller jump/landing versus top-down movement. Both are native 2D Pygame, not Three or JS NexusEngine. Their nested pack IDs vastly outnumber implemented runtime branches; moving-platform, patrol, checkpoint-campaign and objective-chain labels do not imply those behaviors exist.

The options route only draws explanatory text. `_write_save` is used by save/release probes only, with no load path and no player position or world-object persistence. File existence is its acceptance check. Held Escape toggles pause every frame; synthetic one-frame actions hide that input issue. Side-scroller collection accepts objective_target//2 (2 of configured4), while HUD still shows4. The cloud pack disables enemies, provides a continuous ground plane and has no other health-loss path, so its loss branch is not reachable through the supplied normal controls. Jump/layout reachability still requires execution; no proof asserted. The exploration probe's far-travel condition is already satisfied by spawn y360. Progression labels are assessed using elapsed frames/position, not actual unlock changes; grounded recovery is printed but omitted from the side-scroller gate.

Drive exact searches for ColorSyncArena, ArcadeQuest, NexusPygame and CloudHopper returned no docs. Broad Color Sync/Depth of Discovery queries include unrelated results; no exact prototype correspondence established. Separately read `0.0.9 — Release Readiness` (166tQWiduuNGOep8jP6tTd-kXFO0fRhuJ1yuqFGQOJkI): explicit not-assessed status, no candidate/package or implementation evidence, matched-device visual/performance measurements required. Read `FROZEN v0.1 — LittleReef-Progression` (1PYvuwiZa26Qn_jbrHO_opKq3oJT482e0DyDz7dPKRkI): discovery-led growth design, with unlocks/rewards/economy deferred. Neither document establishes current capability proof.

## Pass29 — ParticleSandbox active path

At NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `02_ArchitectureAndScaffold/ParticleSandbox/src/main.rs` comments out the renderer module and only polls a real winit window. Vulkan context and particle-buffer creation are `todo!`; the compute constructor panics; spawn/update/compact and indirect render methods have no implementation. The pinned subtree has no shader source or SPIR-V files. The two physics tests only print text. The documented spawn/update/compact/indirect-draw pipeline is a design reference, not GPU-particle capability evidence.

## Pass30 — PBRMaterials preview and compilation facades

`04_CompleteUXFlow/PBRMaterials/src/Program.cs` runs a fixed console registry demo and exits. `PbrPipeline.RenderPreview` ignores the material and allocates a zero-filled RGBA buffer; `ShaderEditor.CompileFragment` returns whether the ID exists. Shader composition concatenates text and silently skips missing fragments. `MaterialManager.EditMaterial` returns true for a known ID without invoking the edit action. Default JSON export loses Vector3 component fields; checked-in `gold.json` contains `Albedo:{}`. Actual reuse is limited to material/fragment registry shapes. Tests check buffer size, registry access and a string substring, not image content, round-trip material values or GPU compilation. There is no graphics backend in the project dependencies. The Full Feature change document describes intended work, not proof of it.

## Pass31 — VoxelSandbox storage without scene assembly

`03_FullImplementation/VoxelSandbox/VoxelSandbox/Domain/` provides16x16x16 byte storage, bounds checks and floor-based negative world-coordinate mapping. `Runtime/CommandManager.cs` supplies FIFO synchronous dispatch and a per-pump command count. These helpers are disconnected from the active Avalonia app: composition registers nothing, no app path pumps commands or creates a world, the viewport is text, and managers/mesher are empty. FBX export is explicitly deferred. Reads allocate new chunks with no residency limit. Command count does not cap handler work; handlers can mutate the handler list while iterating, and no unregister or fault-recovery semantics exist. Tests check simple positive-coordinate round trips and pump count, not negative coordinates, reentrancy, UI or rendering.

## Pass32 — AntColonySim spatial simulation and unused profile fields

`04_CompleteUXFlow/AntColonySim/` is native Macroquad2D, not Three/JS NexusEngine. `main.rs` connects an accumulator scheduler, soil world, ant/dirt managers and actual drawing. Source includes seeded surface/noise, queen descent/tunnel/chamber phases, timed egg hatching, worker task selection,80-node BFS searches, soil digging and loose-mass transport. Rendering draws visible soil cells, mass particles, ants/eggs and inspection overlays; input controls the camera and overlays only. However `World::new` omits required `sand_spawned` and `sand_completed` fields, a static compilation blocker at this snapshot. No execution was attempted.

The ROM parser validates many fields which `Config::from_rom` drops: layer/noise recipes, brood stages, scenario goals/win/loss, worker size, speed and dig strength. Only selected dimensions/seed/scale/camera/surface/grain count and first-species queen size are transferred. Surface smoothing is explicitly ignored. Scenario conditions are never evaluated; there is no player-directed simulation action, death, restart or objective ending. ROM_SCHEMA calls version compatibility strict, but code only checks a nonempty version. Height1 is allowed although world initialization can compute negative surface height and invalid indexing; finite number, tick-rate and world-allocation budgets are incomplete.

Worker dump handling sets the stored state/target to Idle/None, then the common tail restores stale local CarryDump/target, permitting repeated dump behavior after carrying is cleared. Pickup remembers a boolean instead of mass and deposit adds1, so transport does not conserve partial pickup amounts. Dirt flow subtracts source mass using old neighbor values then clamps destination capacity, risking loss when flows converge. Some world changes apply immediately while others are queued, despite comments claiming all mutation goes through commands. Fixedstep catch-up has no work cap; continuous egg production lacks a population limit. These are repair/extraction leads, not a verified colony game. No tests were present in the inspected subtree.

### Drive reconciliation for passes29–32

Exact ParticleSandbox/VoxelSandbox/AntColony searches returned no documents; PBRMaterials returned one unrelated digital-twin title, with no prototype correspondence established. Four0.0.8 NexusEngine package documents were read and revision-recorded. They are explicitly Proposed/not assessed, with no candidate or implementation references. Their reusable direction is consumer-specific baselines, repairs demonstrated in multiple games, optional heavy domains, cancellation/unload correctness, and measured CPU/GPU/memory/loading budgets. Statements about preceding0.0.7 workflows are entry requirements, not attached evidence that those workflows passed.

## Pass33 — FlappyBird and ModelMaze stage labels versus implementation

At NexusBuilder commit 862ce82513c9aa1a020e9e2677c1fef32c626231, `05_CodeQualityPass/FlappyBird/Program.cs` only prints a skeleton message. There is no composed window/input/game loop. PhysicsManager advances time; flap increments unused velocity and emits an event; RendererAdapter draw/feedback methods are empty. Two tests cover defaults and time advancement only. Keep this as a contract scaffold, not a game or reusable flight capability.

`05_CodeQualityPass/ModelMaze/` contains a real straight-line navigator, circle overlap check, scene editing handlers and start/stop timer, but no IPathFinder implementation. Obstacle's constructor sets Position before allocating its bounds; the inherited setter calls the override and dereferences null at any nonzero initial position. Normal click placement and both overlap tests use such positions. No source was executed. Movement only tests the endpoint and can stop at an obstacle; no route search or swept collision exists. Goal arrival has no completion state.

ModelMaze draws in Window.Render but obtains pointer positions and invalidates a nested Canvas; no coordinate conversion is supplied. SceneRepository's default JSON options omit Vector2 fields, losing saved coordinates. Its backup is attempted only when the primary is missing, not corrupt. These are extraction gaps, not successful hardened-editor evidence.

## Pass34 — SkeletalAnimation playback versus skinning

`01_EnvironmentAndToolchain/SkeletalAnimation/` is a C#/Avalonia line-and-joint viewer, not the Rust/Vulkan ten-creature skinning system in its AppPass document. Source includes pause/step, two procedural pose profiles with0.8s blend, and quaternion interpolation for a loaded clip. The UI loads a default three-bone glTF clip, which disables the procedural blend action. Rendering uses Segments; the advertised dual-quaternion palette is not consumed.

GltfRigLoader supports only the first base64 buffer, skin and animation; the GLB file-picker option cannot work through its JSON-text reader. It discards rest rotations, inverse bind matrices, node scale/matrix and skin weights, uses the first sampler's times for every rotation channel, ignores interpolation modes, and parses but ignores bufferView stride. SkeletonState assumes parent-before-child ordering without validating topology. No-animation rigs with more than seven bones exceed the fixed pose arrays. BoneTransforms combines local rotation with screen-space translation, not a validated skinning palette. Tests assert counts, a pause flag and a rigid transform roundtrip; they do not establish imported animation correctness. Reuse playback boundaries and interpolation ideas after contract repair.

## Pass35 — CubePulse and CascadedShadows graphics ownership

`01_EnvironmentAndToolchain/CubePulse/` genuinely wires a custom OpenGL control to resource initialization, indexed wireframe drawing, deinitialization and scheduled frames. Clicking sets rotation speed to10; RotationSystem decays it toward1. Its local Engine registers systems and clamps catch-up to eight fixed steps. However rotation decay is per callback, the caller supplies constant0.016, and the camera recedes indefinitely. A zero FixedDeltaTime makes the scheduler loop nonterminating. Shader failure only logs, the first-draw GL-error branch is unreachable, and depth testing remains disabled. This is a native graphics/input reference, not a complete game or shared JS NexusEngine.

`CascadedShadows/` contains depth/main shader and framebuffer code, but XAML instantiates the base GL control instead of the subclass owning the render hooks. Even if connected, WorldManager switches from Avalonia's supplied framebuffer to0 and ignores pixel scaling; the light-direction uniform is never set and sampler assignment uses float uniforms before binding the program. All three light projections are identical; cascade selection uses world-Z rather than camera depth. The third cube draw reads beyond the18-entry index buffer. No live render proof exists. Keep only split/range math and pass/resource ownership as repairable leads, not available shadow rendering.

Drive0.0.7's four native documents remain Proposed/unassessed, with no exact candidate or release proof. Their useful design constraints are shared domain→Kit→finite Sequence→game-data semantics, headless-first authoring, stable-reference round trips, invalid/cyclic-input diagnostics, undo/redo and preserving originals on failed migrations. The inspected native persistence/import issues are concrete negative cases for those requirements. Exact-name searches for the four audited project names returned no Drive documents; this is not absence proof.

## Pass36 — EmergentAgents neural-controller source and observer boundaries

`NexusBuilder/04_CompleteUXFlow/EmergentAgents/` separates Rust code from a Flutter2D display. The actual Rust world fixes ten agents and seed42, evaluates five ray/segment intersections through a5→4→2 ReLU/tanh network, turns/translates agents and evolves every2,000ticks. Selection preserves the best10percent and fills from the top half; crossover copies half of the input-hidden matrix and mutation perturbs weights uniformly at0.1 probability. The document's5percent Gaussian/full-network genetic recipe is not the implementation.

Obstacles influence sensors but never block motion. Fitness rewards commanded speed and penalizes positions outside the border; agents can leave the world. No task, internal-obstacle collision, success/failure or training-improvement evidence is supplied. Flutter invokes stepWorld inside AnimatedBuilder, coupling simulation speed to rendering and other rebuilds. It draws positions as circles without obstacle/heading data. A global mutex protects each Rust call, but the exported pointer has no retained lock/snapshot lease for asynchronous access. Current synchronous copying should not be misreported as a demonstrated race. Pluggable Brain and VariantEngine modules are unreferenced placeholders; no reset, gene persistence, best/average fitness export or independent trainer is present. The widget test is the untouched counter example. Reuse neural/raycast/evolution boundaries only with a verified deterministic tick and meaningful fitness.

## Pass37 — RealityWorkshop discovery is not XR rendering

`14_FinalReleaseGate/RealityWorkshop/crates/xr_core/` actually loads OpenXR, creates an instance and queries an HMD system. The app then performs180 sleeps of16ms with periodic logging. It creates no graphics/session/swapchain/action resources and draws no workspace. The desktop error path exits nonzero; Android init failure only logs. Native Android packaging needs the externally supplied loader and correct optional ndk-glue feature activation; the Gradle command does not enable the app's optional dependency although android_main uses its attribute.

The February/March staged packet contains source/build claims, but final-stage validation explicitly proves static packet alignment. The referenced RealityWorkshop release-build log is absent from the pinned repository tree. Source ownership is verified; launch, cross-platform delivery and XR behavior are not.

## Pass38 — Skyhook Worldchain separates web scaffold from native biome behavior

The web `app/index.html` remains the same blob previously inspected: its classic script contains a top-level return and literal escaped quote delimiters, preventing normal parsing. Intended behavior merely builds four seeded box groups and moves the camera; it has no active player/game loop and does not reread seed edits at Start. This is non-Nexus Three.js source, not a validated game.

The separate `pygame_isometric_biome/` implementation has meaningful list-driven variation: six biome palettes, biome-specific movement speed and gathering yield, coordinate-seeded resource/height recipes, isometric drawing and in-memory resource depletion. E removes a resource and adds essence; F spends essence but only increments crafted/resonance/attunement counters, leaving the tile unchanged. After gathering, standing still can accumulate resonance. There is no complete objective/failure/restart/save loop or terrain-height collision. Diagonal movement is faster and the visible41×41 tile scan allocates into an unbounded cache; chunk_size is unused. Reuse the parameter-to-movement/yield connection, not the unimplemented world-transform claim.

## Pass39 — OpenXR_Demo is a telemetry facade; Sequence documentation retains separate ownership

`14_FinalReleaseGate/OpenXR_Demo/src/lib.rs` has no OpenXR/Vulkan calls despite dependencies and lifecycle function names. It creates descriptive structs, stores action path strings and logs90iterations×2views. Swapchain creation, rendering and cleanup log then succeed; session state stays ready. Target compatibility checks OS/architecture only. Error catching and stage logs are real control-flow features, but do not prove device compatibility, frame submission or input. The desktop wrapper prints errors without a nonzero exit. The aggregate elapsed timer is overwritten at every nested stage. No Android native entrypoint is present in the core source. February's GO is explicitly scaffold-only; March's no-TODO scan and build claims do not change that. The referenced release-build log is absent from the pinned tree.

Drive0.0.6's four documents are Planned/unassessed with no candidate. They distinguish finite, operation-driven Sequence coordination from continuous Runtime simulation, Schedule timing and adapter-owned work. Required evidence includes all five composition modes, full nested Before/During/After phases, targeted duplicate/stale receipt handling, loser/cancel/unload cleanup, snapshot restoration and10,000waiting-instance resource measurements. Open terminal/migration semantics remain explicit; these are intended contracts, not delivered capability proof.

Drive searches for EmergentAgents, RealityWorkshop and Skyhook returned no documents. OpenXR search reached a terminal second page; broad unrelated results and duplicates were excluded, with no exact match to these native prototypes established.

## Pass40 — LMStudioCodeGen: useful edit boundaries, ineffective acceptance

`NexusBuilder/14_FinalReleaseGate/LMStudioCodeGen/` contains a real C# HTTP/staging/process/apply flow and an Avalonia UI. Its client implements the project's suggested custom `/generate` contract, not a demonstrated LM Studio integration: request fields are seed/steps/files and response fields are files/stepOutputs/meta. No provider for that custom protocol is present in the subtree. Missing response fields default to empty lists, so even an empty JSON object can produce an empty successful iteration.

Execution runs in the target directory before applying the generated batch. The staged batch argument is unused; a generated build script is therefore not the script being tested. Step failures break only the execution loop, returning no failure result to orchestration. The actual injected gate is AlwaysPassGate, and orchestration can apply after a failed step. Caught failures also generally return normally, allowing the UI to display Completed. The model's next_prompt is discarded and existingFiles is never populated or refreshed by the UI: iterations do not form an evidence-driven repair loop.

The writer provides lexical traversal checks, overwrite opt-in, temporary files and backup/rollback attempts. It is not batch-atomic: destinations move individually, rollback failures are swallowed, and cleanup then deletes the backup directory. Symlink destinations, duplicate paths and reserved internal paths are not checked. Mode/Atomic/Op fields do not alter the full-replace behavior. Cancellation of a subprocess wait does not terminate its process; synchronous writes ignore cancellation. Dry run skips final apply but still stages and executes configured commands.

Transcripts distinguish gate/apply/request failures, but use iteration-only filenames that overwrite prior runs, copy cumulative logs and omit model/profile/config/file-hash identities. Cancellation can prevent failure-record writing because the same canceled token is used. Stage14 validation is explicitly static documentation reconciliation; the referenced release-build log is absent from the pinned tree. No source/test execution was performed. Reuse interfaces and staging intent only after correcting failure propagation, exact-candidate checking and preservation guarantees.

## Pass41 — NexusStageManager: discovery and selection, not stage execution

`NexusBuilder/14_FinalReleaseGate/NexusStageManager/Services/` contains manifest discovery, profile loading, selection-table resolution and output-folder enumeration. It reads direct stages, inlineProfile or profileRef and bounds manifest discovery to200files/depth8 with ignored build folders. Global stage/action names are merged case-insensitively; conflicting definitions lose provenance and first action kind wins. The separate `.nexus/selection-dataset.json` selects the first matching stage/action mapping. Absolute and outside-root workspace/profile paths are accepted. No matching fixture manifests/dataset were found in the pinned tree.

The output browser recursively reads outputs without discovery's depth/count limits, sorting or visited-link protection. Async selection loads lack cancellation/version checks, allowing an older load to replace a newer selection. Discovery catches many errors, but deferred filesystem enumeration can throw outside its local catch scope. The in-memory log is capped at500lines; the disk log is unbounded. These are extraction constraints, not observed runtime failures.

No stage/action executor, LMStudio integration, validation runner, attempt history or pass/fail transition engine exists in this project. Colored validation nodes describe catalog entries; they do not validate artifacts. Historical docs explicitly acknowledge the browser-only scope and a native launch crash. No current execution was performed.

Drive searches for LMStudioCodeGen and NexusStageManager returned no documents; absence is not established. Two existing version snapshots were read: the8a60167 record is explicitly superseded, and the bacc8fc skill/version snapshot reports17completed versus earlier12, omits raw logs/ready-goal names and calls for candidate/naming reconciliation. Neither establishes current release or runtime readiness.

## Pass 42 — Builder-Lite list execution and design-source leads

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/14_FinalReleaseGate/NexusBuilder-Lite/`: 17 selected files inspected, all matched tree blobs; no execution.

- **Reusable list machinery:** `app.jsx:1077–1439` resolves loop tokens, expands count/text/JSON items, builds bounded context/section packs, and derives steps from manifests. Library seeds are blueprint presets; they do not roll deterministic game profiles or connect runtime domains. `engine/validate.js` checks text shape/JSON parsing only. Project view displays source text, not a running game.
- **False completion:** `app.jsx:1752–1946` lets model constraints override caller constraints; failed writes continue, loop receipts can say success, run errors return normally, and a pipeline can report Complete. Fan-out-only returns before child execution; child calls omit parent loop context. These paths must not be reused as acceptance gates.
- **Expansion boundary:** model-generated additions have local caps, but manual recursion, count loops and manifest fan-out lack a shared overall budget. Expansion influence is checked against a model-written report and failures remain warnings. Snapshots/ZIPs preserve files, not a locked profile plus resumable execution state.
- **Provider/UI gaps:** manual endpoint sends the selection sentinel rather than its entered model ID; `commitDraft` is undefined at 2632. Advanced `GuiStep.jsx:448` uses unimported Zap. Requests lack generation timeouts/truncation validation; one shared browser model worker lacks robust failure/identity handling. These are source findings, not reproduced runtime results.
- **Drive correspondence:** [Game Systems Master](https://docs.google.com/document/d/12vBVRUX2YV1HLyzABIzhYiOV3XxSa38NbRM8K8toKY8) supplies design-only domain candidates (spatial traversal, attached inventory, route/economy interactions, heat vs airflow, delayed machinery/warning consequences). [Master Folder Breakdown](https://docs.google.com/document/d/11mmY7-j_gL1r0ajEa-zXYxoKYBXCpIw5sM_pBsrKSgk) supplies selected historical preservation/source leads only; its underlying local folders and bundles were not inspected. Exact Builder-Lite/StepEngine document searches returned no matches; broad Idea Engine pagination remains incomplete.

## Pass 43 — AgenticRebuilder is a disconnected simulation

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/03_FullImplementation/AgenticRebuilder/`: all 23 non-lock files inspected; tree identities matched. The HTML bootstrap references absent scripts/styles; React imports absent providers/store/components and mismatched reducer names. `tsconfig.node.json` is absent. No build or model execution performed.

- `RefactoringOrchestrator.ts` runs four timed, fixed-response commands and ignores sourceCode. Separate analysis/planning/inference classes also simulate results; they are not a working integrated command chain. Mid-run statuses bypass its RUNNING-only guard; old results/error are not reset for a new run.
- Configuration API dispatch and log persistence are noops; the form owns a separate state store. Controls send unhandled orchestration actions; terminal progress/errors are randomly fabricated. These are demonstration displays, not receipts.
- `FileIOManager.ts` implements browser file reads, but ZIP output is JSON metadata marked application/zip, excluding file contents. Plan/source entities suggest useful field shapes, not validated dependency execution or restoration.
- Exact Drive AgenticRebuilder/AutoSelfExpansion searches returned no documents; NexusBrain returned upkeep metadata only. No direct implementation correspondence established.

## Pass 44 — AutoSelfExpansion has real IO but no reliable acceptance loop

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/04_CompleteUXFlow/AutoSelfExpansion/`: 10 selected files, full App.jsx and tool/test code inspected. Real HTTP thinker/writer calls and virtual-file edits exist; no engine/game assembly.

- `App.jsx:541–682`: asynchronous five-second interval has no in-flight guard, cancellation or run identity. Pause/reset cannot cancel pending work; stale file snapshots overwrite concurrent edits. All BUILD_FILE actions are processed ahead of the remaining actions, changing declared order.
- Builder sees only instruction; transport/missing-output errors become code comments and are saved as builds. READ_FILE has no handler. Tool declarations are static; writing lib files does not register new tools. Prompt claims append-only master goal but WRITE_FILE/BUILD_FILE can replace it.
- `runCodeInSandbox:298–333` executes new Function in the page, with no deadline, async awaiting, import resolver or isolated storage. It captures text rather than an authoritative pass/fail result. Execution and fire-and-forget pushes occur inside a React state updater; PUSH records initiation before remote outcome. No remote operation was run in this audit.
- Persisted virtual files omit configuration/cycle/run identity; logs grow without bounds. `tests/tools.test.js` checks tool keys/help text only. Treat docs' completed feature checklist as an intent claim, not evidence of autonomous correction or valid generated games.

## Pass 45 — NexusBrain's displayed loop is not wired to execution

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/04_CompleteUXFlow/NexusBrain/`: 14 selected files inspected, including all active JS/JSX behavior; no runtime execution. Source contains an agent-state UI and Canvas2D decorative particles, not a Three.js or NexusEngine game.

- **Missing driver:** `useAgentBrain.js:319–434` defines/returns step, but App and all three view components never call it. Play changes isRunning only; docs' four-second interval is absent. The only animation driver updates background particles.
- **Memory/validation:** state lives only in React; clipboard export has no restore path. CREATE_TOOL/ADD_SKILL/ADD_LESSON accept unvalidated model claims. Nested state is mutated through a shallow copy, and cycle_count increments for every update rather than verified cycle completion. No current capability should be inferred from a skill label.
- **Execution gaps:** worker code has no timeout or pause cleanup; dependency-load failure is logged then ignored. Tool injection mishandles declaration strings; pipeline tool source is evaluated rather than explicitly invoked, and part pipeline steps are ignored. Failed pipelines disappear from sensory input.
- **Feedback gap:** journal retains only100characters of action result, and the next prompt includes neither journal nor prior execution results. This is not a reliable evidence-driven repair loop. LMStudio calls omit model identity/response-status/output limits; Gemini key is fixed empty.
- **UI source defects:** MonitorPanel references unimported AlertCircle, Activity and ChevronRight in conditional branches; JSONTree dereferences nested null. Document claims about infinite-loop protection, persistence and validated skills remain unproven. Upkeep-only Drive matches add no technical proof.

## Passes 46–47 — Browser inference and biological catalogue boundaries

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`: WebLLM_Demo15 files and LargeSpeciesTrainer21 files inspected; all tree blobs matched; no execution.

- **WebLLM_Demo** (`02_ArchitectureAndScaffold/WebLLM_Demo/index.html:321–587`) is a Transformers.js worker chat UI. Loading/progress and explicit worker termination are concrete. Each call contains only the latest user message; DOM chat/logs are not persisted. Stop reloads the page. GPU readiness is API-presence only; worker import/crash/timeout handling and cache-deletion verification are missing. Historical build-log records EADDRINUSE then deferred validation, not a successful model run; current port3001 differs older guide3000.
- **LargeSpeciesTrainer** (`03_FullImplementation/LargeSpeciesTrainer/src/App.tsx:104–387`) implements GBIF species fetching, EOL enrichment and exception-triggered Wikipedia fallback. Source labels can inform provenance-aware catalogue tooling. Missing EOL media/text does not itself fall through; fallback-only records still receive complete status. Names are reduced to two words and original GBIF IDs are not retained.
- **Simulation claims bounded:** `predictSpeciesProperties:94` returns fixed text/habitat; mass/trophic parameters are unused and the configuration modal has no inputs. Genesis waits four600ms stages, picks a random label and displays a placeholder image. No learned model, embedding database, 3D scene or engine integration. NPU98/12 and microphoneACTIVE are UI constants; docs' performance percentages/latency are unsupported measurements.
- **Recovery gaps:** cursor is persisted before batches finish, while results remain in memory. Failed/empty pages advance without a committed-result checkpoint. Stop cannot cancel existing fetches and stale closures can overwrite a newer selection. Import only checks array shape; no dedupe/schema/receipt validation. Docs describe AllOrigins, but active code uses Vite dev proxies with no production counterpart shown.
- **Drive searches:** exact LargeSpeciesTrainer and ConverterEngine returned none; WebLLM returned two meeting-note metadata records, not verified correspondence to this demo. No inference/runtime claims promoted from search results.

## Pass 48 — ConverterEngine-CLI source fragments do not form a runnable tool

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/04_CompleteUXFlow/ConverterEngine-CLI/`: 17 selected files inspected. All15 Python files literally include Markdown code fences, a parse blocker. No execution was attempted.

- The main entrypoint defines mock filesystem operations and a fixed report. It never wires the separate model adapters, refactoring orchestrator or ZIP service. README, main and separate parser each describe different CLI arguments.
- Contracts conflict: orchestrator expects synchronous generate_response; declared gateway offers generate_text/structured/stream; API adapter offers generate_completion(prompt); local adapter offers asynchronous generate_completion(request). Filesystem ports and maps likewise disagree. httpx used by the local adapter is missing from requirements.
- The fragments contain useful request timeout/status checks, plan/log field shapes and analysis→plan→execution prompt separation. These are extraction leads only. Orchestration saves raw output and labels it successful without validation. The ZIP fragment writes directly to its destination and can delete a partial replacement after failure; no archive integrity or transactional promotion exists.
- No NexusEngine integration, game assembly or end-to-end validation is present. Exact Drive title search returned no documents.

## Pass49: ConverterEngine React and Drive reuse criteria

- Pinned NexusBuilder ConverterEngine App.jsx83-134/397-465 supplies actual sequential HTTP generation, not the CLI mock. Its compiler/test/review boundary is absent: ready-for-release is a text-generation completion message. Seven source/configuration receipts retained; lockfile not inspected. No execution.
- App.jsx430-457 omits prior generated files from generation context and gives organizer filenames only; model-selected paths may overwrite. JsonMode unused for local requests, missing timeout/abort/response validation; remote proxy external and key editor unwired. Extract staged UI/configuration and ZIP concepts, not release reliability.
- Drive Preservation and Cleanup Tracker is a67-folder first-pass inventory, not source or backup proof. Nexus004, two0.0.5 candidates, Agent-Goal-Batch-20260808 and four EngineRecovery packages are leads only; no local source reads or cleanup authorized by that document.
- Drive Content-to-Product Loop Guide offers reusable seeded-service and evidence rules: shared preview/export core, immutable attempts, independent checks and clean-environment reproduction. It is design guidance, not runtime evidence.

## Pass50: ConverterEngine-DotNet launcher and substitute-test boundary

- Twenty-five pinned sources/configs/tests/reports inspected. Runner Program.cs launches the Avalonia project with dotnet; Runner.csproj has no dependencies. Historical runner-only build PASS_WITH_CONSTRAINT cannot establish a standalone refactoring tool, despite README release-grade/optional-UI claims. Referenced runner build log absent pinned tree.
- Production App/DI, configuration and model ports use incompatible namespaces and method contracts; concrete analyzer/planner/executor and window/entry assets absent from subtree. Core orchestrator has useful feasibility/error/cancellation flow, but is not wired to a complete implementation.
- Tests locally redefine an orchestrator and adapter rather than exercise production types; test directories have no project files. The nested CI snippet is fenced and assumes a different src layout. No tests/builds run during audit.
- Extract only bounded orchestration and adapter-contract ideas; require one actual production contract, transitive runtime packaging, real-source tests and complete error propagation before reuse. JSON persistence overwrites nontransactionally; model adapter wraps cancellation and omits completion/identity checks.

## Passes51-53: audio, synthesis and showcase boundaries

- AudioNavigator contains an actual NAudio mono-to-stereo mixer with1/(1+distance) attenuation, constant-power pan, mute/solo, gain, clamp and peak meters. Its separate Features/Core audio abstractions are not the active playback path. File provider toggles state only. Save/load restores every oscillator as440Hz; UI/audio share mutable source lists; no device evidence.27 selected files read.
- IdeaBuilder is one React document-synthesis component, not a recursive profile roller. Recursive/depth controls only affect prompt wording; archPrompt/planPrompt are never sent; API key empty and no host/package supplied. Retain list-configured workflow/export ideas, not research accuracy or game-generation claims.
- NexusAgentTemplateShowcase is a5-file static site.52-template/4-family numbers are copy; request action changes button text without executing/persisting a build. Do not count as harness or game.
- NexusAgentThreeJsShowcase has14 non-dist/nonlock sources inspected. Non-Nexus procedural presentation rig, no complete loop. Seeded initial orb positions are immediately replaced; random particles and frame-dependent accumulation defeat full reproducibility. Pause/reset/teardown incomplete. Dist bundle not proved equivalent.

## Passes54-57: native mechanic fragments and editor contracts

- BlueprintPulse: Malformed .NET9 transport scaffold; named registry and interface fragments, not operational engine transport. 10 files including sibling core/tests inspected. Facade, in-memory strategy, DI registration and tests contain misplaced method bodies/braces and stray text; source is not a working bus. Registry unregister does not dispose; DisposeAsync swallows errors and leaves registrations. Start flag in intended in-memory fragments not enforced on send. No Nexus/Three/game runtime; contract ideas only. Tests not executed.
- SimTicker: Avalonia2D fixed-step bouncing-entity snapshot preview; incomplete deterministic replay. 9 selected files. Random42 initializes10 entities; 1/60 step and1000snapshot limit. Display is ellipses, not3D/Nexus. Initialize does not clear prior snapshots; restore does not truncate future history. Old future states can remain after reset; minimum-key eviction can remove reset0. Bounds outside snapshots/hash; constructor initializes default800x600 before window updates bounds; reset uses changed bounds. Same-seed replay not fully specified. 32bit truncated hash displayed, no repeated-run comparison; FPS60 fixed label; no accumulator/backlog compensation, export, or window-close timer cleanup. Plan claims not execution proof.
- ShadowOffset: Avalonia2D delayed cross-counter effect; reusable event-delay fragment. 8 project files+2 siblingtests inspected. ActionA incrementsB after15 UI ticks; reverse forB.100ms timer does not prove wall-clock1.5s. DelayPipeline rejects negative delay, queues currentTick+delay and emits due events; zero delay executes next Tick. Callback-enqueued zero-delay events can keep same dispatch loop running; callback exceptions dequeue and lose item. No queue bound/reset/cancel/serialization, target validation or timer-close cleanup. Actual-source tests cover delay/order only, not executed. No3D or complete objective/replay.
- NeuralNest: Avalonia2D clickable parent-child node growth; fixed five-node ending. 8files; click adds child100units from parent at random angle; square/circle and4colors; fixed bounds50..750/50..550. Out-of-bounds attempts silently rejected; no overlap check/seed/adaptive bounds. Stops accepting nodes at5. No AI, failure, restart, persistence, keyboard equivalent or branch tradeoff. Not a complete replayable game.
- DiceOracle: Avalonia2D random-number reveal toy; isometric outline is not3D rendering. 8files;20frames rotate/flicker random1..6 with20+i*10ms waits, then separate random outcome mapped to6fixed messages. Unseeded RNG shared by cosmetic flicker and outcome; no simulation dice/physics/objective/progression/persistence. async void animation has no cancellation/try-finally; errors can leave roll disabled. net9/Avalonia11.3.10; no execution or visual proof.
- BreathBox: Avalonia2D three-phase breathing-size animation. 6files;50ms UI timer cycles4s inhale/hold/exhale, grows100to300 then shrinks. Click stops/resetssize. DateTime.Now rather than monotonic/simulationclock; transitions discard overrun and do not clamp endpointsize. No scoring/input timing challenge/pause-resume or completion. Repeated starts allocate timers; no window-close lifecycle handling. No Nexus/Three/3D; animation pattern only.
- PromptPet: Avalonia2D fixed staged character reveal; input text has no semantic effect. 6files;any nonempty Enter incrementsstage up to5; body,ears,eyes,arms,blush drawn procedurally. DrawPet ends atstage4; fifth stage has no distinct appearance. No model/prompt interpretation, seed, branching, resource tradeoff, failure, save or restart. Repeated Enter starts overlapping async bounce loops with no cancel/close handling; capped stage still bounces. Text-driven evolution claim is unsupported.
- PixelPulse: Avalonia2D64cell fidget toy; presentation feedback only. 6files; clicked Border changes onecell to one of5colors, pulses scale; random20percent textoverlay,50ms randomcellmargin twitch. Unseeded RNG and overlapping async animations; old overlay hide can cancel newer display. No window-close timer/animation cancellation, reset/history/objective/replay outcome. Clicks depend on exact Border eventsource; unused hit-test point does not broaden handling. No keyboard equivalent orNexus/Three/3D.
- SystemMap: Incomplete Avalonia2D node/region editor; not engine domain execution. 8source/config+2historicallogs inspected; build_debug large log not read. Current source references undeclared _isConnecting/_connectionSource; Models.cs lacks ObservableCollection namespace import and csproj supplies no implicit/global using. Delete removes only item, leaves connections/region members. Select does not set model IsSelected, so selected styling cannot follow selection. Color field only filled on selection, no writeback. Drag does not capture pointer; traversal stops at first SystemItem DataContext, whose immediate parent may not be Canvas. Modes not exclusive. Bezier endpoints update onlyX/Y, not boundary dimensions orcolor; subscriptions lack detach cleanup. Region uses padded bounding box, not hull/topology; nodes use fixed25offset. Historical logs show PointerMovedEventArgs errors; current source instead uses PointerEventArgs. Do not present old errors as current build or a fix as verified success. No save/load, undo, stableIDs/schema, engine behavior wiring,3D or current build/run proof.

Drive: Repository Documentation Guide (10Q6NVP_ylZsUasE4JRW97xNrHE3M97yS-L45BE9tq6Y),251paragraphs, clarifies source/provenance and proof boundaries. Generic guidance; not a capability manifest. No source or runtime changed.

## Pass58: native NexusBuilder staging is not generation

- Avalonia .NET9 blueprint staging/apply shell; generation action writes task-description artifacts, not model-produced software.
- 31 files incl24 C# sources,2XAML,project/solution and3docs. Active App creates ShellViewModel directly; Registries/Managers/Slices and LlmProvider/StorageProvider/ZipProvider not wired into this viewmodel.
- RunAttempt traverses only top-level Steps and writes markdown Task/TargetType/timestamp to requested filenames. Ignores SubSteps, model, master-goal interpretation and naming rules; .cs/.js target can contain markdown. No code generation, build/playtest/repair/acceptance.
- ResolveStepOutputPath accepts raw TargetName/StepId; staging writes do not enforce root containment, unique normalized paths or reserved names. Can escape staging or overwrite earlier output. Apply StartsWith path checks lack directory-separator boundary and symlink resolution.
- Apply validates/copies incrementally; a later failure leaves earlier files changed. No rollback/atomic commit, content hashes, revision guard or metadata authenticity; trusts saved workspaceRoot. Second-resolution attempt/backup IDs can collide.
- 50000file scan has no deadline/cancel/link-cycle handling; includes previous outputs. Blueprint mutable during asyncrun, no immutable snapshot. Failed new attempts can leave old LastAttempt available; no durable error metadata/checkpoint reload.
- Model test is separate joke request; no identity/context/finish-reason/schema check or explicit output allowance. Response endpoint classified as chat but sends messages. HTTP200 parse failures and emptyendpoint can still map to successful CLI exit. Args including supplied key written startup log.
- LlmProvider returns local_fallback JSON with prompt hash and timestamp, not inference. StorageProvider writes whole JSON file nonatomically; no version/locking/corruption recovery, and not called by active shell. Provider Save only updates in-memory fields; blueprint Endpoints not bound to UI provider selection.
- ZipProvider opens read archive before using-var create archive is disposed/finalized; central-directory ordering defect. Export button has no command. No generated game preview.
- Stage14 evidence is documentation reconciliation; historical buildPASS references absent NexusBuilder__dotnet_release.log in pinned tree. Solution points actual app but no current compile or runtime evidence. Static marker scans do not establish generator completeness.

Reuse staged attempt/apply and explicit overwrite concepts after confinement, atomicity, immutable input and proof repairs. No new generated-game capability counted.

## Passes59-61: operator bridges, discovery heuristics and a Unity prototype

### unityDemoBridge

Express/WebSocket desktop and Unity operator bridge with MCP/browser/scanner tooling; no generated-game or Nexus runtime.

- Pass59 reads20 host/MCP/Unity files; pass60 reads13 active desktop/scanner files. Frontend scripts, legacy Python bridge, rawlogs, saved dossier bodies and lock resolution remain separately unaudited.3D app control is not3D game implementation.
- Unity C# uses EditorApplication.delayCall to inspect scene/buildlist, createcube and toggleplay. Hardcoded unity-editor-bridge ID and localhost3000 conflict with multiple projects/alternate ports. Custom Extract/SimpleJson not robust for escapes/controlcharacters; no reconnect/shutdown lifecycle.
- Unity play/stop returns requested boolean without awaiting editor transition; createCube no Undo registration; kill_switch only acknowledges and cannot interrupt queued main-thread work. Live Unity compile/runtime explicitly skipped in historical FAIL release report.
- server.finalizeJob matches bridge only, never current action_id/correlation or sending socket. Late/stale/kill acknowledgments may complete newer jobs; missing status defaults success. Bridge registration replacement and result origin are unverified.
- Per-bridge queue has execution timeout but no queue length/wait deadline or durable state; duplicate actionIDs overwrite waiters. Disconnect finalizes current but leaves queued jobs; cancellation flushes server state while underlying work can continue.
- YAML validator checks action presence and required nonempty params only; types/null/extra values and bridge capability declarations are not enforced. server.listen(PORT) omits host despite localhost documentation; no auth/Origin checks on action or bridge registration routes.
- BrowserHarness performs real Playwright clicks but waits for result text change, not correlated terminal result. Same valid repeat can timeout; intermediate JSON can satisfy wait. Selftest returns results/theme.matches without asserting semantic success, missing target is often ok:true; Unity validation onlyping+scene even labeled mutating.
- Shared logger writes console.log during stdio MCP tool/resource calls, contaminating protocol stdout; sync unbounded JSONL disk logs with400memoryevents. AppClient fetch has no timeout/abort. MCP rootDir uses URL.pathname without fileURLToPath; host-path portability unverified.
- Historical macOS launcher/scanner/selftest PASS claims remain historical; no current browser/device/test execution in this audit. Windows/Linux and Unity live proof missing.
### unityDemoScanner

Passive desktop metadata normalizer and heuristic integration recommender; discovery does not implement actions.

- macOS gathers top-level menu items/shortcuts and aggregate names/counts per controlrole; no recursive accessibility tree or unique per-control identity. Uses processname/windowindex with delimiter-encoded strings; snapshots can shift between probes.
- Windows/Linux return window metadata, no UIAutomation/AT-SPI traversal; Linux service selects first matching process, so multiple windows sharingPID can be rejected/misresolved. checkSupport not used by service; adapter presence means supported.
- confidence values are hardcoded(.90/.94menu,.88shortcut,.84control,.55hint), not calibrated evidence. Control fallbacklabel makes empty labels appear named/high confidence; default focus/invoke hints are inferred not tested.
- recommend.js routes menu/shortcut/control to desktop_common, whose executor has only ping/list/focus/openURL; menu invocation/key dispatch/set_value are absent. Suggestedaction names can collide after slugging; no executor generation.
- Entry IDs hashsurface/locator/label only, omit app identity/control ancestry; duplicated controls and renamed windows cause collapse/churn. Evidence is synthesized from normalizedmetadata, not independent rawcapture.
- Scanner has no concurrency cap/deadline/cancel; arbitrary scan_profile recorded but no behavior switch. Failure sessions remain memory-only; successful session deletes active record after4nontransactional writes.
- Store trusts scanId forpathjoin, lacks containment/schema/hash/versioning/atomic publish. Corrupt dossier can break list/health; duplicated tree/evidence files grow storage. Diff JSONstringify compares normalizedrecords, not source/runtime capabilities.
- Desktop commands use execFile but no timeout/AbortSignal; killswitch acknowledges without terminating childcommands. macOSfocus ignoresrequestedwindow; Windows dependencycheck reports satisfied without verifying fallbackpowershell and interpolates unvalidatedstrings; nativehosts untested.

### Escape The Coop

Pass61: all10 custom C# scripts, testscene,3scriptGUIDs,2LFS pointers,buildsettings and editorversion inspected at2f9ddfdd361553c614b6860083d409d3c5fc530a.

- AIChicken initializes5state refs without nullchecks; ChangeState omits previous Exit; no initial Enter. Coop randompoint alwaysVector3.zero. Idle/running/jumping/scared empty/base-only.
- Walking requires Space key, picks unseeded point near worldorigin without NavMesh sampling; RPCbroadcast commented and destination call local. No autonomous behavior/replayproof.
- NetworkController onlynamed create/joinMaxPlayers4+logging; no connection/bootstrap/authority/synchronizedloop/recovery. Instantiate spawner notnetworked, countfieldunused byexternalamount API.
- Testscene wires AIChicken andNetworkController GUIDs but ChickenSpawner-namedobject hasTransformonly. Serialized scaredsState stale, no jumpingState, coopnull; Awake mayfail on missingrefs. LiveUnityimport required to prove actualfailure.
- Enabled build scene BNG Physics Hands; _StartScene shares503139byteblob1912c8f52807ca6501c3da2d83e6c929a78270a1 withvendor Rigidbody Player scene. No customprefab ininspectedproject-ownedtree; vendorcontent notcountedasoriginal.
- Packages manifest/lock areLFS pointers, notresolveddependencies. No import/compile/play/network/deviceexecution or rightsverification. DriveTechnicalReference corroborates source facts; rendering/XR/vendor package claims outside selectedread remainhistorical.

Drive Technical Reference corroborated for selected source/scene facts; document-only XR/rendering/vendor claims remain qualified. No execution or external mutation performed.

## Pass62: Unity_Demo frontend, obsolete mock and historical scan limits

Pinned source: LuminaryLabs-Dev/NexusBuilder @ 862ce82513c9aa1a020e9e2677c1fef32c626231, under NexusBuilder/14_FinalReleaseGate/Unity_Demo/. Full source receipts cover frontend/{launcher,shared,read_only_connector,unity,desktop,health,status,scanner}.js, bridge/bridge.py, scripts/{setup_host,start_all}.js, selected setup/architecture/scanner docs, MCP example and stage tracker. Three saved JSON artifacts were parsed for schema, counts, references and duplication, not exhaustively interpreted.

- Legacy bridge/bridge.py is explicitly scaffolding: capture returns None, template matching fixed coordinates, OCR fixed text, input prints, login/submit sleep then report success. Kill only acknowledges. Its Socket.IO-style /socket.io transport differs from the active server's /ws JSON protocol. No usable vision/input adapter or cancellation proof.
- shared.js ignores HTTP status in fetchJson/postJson and has no request timeout. Disconnected sendAction logs a failure but returns the ordinary request object; action IDs use action+Date.now while correlation IDs are UUIDs. Log text is unbounded. A WebSocket Connected badge only proves UI transport.
- Unity and read-only connector state/validation requests omit the selected bridge ID; direct actions use it. Result views are client-scoped rather than tracking the latest action/correlation. desktop.js renders message.data alone, losing the status/action envelope. Launcher ready counts reflect availability metadata, not completed operations; independent interval refreshes can overlap.
- Read-only connector matching searches all raw window fields for broad substrings (including Code). Window titles/apps, launcher metadata and many scanner labels/locators are interpolated into innerHTML without escaping. Preserve external observation text as data before reuse; no exploit executed.
- Scanner tree child filtering requires both child and top-level tests to deny a node; permissive defaults mean the controls toggle does not hide control nodes. Opening a dossier does not clear currentDiff. Start remains enabled during scans; scan events can race the HTTP response, with no completion polling/reconciliation. A scan ID immediately gets a ready-styled badge even while running.
- setup_host.js sets failure only for missing dependencies, not denied permissions. start_all.js launches MCP after a fixed1s delay, lacks child readiness/error/exit supervision, prefixes stdout/stderr, and shares stdin; this is not a clean external MCP stdio transport. The separate example points to a developer-specific absolute path.
- docs/SCANNER_WORKBENCH.md correctly limits output to passive discovery and heuristic recommendations. STAGE_TRACKER.md confirms direct stage14 import, missing verified stages00-13 and no graduation. Architecture claims of launcher accordion/API differ from current standalone connector links and sidebar endpoint; source wins.

Historical scan data/scans/scan_1772750845462_4180f7fe/ reports completed on2026-03-05. Parsed157 entries comprise77 menus,77 shortcuts,1 aggregate group control and2secondary hints.40 shortcut records contain the literal missing value yet carry0.88 confidence;77 menu recommendations are classified high value. The active desktop adapter cannot dispatch those menu/shortcut actions.158 evidence records resolve all entry references, but tree.json and evidence.json exactly duplicate corresponding dossier sections. This establishes internal reference consistency, not independent corroboration or157 executable capabilities. Summary counts agree. Logs/screenshots remain unread historical artifacts.

Reuse priority: observation→candidate→typed selection→verified action should retain exact source, stable target, correlation, terminal status and independently executed evidence. Missing-value filtering and adapter capability checks must precede probabilistic ranking. No game count or runtime readiness is added.

## Pass63: ThroughputApi request admission is real; processing/recovery remain scaffolded
Pinned source: LuminaryLabs-Dev/NexusBuilder @862ce82513c9aa1a020e9e2677c1fef32c626231, NexusBuilder/14_FinalReleaseGate/ThroughputApi/. Read API/Agent/CLI entrypoints, worker/options, all four Core sources, API project, agent configuration, two-test source and historical validation.

- RequestConcurrencyGate wraps SemaphoreSlim with positive concurrency validation, timed/cancellable acquisition and IDisposable release; API middleware emits429 when acquisition times out. This is a concrete reusable request-admission pattern. Defaults16active/250mswait. Waiter count and active request duration are unbounded; health competes for the same leases. Timeout config lacks range validation, lease double-dispose guard is not atomic, and semaphore has no owner disposal.
- Correlation header is accepted after nonempty/length<=128 check or generated. API records start/reject/complete and echo rejects blank/>2048 messages. Cancellation/acquisition exceptions occur before completion finally; downstream exceptions can produce completion logs with an unset success status. No domain job queue or engine execution endpoint.
- Worker increments a process-local tick ID, logs and delays. It does not consume API requests or perform a task. Failure creates an exception descriptor with current timestamp, logs WorkerRecovered, then may break after threshold; no state restoration, persistent log replay, retry backoff or explicit host-stop. Zero interval can spin; invalid interval can fail repeatedly. Failure exit still says loop canceled.
- CLI health is its own ok payload; emit prints arguments. No HTTP client. ResolveCommand picks the first non--argument, including option values when flags precede command. Timestamp and default GUID make outputs nonidentical despite deterministic wording. Console logging shares output with JSON.
- ApiSmokeTests only assert root Hello World and health status text. docs/VALIDATION.md historical2026-02-13 PASS(2tests) does not establish concurrency, cancellation, recovery, worker linkage or present build correctness. No tests executed.
- Drive exact product keywords and broadened title filter returned no matches. Broader fulltext terms produced unrelated/generic metadata, not confirmed product documents; no absence claim beyond those queries.

Reusable domain: admission lease plus correlation/error vocabulary, after bounded waiting, timeout, terminal-state and lifecycle validation. Do not register this as a deterministic recovery engine, distributed pipeline, agent executor or playable game.

## Pass64: NexusResearcher executes artifact templates, not research or model work

Pinned LuminaryLabs-Dev/NexusBuilder @862ce82513c9aa1a020e9e2677c1fef32c626231, NexusBuilder/14_FinalReleaseGate/NexusResearcher/. Full12 C# files plus project, README, two primary XAML views and final-gate document inspected.

- PipelineViewModel defines2goal+4research+5build steps. ExecuteStep invokes BuildStepOutput, which writes headings, prompts/settings and a fixed completed-execution sentence. Discover Sources, Scrape Pages, Generate Code and Critic Pass do not fetch, infer, compile or critique. Phase manifests label these files generated. SafeMode/output modes/model role are metadata, not enforced behaviors. Steps can run out of order without predecessor evidence.
- MainViewModel RunAll/PlanOnly overwrite state/run_request.json; the complete C# inventory has no consumer. Cancel only deletes that file. Seeds are display strings. Validation checks nonempty/duplicate seed labels, not pipeline contracts.
- ModelsViewModel connection test validates URL syntax and explicitly skips network; JSON-mode probe serializes a local object after checking128-token minimum. No provider client. Model role lists are independently hardcoded. registry uses state/models_registry.json, while JsonViewModel edits state/models.json and pipeline.json; pipeline never loads those files.
- JSON validation is syntax only. Apply writes two files independently without atomic commit; exporter uses second-resolution folders and absolute paths without hashes. Model load is case-sensitive/default-fallback and unguarded on malformed JSON at construction. UI tabs create independent view models; edits do not propagate.
- Sentence utilities split a fixed sample on punctuation, tokenize spaces and count words>=4chars. They do not use model SentenceBreakdown or discovered pages. Queue, dictionary, artifacts and pipeline settings are in-memory only. DryRun still creates a folder; ViewOutput displays path, and blue hand-cursor artifact text has no open action. These are not resumable research checkpoints.
- Final-gate PASS concerns packet/tracker/placeholder-marker reconciliation; historical build addendum is a claim, not execution here. Lack of TODO markers does not establish implementation.
Reuse phase/step/artifact vocabulary only after connecting actual operations, one authoritative config, dependency validation and durable receipts. Do not count11named steps or5model roles as implemented capabilities.

## Pass65: SmartFileSystem cleanup capabilities and preservation gaps

Pinned same NexusBuilder commit, NexusBuilder/14_FinalReleaseGate/SmartFileSystem/. Selected20 receipts cover native stub, scanner/review/cart/duplicate/apply logic, protection, candidate/snapshot/settings records, settings store, main view model/handlers, two test sources and historical docs.

- Native smartfs_core/src/lib.rs only returns init0 and a static version; free-string is empty. RustInterop only probes those exports and considers any returned init code available. Actual traversal is C# ScanSlice. README fast Rust scanning/index/query claim exceeds native implementation.
- ScanSlice stack-traverses directories, skips reparse/hidden/system by options, collects all file metadata and top-size summaries, reports progress every200ms. No content hash/index database. Overlapping roots are not deduped; enumeration order/ties are not deterministic. IgnoreInaccessible omits coverage without precise path failures. Broad enumeration catches can absorb cancellation, especially the final file-only directory, permitting a partial snapshot to appear completed. Full file list is unbounded; MaxResults bounds highlights only.
- DuplicatesSlice groups size+extension, includes all members as candidates and has no content comparison or keeper rule. Cart deduplication is path-string based. Tests intentionally check same-size/extension groups and create identical seeded bytes; no equal-size/different-content negative case. TotalBytes includes every member, not duplicate-only savings.
- Review selects the longest lexical matching root or falls back to first root. Apply reruns preflight, checks file existence/protection/destination, rejects folders, and rejects lexical root escape for move/archive. It generates collision suffixes, reports per-item statuses, and offers report-only and Windows recycle. These are actual implementations. Protection does not resolve symlinks/real file identity and macOS comparison is case-sensitive regardless of volume. Preflight does not revalidate size/mtime/hash against scan.
- MainWindowViewModel invalidates preflight on cart/action/destination/protection changes; MainWindow handler requires CanApply and a confirmation dialog explicitly warning that archive deletes originals. Heavy scan/apply runs via Task.Run. This user gate does not make the archive transaction safe.
- Archive writes each entry then deletes its original before ZipArchive disposal, with no archive reopen/content-hash verification. Finalization/crash/disk failure can follow prior deletions. Cancel between items skips final WriteReport; already changed files remain. Per-item failures continue, reports are written only after work, report filenames have1sresolution and can overwrite. Archive name collision fails rather than reuse. ActualReclaimedBytes sums stale source sizes even for same-volume move/recycle and ignores compressed destination storage.
- ReportOnly still writes JSON/Markdown into a selected source root; Planned counts as Success. Apply completed status can include Failed/Skipped items. No rollback or restore manifest with hashes. Window closing saves settings without cancelling/waiting for ongoing work.
- AppSettingsStore saves by copying primary to backup then rewriting primary nonatomically. Recovery reads good backup then calls Save, replacing that backup with corrupt primary before the repair write. Schema detection is case-sensitive despite case-insensitive deserialization; unknown newer schema versions are accepted and normalized tocurrent2. Protection override persists.
- ApplySliceTests cover6basic checks, but archive test only verifies file/ZIP/report presence and original deletion, never extracted bytes, failures or cancellation. Other insights test source does not prove content deduplication. Historical stage14 marker/build PASS is not preservation/device proof. No cleanup/test executed.
Reuse scan/review/cart/preflight/outcome types after preservation hardening. For Arcade archives require content identity, finalized verified copies before source removal, durable per-item journals and explicit partial/cancelled outcomes. Remaining insights, observability, XAML/header and tests are tracked separately.

## Pass66: SmartFileSystem source closure and preflight/logging races
Remaining15 C#/XAML/header/project/test files read at the same pinned NexusBuilder commit. This closes selected SmartFileSystem implementation source, not historical documentation or runtime/device validation.

- MainWindow.axaml wires every named operation to inspected handlers. AddChecked, cart removal/clear, action radio buttons, protection and destination/threshold controls are not uniformly disabled by IsScanning. OnPreflightClicked captures an old cart, while SetPreflightResult stamps the current _cartVersion and CanApply checks only that stamp/action/result counts. A changed cart can therefore display a preflight for different inputs. Apply recomputes preflight, but the human-reviewed set may differ from the executed set. Pin a complete immutable operation snapshot through review/confirmation/execution.
- AppObservability.OperationTimer.Dispose calls Complete even after callers catch cancellation/error, so failed/cancelled operations emit a completed event. No run/correlation ID joins events. Synchronous append under lock is unbounded and exceptions are uncaught; a logging failure before a handler try/finally can leave UI busy state. Distinguish finish from success and keep telemetry failure from controlling operation outcome.
- OldAndLarge filters metadata using current UtcNow separately for summaries/candidates; no injected clock/snapshot decision time or stable tie-break. FileTypes aggregates extension bytes/count. BiggestFoldersSlice is empty, while real ancestor size aggregation is in ScanSlice; UiStrings is empty. These names are not independent capability implementations.
- Native header exactly declares only init/version/free-string, matching Rust stub. Project is .NET9/Avalonia11.3.11 and copies only an existing debug Windows DLL; no native build invocation or macOS/Linux native copying. Probe compatibility is not scanning capability.
- All4 test files now read:13 Fact methods across scan2/cart1/insights4/apply6. They cover basic aggregation/path dedup/candidates/actions; no transaction, restore-byte, cancellation, stale-preflight, symlink, content-collision or settings-backup failure cases. Test source is not an executed result.
- XAML defines colors, cards, opacity reveals and static control layout; it is tooling presentation, not a Three.js/3D game. Claimed reversible moves rely on manually recorded destinations; no restore command was found in complete source.

## Pass67: ConstellationAppBasic spatial viewer and sensor limits

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/14_FinalReleaseGate/ConstellationAppBasic/`. All20 source/style/config/asset files read; package-lock parsed for root and selected dependencies (21receipts). Three0.170.0 + React Three Fiber8.18.0/Drei9.122.0 inside Next14.2.35. No Nexus imports/dependencies and no complete game loop.

- `components/sky-canvas.tsx` implements spherical altitude/azimuth projection, horizon ring, star/edge meshes, selected-target highlighting and optional orbit. Six catalog patterns have one approximate celestial center each; star offsets are illustrative, magnitudes unused. This is a reusable visualization/navigation lead, not accurate stellar simulation.
- `lib/astronomy.ts` derives sidereal time and horizontal coordinates. Rise/set null mixes never-rising and circumpolar conditions; not-observable condition conflicts with the normal nonpolar null criterion. Low altitude always labels setting even when rising. Nearest transit can be past; sidereal offset treated as civil hours. No solar/night/weather/terrain checks. Weighted altitude/declination score displayed as confidence is not calibrated evidence.
- `components/app-state.tsx` supports manual/geolocation and permission-based orientation, but linear heading smoothing mishandles north wrap, listener has no cleanup, permission success need not yield valid/absolute heading. Pitch only informs text, roll unused; external fixed camera and yaw-only scene rotation are not AR alignment.
- Manual/saved locations lack finite/range/schema validation; local datetime starts from UTC ISO substring and empty/invalid dates are unguarded. LocalStorage failures can interrupt initialization. Detail mark-found is transient component state, not progression.
- `server.js` logs requests and errors to unbounded files, defaults plaintext0.0.0.0, and logs fatal events without a defined shutdown/recovery. Browser/device/astronomy correctness remains unexecuted.
- Drive keyword Constellation returned one meeting-note metadata hit without proven linkage; exact ConstellationAppBasic title returned0. No document-content correspondence claimed.

## Pass68: Acronym list matching and deterministic command-loop boundaries

Same pinned NexusBuilder, `NexusBuilder/05_CodeQualityPass/Acronym/`. All66 C#/XAML/project/default-config files and5selected docs read (71receipts). Standalone .NET9/Avalonia11.3.10; not a Nexus or Three.js game.

- `Core/CommandBus.cs` bounds FIFO queue10000; `CommandManager.cs` bounds each synchronous pump50000, driven by App's16ms UI timer. Manager-owned state and correlated follow-up commands are reusable; synchronous I/O and handlers can block/throw through the pump. No durable queue, thread-safe emit, payload schemas or deterministic clock/ID source.
- Boot order in `Composition/CompositionRoot.cs`, `Managers/PersistenceManager.cs` and `Managers/SourcesManager.cs` queues saved settings then default-state persistence. Loaded configs can be restored in memory while queued defaults overwrite disk. Applying source path does not persist it. These are static execution-order findings, not executed recovery tests.
- `Workers/SearchWorker.cs` matches normalized acronym substrings; SearchManager sorts exact/prefix/contains plus ordinal tiebreaks. DomainTags ignored; expansion not searched. Updating snapshots does not rerun current query. SearchSlice accepts any ResultsReady without query guard. The dictionary plan's immediate search-refresh outcome is unimplemented.
- `MergeDedupeWorker.cs` includes SourceId in identity; same pair across sources stays separate. SourceId/count is provenance, not a content/version receipt. Preserve this distinction for future list-driven domain retrieval and Jev evidence classification.
- Import/export is unconnected and workers return zero; Favorites UI is unsubscribed/empty. Add/remove favorites emits persistence only. Several named domain/manager classes are empty; do not count names as independent capabilities.
- Local JSON writes are nontransactional, without schema-version checks, backup or corruption recovery. Dictionary mutation reload/save can throw out of pump. Paths are unconstrained; no sandbox claimed.
- Tests contain4Facts plus one4case normalization theory. Duplicate FIFO and return-type-only registration checks leave persistence/refresh/error paths untested; no tests run. README architecture/test/release docs are template/stale; stage06 historical docs remain a separate lead.
- Drive Acronym keyword returned2metadata hits with unrelated titles, exact title returned0; GrantHarvestDesk query returned0. No matching content inferred.

## Pass69: GrantHarvestDesk discovery pipeline and sample-evidence boundary

Pinned NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, `NexusBuilder/14_FinalReleaseGate/GrantHarvestDesk/`. All22 C#/XAML/Python implementation files read, plus selected config/docs and12historical CSV/JSON representatives;39receipts. This is a .NET9/Avalonia11.3.9/Python data tool, not a Nexus/Three.js game.

- `backend/grant_engine.py`: real JSON fetching, HTML card extraction, canonical-URL dedup, heuristic ranking and CSV/Markdown output. APIs default to sample mode and fall back after missing endpoints, errors or no records. Crawler falls back when unavailable/empty; actual HTML records get invented deadline/amount/eligibility values. Output lacks a per-row live/sample/evidence status.
- `normalize_record` substitutes requested region/eligibility for missing source facts and infers minimum award as40% maximum. Those fields then earn relevance points. Expired/out-of-range rows are flagged rather than excluded; if no score reaches70, top20still become shortlist. `last_verified_at` records processing, not verification.
- Dedup key combines title/sponsor/deadline/canonicalURL; source labels merge, amount range broadens, highest score wins. No per-field source receipt/conflict history. Python `hash(href)`, current dates and generated timestamps defeat replay despite `random.seed(17)`.
- `PythonGrantEngineService.cs`: JSONL bridge concurrently drains stdout/stderr and requests process-tree kill on cancel. Exit0 suffices without a mandatory valid result event or verified artifacts. Malformed events can become logs; UI ApplyRunResult catches errors but caller then announces success. No full-run deadline/runID/terminal-event barrier; queued progress can arrive after terminal state.
- `MainWindowViewModel.cs`: snapshots settings for launch and disables editing during run, but export later reads current editable fields with old results. Old output paths/statistics can survive a failed new run. App-close stops only server, not active process. Temporary credential config creation occurs before cleanup's try/finally; run/output and ZIP names have only second resolution.
- `CrawlerTargetRecommendationService.cs`: concrete weighted catalog (7global,4regional groups,5keyword groups) with ordinal tiebreak, duplicate exclusion and bounded suggestions. Useful for list-first expansion; it is not recursive discovery. UI robots checks are asynchronous and not awaited; unknown/error targets pass, Python has no equivalent gate. Checker is explicitly minimal, not a complete policy engine.
- `ScreenshotServer.cs` / MCP bridge: authenticated loopback status/run/cancel/log/screenshot APIs.202 means dispatch, even when subsequent configuration validation fails; canceled means requested, not confirmed terminal. Confirmation list means ranked opportunities, not human approval. No run identifiers or bounded concurrent HTTP tasks. Screenshots use RenderTargetBitmap, not interaction proof.
- Export creates ZIPreport/CSV/manifest/log, but has no post-disposal integrity check, source hashes or run-config binding. Report shortlist omits fallback rows that CSVincludes. Manifest records target counts rather than promised target list; exported activity is capped400entries despite full-log wording. HTML values escaped; CSVescaping is syntactic only.
- Tree inventory:60historical output files,27unique blobs. Twelve CSV/JSONrepresentatives cover45paths; remaining15Markdownreports not read. Early9rows contain3example grants under3source labels; later3merged rows repeat across5runs with only `last_verified_at` changed. Self-test adds an explicitly synthetic crawler record. These are historical sample artifacts, not real-source correctness evidence.
- Stage14 validation explicitly covers docs/markers with a historical buildPASS addendum. No runtime/test/API call performed in this audit. Drive exact GrantHarvestDesk query returned0; broader Grant Harvest returned4metadata hits. Both meeting-note copies fully read and paragraph-identical, but no project correspondence; excluded from capability evidence.

Reuse the event envelope, weighted list selection and canonicalization after adding explicit sample/live state, source receipts, conflict retention, immutable run configuration and verified terminal outcomes. Do not teach a low-thinking/Jev evaluator that a result event, source label, repeated output or verification-named timestamp establishes capability.

### Starter shells and docs-only game identities (passes70-71)

At NexusBuilder commit862ce82513c9aa1a020e9e2677c1fef32c626231, all44 files in AudioNavigator_Init, BreathingWalls_Init and CascadedShadows_Init were read. Their30 C# files construct modules but leave behavior empty; composers neither connect modules nor start a loop. README claims of wiring are unsupported. Preserve these separately from the previously audited non-Init versions: real audio mixing, pulse gameplay attempts and an incomplete shadow renderer have different ownership and limits.

- CascadedShadows_Init/docs proposes frustum splits, depth/VSM blur, sampling and a voxel stress scene, but supplies no implementations or executable tests. Referenced Rust/DefaultApps paths are not these C# starter files. Performance and production-readiness wording are requirements, not evidence.
- CanopyRelicRaid (stage00,8docs) is predominantly blocked/template filler. VoxelFable has a substantive SEED for inventory/social/magic categories, but its IDEA is a truncated question. VoxelFable_Cortex (8docs) largely stores authoring instructions and unsupported success claims. These are not playable game implementations.
- RustVortex (13docs across stages01/03) describes particle physics but has no source/manifests in those subtrees; graduation markers and empty gates do not establish implementation.
- UniverseSim (22docs across4stages) proposes fixed stepping, CPU/GPU integrators, SoA buffers, grid/octree partitioning and invariant checks. No implementation or benchmark is present in these named trees. Five stage02 documents exactly repeat at stage03. UI/UX end mid-section; targets lack particle counts/hardware. Later issue prose does not prove observed runtime behavior.

Reusable extraction: keep simulation contracts and categorical RPG properties as design leads. Require actual source ownership, nonempty behavior, connected lifecycle and measured checks before promoting them to executable domain catalogs. All97 source/document receipts are pinned; no execution or capability inflation.

### Small native click demos and incomplete distribution bundles (pass72)

NexusBuilder stage01 CounterApp/MoodLantern/QuoteVault use .NET9/Avalonia11.3.10 and shared desktop/Android views. All33 C#/XAML/project files,3 build scripts,3 Android manifests and6 retained runtime/plist configs were read (45receipts). These are UI demos, not Nexus/Three/3D games.

- CounterApp increments an in-memory count. MoodLantern cycles5 fixed mood/color pairs on pointer press, changing a blurred disc and label without animation or persistence. QuoteVault randomly selects7 fixed texts with repeats; history is write-only from the UI.
- QuoteVault displays SAVED before any disk operation, waits500ms then reads mutable current selection, permits concurrent read-modify-write saves and swallows errors. This can save a different selection, lose an entry or falsely signal success. Preserve this as a negative case for immutable action snapshots and evidence-backed feedback.
- Each build-artifacts.sh publishes framework-dependent apps but copies only the apphost to the Windows export/macOS app. Required managed/runtime/native dependencies are omitted from that export. Mood/Quote tracked .app trees contain plist+apphost only; the publish executable and app executable have identical blobs. ZIP/binary contents were not downloaded or executed.
- Android export chooses first matching APK and labels it arm64 without verifying architecture; skipped platform branches can retain old final artifacts. File existence and script completion cannot establish a fresh, portable build.
- Drive exact UniverseSim/VoxelFable/RustVortex document queries returned0; no correspondence established and no absence claim. Title-independent discovery remains open.

### Current actor/agent domains and strict-contract boundaries (pass73)

Engine main a74e8689d1a71c0b42236c009f0f4c46e9b89387 supplies real actor/creature/character/player registries: normalized IDs, idempotent registration, reference checks, guarded removals and ordered snapshot restore. Their binding IDs and capability tags do not implement bodies, movement, physics, input or rendering. Disabled control does not prevent getControlledCharacter resolution; unpossessed control enable and shared possession remain consumer policy. Generic updates, individual reset and snapshot replacement can bypass cross-domain invariants.

Agent contains record helpers, not model routing or action execution. Private agents/proposals/ledger closures survive inherited reset and do not hydrate from base snapshots. Observation ID defaults overwrite one descriptor; execution accepted defaults true without a matched proposal or terminal result. Private arrays mutate before base serialization validation, so failed writes can diverge state. Initial agents and custom API closures are outside the content fingerprint. Its smoke checks construction and one proposal/record only; actor smoke checks ordered registry reset/restore. Neither was run.

Shared domain-kit offers portable state, canonical operation hashes and same-ID conflict detection, but applyCommand assumes synchronous execution and does not reject Promise outcomes before recording a receipt. Manifest metadata defaults to proven from reference strings and generic object schemas; neither validates real behavior or settings values. IdempotencyLedger missing get throws under strict serialization, and reset clears before validating replacement. These are explicit limits for type-safe low-thinking/Jev tool boundaries, not reasons to discard the reusable contracts.

Drive Agent Operating Guide and Across the Canopy Composition Guide were reread at retained revisions. Their single-owner/immutable-provider rules help frame these mismatches; they remain design guidance, not implementation evidence. Catalog140 legacy/migration declarations remain separate from these current semantic-domain sources.

### Third-person controller and presentation ownership (pass74)

Five ThirdPersonFollowThrough files were read at Experiments b05957890f514356d2ce42e2510bbba6f424e3c9. Local Three.js0.165 code implements exponential follow positioning, planar camera-relative movement, root/orbit handoff, horizontal circle/AABB separation and ray-packet rendering. Static joint/cylinder markers are not animated skinning or IK. Ramp/cylinder collisions use rectangular proxies; collision ignores elevation. Reset leaves held input, camera/follow state and engine time intact; no focus pause or lifecycle cleanup.

The domain descriptor is metadata; app.js owns movement/gravity/Three positions. Four engine URLs target paths absent from audited Engine main, including composer and both math utilities. Existing runtime compatibility is not established. Extract camera math, normalized input and debug adapter contracts behind one authoritative state owner; do not promote this base scene to a complete game or assume later readiness descriptions repair it.

## Passes75–76 — Interaction ownership and composition recovery

Pinned source: LuminaryLabs-Dev/NexusEngine at a74e8689d1a71c0b42236c009f0f4c46e9b89387. Full interaction subtree (77files),3related tests and11composition files read; no execution. Detailed path-scoped audit is in repositories.jsonl under interactionCompositionSourceAudit;91receipts verified against the pinned tree.

- **Reusable state machinery:** request patience/deadlines, fulfillment counters, transfer dwell/capacity/type checks, assistance urgency and environmental affordance progress. Input/Interaction root helpers supply descriptors; the host still owns real input sampling and dispatch.
- **Missing causal checks:** fulfillment does not verify arrival; assistance attachment ignores distance; direct affordance activation does not enforce proximity. Transfer idempotency is per operation, not once per subject. These APIs need caller-owned conditions before they become reliable gameplay rules.
- **Cross-domain recovery:** interaction adapters apply child commands before recording their parent operation. Later failures can leave partial effects; transport retry may fail because its previously fulfilled request is no longer open. Preserve this distinction from sequential operation replay.
- **Composition reuse:** registry records, ownership-aware trees, dependency order, prepared-plan hashes and host rollback form useful deterministic tooling. Six recipes specify kit sets, not playable relationships. Flat and tree planners differ in status/config validation; provider choice is deterministic but not an exhaustive compatible-provider search.
- **Apply trust boundary:** executable identity and rollback completeness are supplied by the host. There is no in-flight apply lock; sequential receipt replay does not establish concurrent exactly-once application or crash recovery. Flat config JSON conversion and open MCP output schemas are not type-safe semantic validation. Failed tree validation currently loses its detailed errors in the MCP wrapper.
- **Tests inspected, not run:** interaction checks cover selected state cases and happy-path adapters. MCP smoke covers two object factories, authorization, sequential replay, one rollback and missing-package receipts. Neither establishes a complete game.
- **Drive correspondence:** Project Definition still says20domains versus21in the audited catalog; Guide Index/Handoff refer to older8a60167f/bacc8fc snapshots. Their release/parity claims stay historical. Point-and-Click V0 Master Architecture explicitly distinguishes existing product story behavior from proposed six-scene AST, finite sequences, input parity, audio and full save/restore. GAME-051 is a documented historical targeting blocker, not a newly reproduced defect.
- **Extraction priority:** retain these interaction state machines and plan/apply interfaces; require explicit spatial preconditions, cross-owner recovery, strict supported schemas and real host evidence before advertising automated composition reliability. Source suggestions only; no implementation authorized.

Broad Drive search advanced to page2 (96unique metadata results across2pages); next cursor saved. Relevant new Canopy design pointers retained; unrelated professional materials are not capability evidence. Remaining repository branches, transitive game dependencies, truncated trees and Drive folders keep the overall audit open.

## Pass77 — BirdRun and Mana Rift: behavior versus readiness labels

Twelve full source/test files at Experiments b05957890f514356d2ce42e2510bbba6f424e3c9 are recorded. Detailed audit: collections.jsonl → nestedAudits.birdRunAndManaRift.

- BirdRun is Canvas2D with local domain functions; its imported NexusEngine namespace is unused. The generated rescue window is unreachable: i ≥ floor(distance/86)+1 and beacon.x=86i+32 keep every beacon beyond32units, while rescue requires ≤14. Death resets automatically next frame. Both smoke definitions miss these causal checks.
- Mana Rift uses a shared Three.js composer with13legacy ProtoKit imports and local world/runtime shims. Its spire/evacuation overlay calculates readiness from wall-clock defaults rather than player gameplay state. Screen-space rings and descriptor counts do not establish a new mechanic.
- Reusable leads remain motion/course descriptors, explicit service APIs, zone/contact queries and presentation handoffs. Extraction must preserve state authority and test reachable player consequences. Exact0.0.2 ProtoKit correspondence is still pending.
- Added remaining-audit.md:18stable work items with expandable33metadata-only roots,10historical roots lacking recursive-tree records, unrecorded current Engine path counts and94unread Drive references. It covers known remaining scope and explicitly grows with discovery; completed findings remain in existing evidence indexes.
- No games, tests, models or source code executed or changed.

## Pass78 — Legacy ProtoKit closure and design-source distinctions

The shared Mana Rift composer references13ProtoKit files at0.0.2. Canonical NexusEngine-ProtoKits resolves that ref to a4d6a59f10df0c9967eeb72bf1552ce78e4972f6 (untruncated926-entry tree863da61e3b362525c122997e11c5cbabffec36a5). All13implementations plus2tests and their mock harness were read. None of the13imports more code; CDN delivery was not tested.

- Useful operations exist: planar chase, health/guard/parry/mana, timed status expiry, placement overlap, route clearance, height sampling, circular zones and action-name validation. Each needs explicit caller wiring; metadata composes/extendsBase does not perform installation.
- Recovery/causal gaps include repeated defeat events, zero-health revival, negative guard stamina, state-length-derived status ID collisions, unchecked action proximity and unbounded histories/events. These are source-level findings, not executed reproductions.
- Test environment names are labels over one mock world. Its readEvents retains requests while the browser shim drains them, so repeated-tick behavior differs. Neither test covers a connected combat loop, real browser, restart/reset or current Engine integration.
- Drive World Generation Rules is a valuable design lead for volumetric ecological/structural emergence and geography-derived routes/settlements; an octree is explicitly optional. The0.0.4 Release Brief is for NexusSimulator and is a proposal. Version Planning Setup Validation proves Drive organization only. NexusCentral's April architecture/offline claims remain historical and source-unverified.
- Search advanced to Drive page3,136unique metadata IDs across3pages; page4cursor saved. Added NexusVoice and GoldRush gameplay/production leads. Updated remaining-audit.md: Mana Rift dependency search closed; broader experiment, kit-library and runtime evidence limits remain open.

## Pass79 — Branch discovery and corrected search backlog

The33metadata-only repository rows were already source-free default-root screens, not33undiscovered source trees. Fresh recursive default trees and complete current branch lists confirm31repositories contain only root documentation/license/ignore files across their listed branches.25default READMEs were read, including CRM's documentation-only relationship workflow and the empty runner README. ATallTale and ObviousPlace repeat a VerticalAscent heading without game source.

Two alternate main branches matter:
- **NexusSkyServer main705a5e5a433fa2ec20b30f6efa6fbf54979c3a45:** all28files in its untruncated34-entry tree were read. It implements FastAPI/llama.cpp inference, deterministic Chain/Sequence/Switch/Loop workflows, bounded call scheduling, ephemeral sessions and SSE stage/output events. It is not a NexusEngine game builder.
- **MedicalResearch maina915c094d6cbd47680fda7f4f98035bc3cbd5c62:** full112-entry tree is unrelated research documentation/data. Three orientation/manifest files distinguish generated hypotheses from evidence. Reported local export counts do not establish inspected harness source.

SkyServer reuse limits:
- JSON instructions plus json.loads are not schema validation; arbitrary valid JSON passes and malformed output is wrapped successfully. Empty/truncated outputs lack rejection gates.
- Workflow output/call budgets are enforced, but total prompt token fit and a whole-workflow wall-clock deadline are absent. Queue bookkeeping can leak if the queued-event emitter fails before its cleanup try; this is a source finding, not an executed reproduction.
- Sessions are in-memory caches. Same-session requests are not transactionally serialized; expiry/deletion during inference can invalidate the final append. Structured/refine stages omit session context.
- The nine API tests use a FakeBackend. They do not prove live model identity/capability, cancellation recovery, strict JSON output, game building or browser playability. Deployment/container/model-version claims remain unverified.
- README attributes architecture to NexusAgent/LiquidPro-Harness; exact source correspondence remains an A07lead.

A01's overstated33root backlog is closed;17of18stable master items remain. Added56read receipts across54new primary paths and2alternate README versions. No source, models, games, tests or deployments were executed or changed.

## Pass80 — LiquidPro correspondence and production-authority documents

22LiquidPro-Harness files at NexusAgent1458aead98aab5714a72f89e41deb62d91a593e3 were read: core packet/chain execution, model transport/queue, gates/output, prompts/profiles, two workflow definitions and ticker design. SkyServer shares the chain/workflow/scheduler pattern but is a separate Python implementation. LiquidPro's smart workflow first asks a model for its route; SkyServer's router is deterministic keyword/length code.

- The four-line Role/Input/Output/Rule prompt and explicit slot injection are compact reusable interfaces. Successful text calls are accepted without semantic checks, including empty or truncated output; packet mode adds shallow shape checks but not executable behavior validation.
- Endpoint health proves HTTP reachability only. Model identity/context are not checked; finish_reason is ignored. Queue defaults are configurable, so README's unconditional single-call rule is not enforced for every configuration.
- A started-event emitter error occurs before queue cleanup protection and can strand work; OutputService formatters/streams can throw. Records written at completion are not a durable checkpoint journal. These are source deductions, not executed reproductions.
- The NexusRealtime ticker, reset/snapshot kit, circuit breaker and dead-letter queue are a proposal. Both planned implementation paths are absent from the complete pinned LiquidPro tree. Full workflow/long-output/orchestrator/UI/benchmark layers remain explicit followups.
- GoldRush's four master documents define game-owned mining/carried-value/extraction/match behavior, Web-first Three.js presentation, source salvage from two Unity roots and a conditional future Unity provider/build target. They supply design/ownership requirements, not production or parity proof.
- Newly identified generic Handoff documents concern AcrossTheCanopy, NexusSimulator and Agora. Canopy's Phase1plan requires finite operation-driven Sequence, stable IDs, six scenes, save/restore, input parity, cancellation and teardown evidence; runtime and current build were explicitly not revalidated. NexusSimulator0.0.4remains proposed. Agora records historical debug packaging with native Flatpak/OpenXR/Vulkan/device proof excluded.
- Drive broad search advanced through page4; page5cursor retained. Seven additional game/source/production metadata leads retained; unrelated professional search hits are excluded. Eight native documents read in full, with revisions retained.

No sources, games, model runtimes, tests, deployments or remote documents were changed or executed.

## Pass81 — Workflow execution, failure propagation and list expansion

Completed all27LiquidPro chain/workflow files across passes80–81at NexusAgent1458aead98aab5714a72f89e41deb62d91a593e3. This pass read22files, including the complete workflow-runner. Eighty path references in22JSON definitions resolve; the ten shipped workflow graphs are acyclic. These are source/catalog checks, not executions.

- **Failure propagation:** executeLoopNode returns reply quality rather than requiring bodyResult.ok. In the shipped reply workflow, failed refresh-intent can follow a good reply-pass and still yield an accepted loop. Flat workflows continue after failed initial intent extraction.
- **Expansion bounds:** the shipped smart route can request up to28model calls, long reply20, ordinary reply9, large-output preparation7and story12. Limits follow the current lists; the runner has no global recursion/call/deadline guard for future definitions.
- **Memory:** named child slots merge wholesale into the parent; optional failure can still export failed output. Missing slots become empty strings. Switch conditions are first-match OR conditions over normalized text, not exact typed compatibility.
- **Evidence:** repeated labels overwrite per-label parent files across loop iterations. Separate child runs and final aggregates can retain details, but there is no mid-run journal/resume cursor; interruption may prevent the full final ledger.
- **Validation:** reply gates check length, punctuation, substrings and echo. They do not prove meaning, required facts, adapter support or gameplay. Dry runs synthesize one successful step per chain, including chains with three actual model steps.
- **Template specificity:** the ten-page story fixes a goblin/theft/guilt arc. Its generated page plan is unused, writers do not consume prior pages, and join accepts any nonempty subset. Word counts and continuity are prompt requests rather than enforced acceptance.
- **Reusable boundary:** preserve the compact node/slot/trace structure, but add failure-aware acceptance, shared execution bounds, owned memory exports and iteration-specific evidence when adapting it. This audit changes no implementation.

The active checklist now advances to37remaining LiquidPro files, especially long-output/tracker/benchmark recovery. Other engine/game/Drive scopes remain open.

## Pass82 — Long-output repair, detail tracking and historical evidence

Five pinned LiquidPro files read in full at NexusAgent1458aead98aab5714a72f89e41deb62d91a593e3; three native Drive documents read with revisions. No source or runtime changes.

- **Fixed repair content:** both length services can insert benchmark goblin/stolen-gold/return prose. A general request can receive unrelated deterministic story content; packet writers are universally fiction-shaped.
- **Weak completion:** final acceptance requires nonempty text and fallback section/chunk ratio<=0.5. Requested final length, semantic intent, every child-call success and complete requirement coverage are not mandatory gates.
- **Misleading authorship accounting:** model_fact_mixed includes deterministic prose but counts as model; final padding/closure and thinker packet fallbacks fall outside fallback ratios. A high model-section ratio does not establish model-generated words.
- **Continuity and detail limits:** length-service memory is a constant instruction; its summarizer is never called. Packet service uses short output tails and round-robin detail allocation. The tracker uses positional IDs, regex priority, first40details per section and top14/16injection. Its reuse/drop/realign fields describe rules but do not execute them.
- **Historical results:** the extra-long report claims48fallback failures,2bad-recipient cases and20exact-output duplicates in100runs; rescore50pass/50fail. Packet report claims25accepted outputs with only8unique. These reports expose their own acceptance limits; raw batch artifacts are absent from the complete pinned LiquidPro tree, so metrics remain unverified historical claims.
- **Proposals versus code:** lists of50microharnesses and10idempotent patterns are suggestions, not50implemented harnesses.
- **Reusable parts:** compact selected-detail and unit/packet staging are useful leads. Adoption requires explicit required-detail coverage, honest model/deterministic provenance, failure propagation and final semantic/length checks.
- **Drive authority:** Nexus Engine's public handoff verifies only folder organization and explicitly leaves repository/release unassessed. Nexus Simulator's internal handoff records unresolved governance/access. Studio Architecture describes an older Unity/Quest donor-project and author/bake/instance strategy; it is not proof of current Three.js domains or device performance.
- **Discovery:** page5metadata inspected;15new technical/game or ambiguous state leads retained. Page6cursor saved. The unread count grows from101to116because discovery found new work; no previously read document was reset.

Next:32remaining LiquidPro command/benchmark/orchestrator/Web files, an unread canonical Experiment and Drive continuation. All17master areas remain open.

## Pass83 — Batch acceptance and restart boundaries

Eleven LiquidPro command/registry/benchmark/orchestrator/report files read in full at NexusAgent1458aead98aab5714a72f89e41deb62d91a593e3.21LiquidPro files remain.

- Older sequential benchmark counts record.ok even when its independent review lists failures. The newer orchestrator includes review failures in run.ok, adds target length and normalized exact duplicate checks, and can re-score existing output.
- Existing-batch review counts present folders without reconciling config.runs. An empty runs directory can be accepted; partial batches need separate count gates. Missing or unreadable source-metric artifacts yield zero totals and silently skip fallback accounting.
- Re-score overwrites review/summary files rather than preserving rubric revisions. Completion audit trusts stored latest-command reviews and artifact presence; no output/result hashes, actual per-run success, live/dry exclusion, input/profile/source identity or fresh rescore is required.
- Machine completion counts50numbered proposals and10selected descriptions; those are not implemented components. Endpoint health is displayed but excluded from required completion checks, despite the plan saying it is required.
- Restart means new smoke and final batches, not resume. Readiness is optional; normal execution does not call it. Smoke promotion compares command/min-runs, not input/model/source identity.
- Cumulative and packet command pairs are aliases of the same runner. liquid_model_loaded emits profile text before any model load verification; ingest memory reaches the workflow branch only.
- Batch worker setup before try and process-global model concurrency need cleanup/ownership scrutiny. Per-call bounds do not create whole-batch deadlines.
- Historical reports explicitly leave improved live smoke/final100restart incomplete. Their raw artifact directory remains absent from the pinned source tree.

Reusable leads: compact batch manifests, independent review, duplication checks and smoke promotion, with mandatory expected-run/provenance checks and immutable review evidence before Arcade adoption.

## Pass84 — Next Ledge Grapple composition and extraction

Read all four files in Experiments games/next-ledge-grapple/, its static smoke, two ProtoKit implementations/README/tests and mini-runtime helper. Experiments pinb05957890f514356d2ce42e2510bbba6f424e3c9; ProtoKits pin0d102649267737230d618b30fe6f9465b198d234.

- The host creates Nexus runtime with ActionInput then Grapple kits. Semantic axis/aim/action events feed the game kit; snapshots drive Three.js meshes, ropes, lighting and HUD. Physics operates in XY: classify as2.5D gameplay with3D presentation.
- Shared grapple source owns seeded vertical routes, swing/release, probe/cable catch, reel, rest stamina, bounds/fall failure, summit success, restart and sector progression. These are implemented rules, but full-loop correctness remains unexecuted.
- Host seed is fixed; restart repeats its route. Debug N advances without requiring a win. Mutable@main legacy CDN imports do not bind this source audit to deployed dependency bytes; local fallback directories are absent from the recorded Experiments tree.
- ActionInput has a multi-key/source defect: releasing one binding clears the action even if another bound key remains held. Grouped raw-event processing can change chronology; clear does not emit per-action release edges. Literal-space binding trims away, although this host maps Space explicitly.
- Kit restart regenerates a default level instead of preserving a supplied custom route. Private clock, fixed resource/API names, weak numeric validation and exposed resource/snapshot references limit safe generic composition.
- Tests use a miniature runtime separately for each kit. Its surface publication occurs after all systems, then event queues are cleared: forwarded gameplay events from host subscriptions do not survive to the next tick in that helper. Combined host/actual Engine scheduling remains unverified.
- Grapple tests omit latch/reel/rest/win/defeat and route solvability; host smoke only searches strings. No tests or browser were run.
- Host needs lifecycle/resource scrutiny: blur clears input without pausing, no visibility/touchcancel/teardown path, group clearing without geometry/material disposal, frame-dependent easing and fixed150reach display.

Extraction candidates: action-intent state, seeded vertical routing, swing/projectile/cable/reel, stamina/rest and sector progression. Keep them as source-backed leads until actual Engine scheduling and complete gameplay are verified. The larger experiments/next-ledge session is a separate remaining scope.


## Pass85 — Current Engine public API and event scheduling

Pin: `a74e8689d1a71c0b42236c009f0f4c46e9b89387`;14full file reads, recorded in sources.jsonl. Source inspection only.

- Public root and all wildcard-export files do not export createRealtimeGame, createRenderDescriptorKit, createObjectiveFlowKit or createRenderer. Next Ledge host/session require the first three at mutable Engine @main. This is a source-pin compatibility mismatch, not a live CDN observation.
- Scheduler runs input/simulate/resolve/cleanup in insertion order, drains journal and clears queued events before Engine delivers captured surface batches. Subscriber-emitted events therefore survive for the next tick, unlike the mini test helper which clears them after callbacks. Direct system-to-system events can be consumed later in the same tick.
- Captured journal batches exclude subscriber mutations until next tick. Event/resource payloads and surface snapshots expose references; shallow freezing is not state immutability. Query surfaces report membership changes rather than every value mutation.
- Clock advances before systems; system failure leaves partial state/queued events without rollback. Subscriber failure follows queue clearing and can leave partial delivery/state while lastTickCommit is not updated. Commit metadata is not transactional recovery.
- Built-in movement/damage helpers mutate component objects in place without setComponent, so component dirty journal entries can omit changed values.
- Runtime kit validation checks shapes/tokens but does not require executable reset/snapshot contracts. Requires checking is special to domain-service kits. Declared fingerprints can permit equivalent IDs without computing source identity. Install records bindings before later setup; failure lacks rollback.
- Realtime facade exposes engine.step only when present and host-explicit reset policy. asyncReady metadata does not create an asynchronous scheduler. Renderer is not driven by Engine.tick.
- Tick contract test covers clamping/reentry/frozen context/dirty commit/no renderer. Sequence bridge test uses a compatibility helper. Neither proves combined ActionInput/Grapple browser integration.

This closes the prior current-Engine event-forwarding question, not live CDN compatibility or a combined browser test. Keep phase ordering, semantic events and per-tick receipts; explicitly specify next-tick bridge latency, mutation ownership, kit rollback and public package identity before reuse.

## Pass86 — Larger Next Ledge session and GoldRush authority

Experiments pin: `b05957890f514356d2ce42e2510bbba6f424e3c9`;5full file reads. Active wrapper dependencies remain open.

- Main starts session-cargo-extraction-upgrade.js; base session alone is not the full active game. Session imports four ProtoKit modules at 04d34f049f58ae359cf71d43466c429dac2a6d08 and mutable Engine @main.
- Actual swing/probe/cable/reel/rest/route-choice physics and progression are local closure state. Kit settings feed those calculations; objective/route/render facades mirror state rather than owning all gameplay.
- Authored safe-recovery versus pressure-shortcut branches have commitment, consequence, confirmation, payoff, convergence and rejoin states. They alter enabled anchors, assistance, failure floor, vent pressure, recovery and momentum, providing causal design candidates beyond cosmetic variety.
- Some branch score formulas derive from configured multipliers rather than measured player performance. Cargo wrapper must be traced before concluding what cargo risks are actually enforced.
- Swing acceleration/damping/angle and probe/cue frame counters are per-update while other motion uses delta. Initial zero-delta update still changes some state. Camera/rotation/trails continue deriving outside active play.
- Input is applied before paused guard, allowing action/release while paused; sector-transition step lacks paused guard. Normal next-sector input checks completion; exposed advanceSector bypasses that guard.
- Raw input correctly ORs multiple held keys, but key repeats can queue repeated action/pause. Blur clears held state without clearing queued actions or visibly pausing. No full input/RAF/scene teardown is established.
- Session steps local state before engine.tick and synchronizes objectives/route progress afterward. Engine snapshots cannot independently restore local closure state. Optional facade calls can silently skip missing services.
- Unselected route anchors can be recorded completed as route-choice-skipped with allowOutOfOrder; completion ledger is not literal traversal. Recent events are bounded to16 and forwarded by object identity, not a durable causal journal.
- RAF loop clamps delta to1/30 and can stop scheduling, but does not cancel outstanding frames or dispose resources.

GoldRush ReferenceMaster and DecisionMaster were read at recorded revisions. TaskTracker's five complete tab grids contain ten tasks (five Ready, five Backlog, none Done); empty tails confirmed. The tracker explicitly calls DEC-007 outdated and requests a later superseding decision. Preserve this conflict pending current authority reconciliation. Tracker plans for validation/integration and Blender-to-runtime proof do not establish completed systems. No remote files changed.


## Pass87 — Next Ledge pinned kits and executable ownership

ProtoKits pin `04d34f049f58ae359cf71d43466c429dac2a6d08`:1,735tree entries, not truncated; seven implementation files and two tests read. Experiments pin `b05957890f514356d2ce42e2510bbba6f424e3c9`: five adapters/wrappers read. Fourteen blob identities verified; no execution.

Implemented source:

- Anchor registry normalizes descriptors, groups and IDs, handles queued replace/upsert/remove/clear and exposes reset/versioned snapshot load.
- Projected-route generator implements seeded linear/Bezier sampling, jitter, analytic plane/heightfield projection, minimum-spacing rejection and distance-limited adjacent edges.
- Route-progress ledger offers ordered checkpoints, enter/complete/reset, events and render-independent descriptors.
- Resource meter executes registry, clamped mutation, passive rates, lock handling, thresholds, bounded change history and versioned snapshots.
- Pressure loop executes bounded values, passive rise/fall and threshold status. Cargo composite coordinates route/resource/pressure snapshots.
- Authored Next Ledge branch data changes launch/release assistance, swing thresholds, recovery and feedback; local adapter compiles that data into session-consumed metadata.

Limits and contradictions:

- Eight tether traversal factories are configuration resources with get/configure/reset and no systems; provides tokens describe tuning availability, not implemented swing/cable/vitals/camera behavior.
- Projected route validation has no terrain raycast, obstacle rejection or reachability solver; every built-in projection returns valid. Rejected endpoints are not restored, missing distance edges are silently omitted, and sample count is unbounded. Its test asserts some edges, not a connected route.
- Anchor array permits duplicate IDs while by-ID map keeps only last entry; getters return live objects. Updates group events by operation type rather than original chronology. Upsert normalizes omitted fields to defaults instead of patch-preserving them; replacement does not reuse configured normalization defaults.
- Route-progress required flags are descriptive only. allowOutOfOrder completion increments activeIndex rather than selecting next incomplete checkpoint. Example A/B/C: completeC out-of-order thenB points at already-completedC; duplicate completion returns without advancement, leavingA unfinished. No duplicate checkpoint-ID rejection; descriptor overrides can replace status fields.
- Resource spend clamps insufficient balance to min rather than rejecting an unaffordable transaction. Locked mutation returns unchanged resource after emitting rejection; cargo composite treats that truthy resource as accepted. Composite amount events report requested amount, not actual resource delta.
- Direct pressure adjust/recover update state without calling emitTransition, so threshold events only occur for passive changes. Failed pressure is recoverable, not terminal. Composite completion depends on route/pressure status, not delivered cargo; repeated completed-route calls can emit Completed again.
- Cargo composite manually invokes child init/install and flattens child systems; child package identities/provides are not installed as independent kits. Fixed API/event names hinder multiple independent instances. DSK install wrapper does create resource API; do not mistake manual install for absent createApi.
- Next Ledge cargo runtime ticks only at dt0 and uses event-driven pressure; configured passive rates would not advance. Cargo status and delivery result never gate base session progression/win/fail in the inspected wrapper.
- Snapshot getters have effects: visual wrapper configures/ticks a second engine twice and cargo snapshot processes events/ticks a third engine. Read count changes auxiliary frame/journal state; these are not pure snapshots.
- Cargo bridge deduplicates by at/type/target-or-reason-or-sector, ignoring amount and vent stage, with128-to64 eviction. It does not provide durable exactly-once receipts. Repeated visits can award cargo again; no per-cache depletion ledger.
- Local cargo fractal tree is static documentation plus six descriptor/config factories, not recursive random generation. It names a pressure-recovery-anchor-kit that is not instantiated in this module. Cache availability reflects total capacity, not individual pickup state; configurable IDs are inconsistent with wrapper hardcoded IDs.
- Climb adapter replaces/inserts authored beats after projected-route validation and keeps original sourceRoute graph unchanged. No final reachability, duplicate-ID, overlap or branch-reference check. Short anchor lists can clamp multiple beats onto same slots; original and executable route differ.
- Preset variation uses seeded base anchors/sector parity but fixed opening/fork/payoff/crest templates. Complexity of metadata is not independent family diversity.
- Anchor test uses package import and normal registry/snapshot cases; projected-route test uses a miniature local runtime and determinism/count/nonempty-edge checks. Neither establishes browser playability, cargo gating, out-of-order recovery or full-loop reachability.

Reuse priorities:

- Promote seeded geometry only with final adapted-route reachability checks.
- Separate tuning catalogs from executable traversal systems in capability map.
- Reuse resource/pressure primitives with explicit transaction receipts and consistent direct/passive threshold events.
- Extract route-choice consequence structure from game session only after loop integration is verified.
- Require pure snapshots and a single causal owner before adopting stacked auxiliary engines.


## Pass88 — Next Ledge presentation consumers and legacy visual kits

Experiments pin `b05957890f514356d2ce42e2510bbba6f424e3c9`; eight presentation modules. ProtoKits resolved0.0.2 pin `a4d6a59f10df0c9967eeb72bf1552ce78e4972f6`; two implementations, shared core and two tests. Thirteen full reads with tree/blob matches. No browser, tests, model or game executed.

Actual implementation:

- Three.js0.160.0 renderer builds lit cliff/girder/anchor meshes, branch lines, aim particles, counterwind, summit celebration and branch-aware camera framing from session state.
- Dynamic line buffers grow only when required capacity increases. Route/parallax rebuild disposes old geometry and owned materials. Renderer exposes draw/geometry/triangle counts for later measurement.
- Cargo/traversal/timing descriptors feed fixed particle layers; selected risk/cargo values affect player light, halos and emissive strength.
- HUD shows state-driven action prompts, stamina/cargo/pressure, branch consequences and sector transition. WebAudio synthesizes event-driven pitch envelopes and motif sequences.
- Parallax kit computes depth offsets, bindings and repeat-tile descriptors. Render-style kit resolves profiles, designations, inheritance and per-target style values.
- Visual-fractal module generates seeded strata/crack/aura/braid/cloud/fall descriptors; readability modules derive forecasts, target hints and risk markers.

Limits:

- VisualFractal descriptors are never read by renderer, effects or HUD in the complete inspected presentation chain. Kit-tree strings enumerate more named subkits than instantiated factories; no recursive domain roller is implemented by those trees.
- Cargo/traversal/timing descriptors are filtered by kind and reduced to center points with fixed orbiting-particle shapes/opacity. active/reachable/confidence/clearance/style/radius and polyline shape are mostly ignored; inactive guidance can still draw. A forecast becomes particles around one sampled point, not its path.
- Anchor confidence and line-of-sight use enabled OR distance, not permitted-target AND visibility/reachability. No obstacle/cable sweep. Release/energy/confidence are heuristics, not calibrated predictions. Recovery suggestions and nextLedges can include unselected branches.
- Fail-floor visual uses maxHeight/anchor/camera target minus distance, while session failure uses its own safe-anchor and recovery bonuses. The hint can disagree with the actual fail threshold.
- Renderer uses resolved renderStyles only as a truthy visibility condition. It hardcodes fog/materials/light and layer-name geometry rather than applying resolvedVisual. Parallax offsets are rescaled0.42/0.35; tiles, object transforms, per-layer alpha/fog/occlusion are not consumed.
- Parallax initialState stores default depthPlanes/layers, which then override active-profile-specific lists. Profile extends is not resolved; summit extends vertical-climb but merges against global default. Time-based scroll remains zero in visual wrapper's dt0 ticks.
- Parallax descriptor budget is applied per layer, not global; y repeat produces only one ty0 tile. Unknown-layer objects disappear before validation, so they may not raise warning. No viewport culling despite metadata. Reset leaves descriptor/debug state stale until tick.
- Render-style child normalization injects default values before inheritance, potentially overwriting parent's custom properties. Explicit target style priority1000 can override lower-priority mode/region styles. Unknown explicit styles/cycles are not rejected by validation; cycle marker is merely data. Numeric layer fog is overwritten by merged fog object.
- Both style paths duplicate target descriptors from explicit objects and parallax drawOrder without stable-ID deduplication. Quality report counts descriptors/targets, not rendered uniqueness or visual fidelity.
- Renderer route cache key includes only levelId/sector/ledge count; same-count geometry edits do not rebuild. Several parallax children lack stored base positions, causing accumulated drift. Reach ring remains150 independent of configured cable length.
- Renderer combines wall-clock animation, frame-count cues, per-draw increments and effect delta; paused snapshots still animate. Spark positions use Math.random. Same seed is not exact visual replay.
- Renderer exposes no dispose/unsubscribe. Effect dispose omits background layers, shared spark geometry and active spark materials; renderer never calls it. Per-spark meshes/materials have no overall budget/pool. Metrics are available but no measured performance evidence.
- HUD states cargo unlocked/delivered from base routeChoice/completed, not validated delivery receipt. Some branch copy hardcodes46pressure/rightward/anchor numbers despite configurable direction/values. Height is labeledm without unit contract.
- Synth handles wall-bounce while session emits wall-bounced. AudioContext may initialize before gesture; errors/resume promises unhandled. No mute/master gain, voice cap, teardown, timeout cancellation or restart reset. Effects/audio dedupe keys omit run identity and vent stage, so replayed same-frame events can suppress or merge cues.
- Two visual-kit tests check pure snapshot offsets/tiles and one style application only. They do not cover installed profile overrides, renderer consumption, inheritance conflicts, reset, disposal, real input or perceived quality.

Reuse priorities:

- Implement a small typed descriptor-to-renderer mapping that preserves geometry, state and intent; do not treat descriptor counts as visual acceptance.
- Use authoritative session reachability/failure data for guidance rather than parallel heuristic rules.
- Separate authored branch presentation from generic camera/framing and reusable event effects.
- Define one animation clock plus reset/disposal and bounded effects/audio budgets.
- Keep source claims distinct from actual visual/device proof.

## Pass89 — LiquidPro entrypoints and Canopy specification depth

Pinned NexusAgent commit1458aead98aab5714a72f89e41deb62d91a593e3.21remaining tracked files scoped; source receipts now cover81/81LiquidPro files. This closes that file set, not external imports or live behavior.

- Web page POSTs /api/runs, but no runs route, pages API, rewrite or custom server is present under this app in the complete pinned tree. Only /api/harnesses GET exists; checked-in web execution path is incomplete.
- UI sends only current input/options, not displayed message history. Conversation display does not supply conversational memory unless explicitly ingested.
- No browser request timeout, AbortController, streaming, reload recovery or durable job ID. Retry resubmits the same payload as a new request, without an idempotency key.
- UI catches failed result by replacing it with generic error metadata, losing any returned partial text/artifact evidence. tracePath/profile are stored on success but not displayed in details.
- Registry resolves root from process.cwd() parent, requiring web cwd. Absolute or parent-relative paths are allowed; this is trusted local configuration, not confined artifact access.
- Number field min/max are UI attributes; button-click dispatch has no form validation or integer/finite checks. Universal benchmark receives no runner-specific runs control from fieldsForCommand.
- CLI awaits runActive serially; no per-command catch, cancellation or restart checkpoint. /pages can become NaN. Explicit health checking is not performed automatically before each run.
- CLI plan describes LFM-only scope and old gates; static profile model names/endpoints do not establish live availability, loaded identity or capability.
- Chat styling, CSS breakpoints and SVG icon are source-read only; no rendered accessibility/usability proof.

Drive page6: seven Across the Canopy specifications cover physical inventory, routes, contextual verbs, item economy, NPC/social behavior, environmental simulation and narrative pressure. They contain named SPEC indexes and brief intent descriptions, followed by unpopulated ownership/state/edge-case/validation templates. No source commit, populated implementation mapping or measured acceptance is provided. Travel/narrative forbid conventional visible ground; economy references World Bible CULT-001 for intact storage cones. Keep those game rules separate from generic Engine capability claims.

Sources: sources.jsonl pass89 receipts; drive.jsonl exact document IDs and revision IDs; coverage.json retained page7 cursor. No app, models or tests executed.

## Pass90 — Cavalry campaign rules versus descriptor overlays

Pinned Experiments b05957890f514356d2ce42e2510bbba6f424e3c9.14files read; detailed ownership/limitations at repositories.jsonl:cavalryCampaignSourceAudit, exact paths/hashes in sources.jsonl.

- Campaign map drawCells line133 shadows function cell(id) with for(const cell ...), then calls cell(campaign.from). With a selected source this invokes an object and throws. frame schedules the next frame only after draw, so this path stops that loop absent external replacement. Static defect, not reproduced in browser.
- Map checkEnd line154 declares complete when all territories have any owner, not player victory. No player-elimination loss check; concede blocked above3territories. Keep this campaign rule separate from README's tactical annihilation/AP claims.
- Neutral owner normalization means march outcomeHint treats neutral as combat rather than reinforcement/occupation. March legal permits any friendly selected destination, whereas map moveDraft requires adjacency. Equal attack/defense is costly-advance in forecast but stops attacker in resolve.
- Logistics supply/forage/road/siege/winter values are heuristics from neighbors, troop counts, coordinates and turn modulo. Neither these kits nor the two consumers implement ration stocks, forage collection, road throughput, siege state or winter losses. No feedback from these descriptors reaches the inspected map rules.
- The two consumers import NexusEngine main but only expose its namespace on a global; no Engine APIs are called. Their actual behavior is local pure descriptor code plus Canvas2D DOM rendering, not proof of an Engine-managed simulation or Three.js component.
- Six direct smoke bodies assert nonempty/serializable descriptors, string markers and bucket counts. CDN-labeled checks do not request CDN or open browser; input cases are plain objects. No deterministic equality, invalid topology, legal moves, mutation conservation, selected-frame rendering, actual consequences, reset or lifecycle proof. Imported hospital/convoy/diplomatic suites are separate pending scopes.

Reuse: explicit campaign state/action reducer, seeded territory graph, authoritative legality/outcome indicators, and a shared overlay lifecycle.17descriptor buckets are presentation/heuristic surfaces, not17implemented gameplay systems. Tactical combat remains a separate unfinished audit; no runtime execution.

## Pass91 — Cavalry tactical controller conflicts and rendering ownership

Pinned Experiments b05957890f514356d2ce42e2510bbba6f424e3c9;5complete files. Detailed scoped evidence: repositories.jsonl:cavalryTacticalHostSourceAudit; exact pins in sources.jsonl.

- Both controllers install window keydown handlers and independent frame loops. Later host method replacement leaves older gameplay canvas/input running; digits1-7 call both local maneuver functions. Earlier input remains active in battlefield mode without side/gameOver guards, allowing state changes outside later turn rules when its canvas receives input.
- Base R key invokes GameHost.restart while later R key rolls AP; neither handler stops the other. Base restart resets world selection/route only, not tactical controllers, cached units, state time, held input or pending asynchronous enemy turns. Older controller resets only on region ID change; later has no restart/reset method.
- Later passTurn sets AP to0 despite README carryover promise. Later lineBrigade eligibility includes all live Rome units rather than locked connectedGroupIds from older code. Later light attack range3 conflicts with README range2; nonlight range1 prevents advertised range2nonlight attacks. Dice expire after1.5slanding+3shold+0.9sfade rather than README one minute.
- Later gameOver is assigned only by concede; there is no automatic army-elimination scan in its full source or older gameplay controller. Attack/no-move actions may remain active with zero candidates; UI disables Pass while a maneuver is active although P keyboard can clear it. Actual full-route behavior still depends on unread patches.
- Fallback named rag-memory-fallback contains no retrieval or learned memory in this controller: distance and randomness. Embedded model label is not training provenance. Crypto/Math.random rolls and performance.now/timers prevent seed replay; no RNG transcript or deterministic scheduler.
- Camera/terrain/actors are local renderer logic, not driven by registered camera sequence or visual report. Fidelity report hardcodes readabilityScore0.95 and budget.ok=true; runSmoke supplies spawned/inspection/descriptors true and treats missing QA/host methods as success via ??true.
- Combat static smoke's first required style string is absent; expected liveUnits victory expression and fade1100 also absent (actualfade900). It is source substring checking, not combat execution; this pin contradicts a clean pass claim. No tests were run.

The base scene is custom WebGPU geometry/WGSL with Canvas2D fallback. Its local terrain/primitive/camera algorithms are extraction candidates; Nexus kits handle input/route/metadata rather than owning that rendering. Older gameplay adds Canvas squads and WebGL dice; later combat adds Canvas UI and an optional embedded ONNX scorer. Field provider and later patches remain unreviewed dependencies; no whole-route playability or runtime failure claim is made.

## Pass92 — Current Engine source ownership

- Checked four remaining source subtrees (27files) and five test/helper files.31new receipts; no execution. Pinned source inventory:1,523previously unrecorded code paths ->1,496. Exact duplicates are build source-list metadata, not interchangeable runtime implementations.
- Spatial supplies real vector/quaternion/angle calculations and2D scale-anchor queries. Anchor proximity does not automatically scale gameplay or rendering.
- Host GPU supplies resource bookkeeping over an external provider. Recovery, native queue completion and data restoration are not established by its contract-test smoke. Base Host and Policy kits are descriptor storage, not capability detection or policy enforcement.
- Debug descriptors capture caller-supplied state with bounded default capture counts; they neither measure nor validate the claimed result. Manifest proof pointers overstate coverage when they cite a Runtime-only test.
- Full scoped findings: repositories.jsonl -> LuminaryLabs-Dev/NexusEngine -> spatialHostPolicyDiagnosticsAudit. Continue A02;17master areas remain.

## Pass93 — Asset, Foundation and Network

- Asset has executable registry/job/dependency/cache logic, but ready receipts can outlive usable values after snapshot load. Cache and reset/invalidation races lack generation guards; content identity hashes descriptions, not verified bytes or transitive dependencies.
- Foundation offers seeded randomness, caller-driven timers and snapshot/replay helpers. Zero PRNG restoration, lost ledger records and synchronous unbounded replay limit reliable resumption. Promotion scanning is heuristic.
- Network supplies pure session/authority/queue/replication/timing contracts. Consumers still own transport, authoritative input validation, game-state application and committing returned records.
-51pinned files fully read, including eight asset/network test bodies. Tests use fixtures or memory providers; no test or game executed. Full scoped evidence: repositories.jsonl:assetFoundationNetworkAudit.

## Pass94 — Runtime readiness and durable state

- Startup has real preparation gates, but input/frame/readiness remain caller assertions. Restored playable state bypasses live revalidation; the Asset bridge does not bind reports to launch attempts.
- Schedule double-normalization loses custom firstAt; unbounded catch-up loops and cycle-grouped ordering need explicit budgets/ordering. Existing fixture uses firstAt equal to interval.
- Transaction applyOnce executes before recording; failed cloning/validation or async output can leave unrecorded effects. It is idempotency bookkeeping, not atomic execution.
- Data adds named RNG/completion/digest/package services, but sequential snapshot loads are not atomic. Schema validation is partial and fingerprints exclude envelope identity/provenance. The cited Data smoke only covers basic helpers.
-23Runtime sources and4test bodies read. Five Sequence files remain. Full scope and pin: repositories.jsonl:runtimeDataStartupAudit. No execution.

## Pass95 — Sequence, Compute and MCP

-50pinned source/test files read. Runtime, Compute and MCP source subscopes closed; remaining A02 source queue1,426 ->1,384. Prior1,427count included an already-read Simulation test; corrected. Full source scope does not establish working consumer integration.
- Sequence contains real frame/event orchestration, and Engine.tick drives it. Named behavior nodes largely delegate or complete by default. Deployment does not enforce its validation result; cancellation can trigger parent progression, and restart/snapshot recovery remains incomplete.
- Compute has injected JavaScript handlers and supplied WASM execution. Native CPU/OpenGL/Vulkan files are contracts. Provider lifecycle and worker/model in-flight reset/disposal races limit reliable long-running use; no real model or hardware proof was run.
- MCP supplies actual registry dispatch, collision checks, protected-tool approval and a stdio adapter. Its schema validator is partial; metadata snapshots cannot restore handlers or authorization, and provider replacement/reset does not invalidate pending calls.
- Reconciliation: Engine frame driving exists despite no-op public bind helpers; graph/model receipts do not prove successful output; MCP manifest duplicate-registration/replay claims exceed registry behavior. Detailed evidence: repositories.jsonl:sequenceComputeMcpAudit.

## Pass96 — Object placement and complete Presentation source

-80pinned full source/test reads:54Presentation sources,14Object identity/placement sources and12external test/fixture files. Source queue1,384 ->1,316. Presentation source complete; Object Shape/Fidelity/Vegetation21files remain. Full audit remains open.
- Placement has executable grounding, alignment, fitting and AABB checks. It stores transforms rather than applying renderer/physics changes; restore depends on current Object definitions and does not pin their content.
- Camera smoothing/framing/third-person calculations are reusable. Occlusion is supplied-sample translation and marks resolved even without samples; shortening may undo terrain clearance. The restoration-named test does not reset/restore a camera.
- Capture and Speech have real provider orchestration, but status/asset references are weak acceptance evidence. Capture lacks view/asset verification; Speech can return ready for null output and overwrite cancellation/reset with late results.
- Graphics offers pass ordering, instance deltas, material contracts and terrain LOD selection. Invalid graphs can remain stored; restored batches lose pending dirty/release information and may omit fresh-renderer uploads. Reflection frame receipts are caller reports, not observed frames.
- Sky/UI/Audio/Animation descriptors do not implement rendering, playback or layout. Software silhouette tests normalize each mesh into their own image frame, limiting claims about preserved scale and grounding.
- Source hashes, scoped findings and test limits: repositories.jsonl:objectPlacementPresentationAudit. Large Graphics domain test and generated public helper retain explicit proof-consumer follow-up status; no games/tests/models executed.

## Pass97 — Object Shape, Fidelity and Vegetation

- Read21remaining Object sources and5cited test sources; all pinned hashes matched. Current source queue1,316 ->1,295. Object source scope closed; A02 and17master areas remain open.
- Shape has real provider jobs, candidate qualification and fallback. Default rigid profiles disable deformation/silhouette checks, and geometric quality metrics do not govern approval. Skinned checks are stronger but trust supplied pose/metadata and allow vacuous cases.
- Simplification providers are reusable, but Meshoptimizer requires an injected implementation; triangle reduction can retain full vertex buffers. Fallback labels are not measured quality or cost.
- Fidelity publication is useful orchestration, but mapping presence can count as ready without usable assets. Profile identity, concurrent pending packages and late cancellation/reset completions need reconciliation before dependable reuse.
- Vegetation offers seeded variation and procedural tree segments/card clusters. Wind, lifecycle effects, collision and GPU growth remain consumer work. Tree recipes omit stock Shape target wiring; default resource references do not create resources.
- Five tests inspect fixture/descriptor behavior. The skinned fallback returns original geometry at a reduced requested ratio; tree compute testing delegates back to the same JS function. Neither establishes actual simplification savings or GPU/rendered quality.
- Detailed reusable pieces and limits: repositories.jsonl:objectShapeFidelityVegetationAudit. No tests/games/models executed.

## Pass98 — Authoring foundation and proof-source review

- Read24foundation source files plus6Authoring proof tests and their shared fixture.31pinned hashes matched. Source queue1,295 ->1,271;89Authoring sources remain.
- Project provides substantive staged transactions, SHA256 content identity, revision/epoch gates, request receipts, preview, history and checkpoint/journal recovery. These are reusable foundations for deterministic editing.
- Tool schemas describe installed commands but are not a generic runtime schema enforcement layer. Per-operation validation remains authoritative; ownership metadata does not restrict staged reads/writes.
- Restoring fresh revisions without rewriting fixed dependency references can invalidate otherwise legitimate pinned-reference snapshots. Historical completed receipts are retry facts, not evidence the output still exists after undo.
- Workspace and Domain Composition are typed source documents. They do not open an editor, render a game or implement missing runtime capabilities.
- Six test sources include analytical geometry/deformation checks as well as same-implementation comparisons. They were read, not run; most editing algorithm implementations remain open.
- Details and limitations: repositories.jsonl:authoringFoundationAudit. No source/game/model execution.

## Pass99 — Authoring geometry through delivery

-42pinned full source reads cover Mesh, Editing, Modifier, Assembly, Sequence and Publishing. Source queue1,271 ->1,229;47Authoring sources remain. Existing proof sources and descriptor call sites were reconciled without duplicate receipts.
- Mesh and modifier capabilities are real algorithms: manifold-oriented source checks, triangulation, topology changes, exact surface queries, BSP Boolean, Catmull-Clark subdivision and constrained edge collapse. Their supported profiles and budgets are narrower than a general DCC editor.
- Stored modifier validity does not guarantee evaluation success. Geometry checks do not establish global intersection-free solids or silhouette preservation. Evaluated triangle-corner counts can greatly exceed source vertex counts.
- Seeded scatter enforces count/density/slope/point-spacing in the surface parent frame, not world collision or footprint clearance. Assembly resolves source hierarchy and references without applying a renderer.
- Editing cancelPreview only returns a label; it does not revoke acceptance. Sequence verifies committed receipts, but maxAttempts is unused and earlier successful steps survive later failure.
- Publishing produces a hashed delivery packet with useful source provenance, baking/UV checks and weight-reduction warnings. Actual installation, world-transform/resource binding and rendered fidelity still require consumers.
- Detailed reuse, constraints and test boundaries: repositories.jsonl:authoringGeometryDeliveryAudit. No code, tests, games or models executed.

## Pass100 — Authoring surfaces, rigs and animation

- Read all47remaining Authoring sources, including nine services, image/UV helpers and36 wrappers/manifests. All113Authoring src paths are now accounted for; source queue1,229 ->1,182.
- Concrete reusable algorithms cover pressure brushes, fixed-topology sculpting, curve tubes, tiled painting, procedural materials, UV diagnostics, TRS rigs/CCD IK, linear-blend skinning, animation sampling and baking.
- Scope matters: normal baking is procedural-height based; unwrap is face/grid based; skin binding uses segment distance; retarget uses local rest alignment. These are not general DCC replacements.
- Quality gaps remain distinct from source coverage: asymmetric directional sculpt settings, independent rather than aggregate work budgets, constraint order interactions, sampled rather than continuous bake-error checks, and renderer/runtime consumer work.
- Reconciled the earlier tests and publishing source: UV0 is intentional,32 authoring weights reduce to4 at delivery, and rig bake identity does not by itself prove live playback.
- repositories.jsonl:authoringSurfaceRigAnimationAudit records exact boundaries and reuse ideas. No source code saved locally; no tests, games or models run. The18-area master list remains unchanged.

## Pass101 — Build source, orchestration, toolchains and artifacts

- Read146pinned files:145Build code paths plus exact toolchain source metadata. Completed Source/Orchestration/Toolchain/Artifact/Proof groups and root wiring; read five tests and eight fixture sources. Build294 ->149; current-engine source queue1,182 ->1,037.
- Reusable sequence: fingerprint inputs, analyze target graphs, hash a plan, match approval, execute isolated stages, validate/hash outputs and save aggregate/per-target receipts. Partial target success is retained.
- Reliability limits are concrete: shallow plan immutability; successful receipts/cache skip freshness checks; output overrides are not plan-bound; no in-flight apply lock; existing published bytes are not revalidated.
- Process cwd restriction is not a sandbox and supplies no timeout/output cap. Provisioning has explicit network/license gates, but cached extraction bypasses content rehash and validates links only after extraction.
- Source fingerprints exclude default ignored trees. Dependency discovery assumes hoisted package paths; module graph can resolve existing directories/outside or excluded files that never become analyzed nodes.
- Proof helpers compare supplied values or provider booleans. Read tests cover simple fixtures and selected failure paths, not general game compilation, damaged caches, concurrent execution or device behavior.
- Detailed findings and source paths: repositories.jsonl:buildOrchestrationSourceArtifactAudit. No tests, builds, models or games executed; no source bodies stored locally.

## Pass102 — Build compiler and target source closure

-155pinned full reads close all149remaining Build inventory paths plus four native C/header files and two CLI/proof entrypoints. All294Build JS/MJS/TS paths are now source-reviewed; source queue1,037 ->888.
- Browser output uses a real pinned esbuild bundler. Native lowering is limited to exported arithmetic functions; semanticParity is a structural classification before compilation, not a measured equivalence proof.
- Gate mismatch: web planning does not consistently enforce classification/capability/type failures; native planning omits IR validation. Capability substitutions name providers without implementing them.
- Both native JavaScript package branches embed an empty program. Native arithmetic libraries are packaged without gameplay calls; PC starts only a package-validation command, and Android only loads/checks contracts. This is package tooling, not a completed native game runtime.
- OpenXR C helpers are real API calls but lack an assembled graphics/input/game loop. Their package tests check types/constants and explicitly hardware:false.
- Default web target validation returns success without browser execution. A separate Chromium test covers a simple npm fixture; QuickJS and Rust tests cover narrow cases. All11Build tests were read, none run.
- Cache, mutable-plan and output limits from pass101 remain; web closure/toolchain caches add further unchecked reuse paths. Detailed source pointers: repositories.jsonl:buildCompilerTargetAudit.

## Pass103 — Physics contracts, lifecycle, world and provider boundary

- 91 new full-read receipts plus three catalog-helper reconciliations. Canonical Physics root/Contracts/Lifecycle/World:72files; separate Simulation physics:15files including README; four test sources. Source queue888 ->801.
- Reusable behavior includes field sampling, region selection, time-scale composition, lifecycle transitions and snapshots, provider forwarding, motor-request generation and simple contact correction.
- Canonical lifecycle reset/snapshot only covers lifecycle records. Provider execution, backend state and body response are separate. The older Simulation bridge forwards calls but validates a different, weaker provider contract.
- Source defects/risks include optional-ID normalize/revalidate mismatch, lifecycle request replay after an implicit step-ID advances, independently removable world dependencies, weak aggregate snapshot consistency and provider calls without transactional recovery.
- Catalog installs the legacy provider as physicsContract while articulation code looks up physics; optional forwarding can skip the provider. A concrete integration check is required before calling this composed physics.
- The62550-character canonical Physics test still asserts retired physics/subdomains paths; current catalog helpers preserve the newer paths. Fake-provider tests cover the Simulation implementation and do not establish numerical physics or canonical integration.
- No tests or runtime were executed. Details and source pointers: repositories.jsonl:physicsBoundaryWorldAudit. Remaining Physics234 and Simulation129 stay under A02.

## Pass104 — Body, material, shape and collider source closure

- 156 pinned full reads:153source files (Body44,Material22,Shape46,Collider41) plus three dedicated tests. Source queue801 ->648; canonical Physics has only Constraints41 and Detection40 remaining.
- Useful reusable pieces: revisioned body/collider records, sleep/wake commands, eleven shape descriptor types, 32-layer collision filters, sensor/trigger selection and deterministic physical-material pair rules.
- Static-body normalization has a source-derived blocker: static defaults become sleeping=true/allowSleep=false, then the dynamic sleep guard rejects them. The body smoke exercises dynamic bodies and does not cover valid static construction.
- Shape registration accepts missing/cyclic compound or scaled references; convex and mesh validation establish descriptor shape, not cooked collision geometry. Collider checks only the top-level shape ID.
- Body/shape/material changes can invalidate existing collider references. Record snapshots are not an atomic complete-world snapshot; solver response and provider synchronization remain external.
- Numeric edge cases can produce nonfinite reciprocal mass/inertia or material-pair outputs despite finite input checks. Named kits frequently wrap shared normalizers, so kit counts must not be equated with independent runtime behaviors.
- Dedicated tests were read, not run. Body/Shape manifest proof links still target the stale canonical test, which does not cover their full behaviors. Details: repositories.jsonl:physicsRecordsGeometryAudit.

## Pass105 — Constraints and Detection finish the Physics source map

- 87 pinned full reads:41Constraints and40Detection sources, five tests and one fixture. All306canonical Physics source paths now recorded; current-engine source queue648 ->567. A02 remains open.
- Constraints contributes reusable validation and revisioned joint records, not a solver. Its dense-array checks, scaled normalization and snapshot guards are stronger than the earlier Physics registries.
- Detection contains CPU algorithms: sweep/tree broad phase, analytic primitives, convex GJK/EPA and sphere-only linear time of impact. Unsupported and indeterminate outcomes remain explicit.
- Concrete integration mismatch: Collider accepts32layers; Detection accepts31. Proxies do not automatically resolve or track bodies/colliders, and candidate pairs do not automatically produce solver response or gameplay events.
- Further source-derived limits: unescaped pair IDs can collide; supplied trees and snapshots lack complete validation; Constraints body-detachment enforcement remains the caller's responsibility. Detailed evidence: repositories.jsonl:physicsConstraintsDetectionAudit.
- Five test sources and the fixture were read, not run. Constraint tests cover substantial negative cases; Detection tests cover a narrow shape/sample set and do not verify numerical depth/witness accuracy or cross-domain synchronization.

## Pass106 — Render contracts, device records, lifecycle and camera

- 109 new pinned full reads: root2,Contracts25,Device31,Lifecycle22,Camera29. Two existing source/proof blobs reconciled. Engine source queue567 ->458; Render207remain.
- Reusable structure: typed transport records, declared feature/limit matching, memory accounting, logical submission dependencies, lifecycle state coordination and eight compact camera parameter records.
- These groups do not execute a backend. Root factory installs only the domain contract; device readiness/completion/recovery are supplied receipts. Camera kits store settings without calculating or rendering views.
- Three concrete source-derived gaps: omitted frame timings normalize to rejected nulls; queue removal can leave completed submissions that break restoration; a normal in-progress shutdown is rejected by aggregate snapshot coherence.
- Generic mutation remains exposed on most Device/Lifecycle APIs; reverse dependency removal and snapshot identity checks are weaker than Physics Constraints. Camera has unresolved IDs, no matrix/jitter execution and no matching direct test references in its cited Graphics proof.
- Graphics proof lines1–1524 reviewed, including Contracts/Lifecycle/Device fixtures; later sections remain pending and are not counted as full reads. The shared-GPU proof checks Host ownership with a contract fixture and points native execution to NexusEngine-Kits/tests/providers.
- Details and exact paths: repositories.jsonl:renderBoundaryDeviceLifecycleCameraAudit. No tests or runtime executed.

## Pass107 — Render resource lifetime and surface registries

- 68 new pinned full reads: Resource34,Surface33 and one Surface smoke. Graphics proof extended through1848; resume1849. Engine source queue458 ->391; Render140remain.
- Resources provide exact descriptor identities, dependency graphs, reservation claims, semantic caching and explicit provider receipts. These records do not execute uploads, allocate GPU memory or prove byte integrity.
- Source-derived gaps: references can be added after release begins or ends; completion does not recheck them. Restored upload/release receipts receive weaker checks than live completion. Resource dependencies, cache pins and budget claims are not automatically coordinated with residency/release.
- Integrity records compare supplied strings; descriptor hashes and payload integrity remain distinct. Generic Resource mutation APIs can bypass typed safeguards already documented in the preceding pass.
- Surface has stronger reusable safeguards: safe IDs, revision/tombstone tracking, complete receipt replay on load, installed identity checks, disabled generic mutation, and reverse Surface/Format dependency guards.
- Surface still declares intent: format/device support, window creation, swapchain allocation, resize/fullscreen execution and rendering remain external. Device release can stale swapchain records; custom API names are outside fixed reverse-dependency enumeration.
- Resource proof uses manually supplied receipts. Surface smoke covers descriptor creation/bounds/referenced removal; swapchain is normalized only. Neither proves provider execution. Exact paths and limits: repositories.jsonl:renderResourceSurfaceAudit. No tests run.

## Pass108 — Render Buffer and Texture

- 67 new pinned full reads: Buffer29 and Texture38. Graphics proof extended through2897; resume2898. Engine source queue391 ->324; Render73remain.
- Reusable deterministic checks: buffer layout/overlap/alignment/ranges, six typed buffer views, texture format/aspect compatibility, safe footprint estimates, mip extents, staging capacity and receipt-backed subresource admission.
- Buffer and Texture restored update/stream receipts recheck logical queue completion and exact receipt fields, stronger than Resource upload restoration. Neither group executes a GPU transfer or renders.
- Buffer gaps: completion does not recheck resource lifetime; pending partial updates have no expected content revision; layout stride need not satisfy every member alignment. Current content identity records the last completed patch rather than a derived whole-buffer digest.
- Texture gaps: staging content/residency is unchecked; streaming does not require destination copy usage; tight footprints omit provider packing. Subresource isResident can stay true after whole-resource release; restored historical coverage does not replay eviction history.
- Shadow cube-on-array checks omit square dimensions; shadow views can use stencil-only depth views. Provider-generated mip plans lack a completion/admission route in these kits. Generic mutators and weak snapshot identity checks remain common.
- Proof source tests invalid ranges, mismatched content/receipts, missing residency evidence, deterministic replay and reset. It supplies provider receipts manually and uploads arbitrary whole-texture byte counts; no byte/GPU proof.
- Exact paths: repositories.jsonl:renderBufferTextureAudit. No tests or runtime executed.

## Pass109 — Render Shader and Material closure

- 74 new pinned full reads: Shader41, Material32 and completed shared Graphics proof. Render316 source inventory closed; engine source queue324 ->251.
- Reuse: deterministic source/include/module/program hashes, bounded Cartesian permutations, typed material slots and parameter shapes, required selected-slot coverage, current declared texture residency and material validation hashes.
- Shader compile is a logical record workflow. No compiler runs; artifact digests, reflection and providerExecution claims are supplied. Request replay after completion can fail the pre-replay pending-submission check. Completion omits renewed closure/capability checks; snapshot restore omits receipt compile/submission-ID matching.
- Material bindings cover selected program slots, so runtime must supply other groups. Texture/sampler compatibility, GPU32-bit numeric limits and full sampled-view residency remain external. Feature validation checks only explicit request features, potentially rejecting supported inherited features.
- Current Material inspection and cache touch reject declared texture eviction, stronger than ordinary cache queries. Parent mutation and snapshot/receipt boundaries still need coordination; generic raw mutators remain exposed.
- Full Graphics proof source is now read: it checks hash/shape/reference failures, replay, restore and eviction-stale material using manually supplied provider receipts. It does not establish real compilation, upload, binding or rendering.
- Exact paths: repositories.jsonl:renderShaderMaterialAudit. Generated public-package helper reconciliation remains open. No execution.

## Pass110 — Simulation economy, operations, progression and adapters

- 74 new pinned full reads: adapters25,economy16,operations23,progression9 and progression-pressure proof1. Two existing proof identities reconciled without duplicates. Engine source queue251 ->177; Simulation129 ->55.
- Actual reusable state transitions exist: balances and rejection, capacity/condition/quota, facility cycles, occupant patience/service, ordered-stop transport and prerequisite timing. Effects remain explicit consumer-driven adapter calls.
- Reliability gaps: Economy mutates local state before checking the shared Runtime ledger; adapter sequences do not roll back earlier target mutations. Rejected cost receipts do not stop rewards/facility changes. Same source receipt with a new lifecycle adapter operation can repeat effects.
- Timing gaps: factory double-normalization discards nondefault firstAt for facilities and occupant rules. New occupants age for the entire delta; facility condition is drained before processing earlier cycles. Catch-up loops lack a work budget.
- Transport banks idle progress and accepts same-stop calls without reaching arrival; initial rider/target validation is weak. Lifecycle permits multi-item prerequisite cycles; adding a completed item does not update the completed index.
- Cargo quality multipliers can make deposit values negative; spatial pickup/deposit checks remain external. Pure contact/water adapters require caller applicability and stronger input checks.
- Proof fixtures cover happy paths, same-operation replay, direct integration and selected invalid inputs. They do not cover these cross-domain, timing or lifecycle edge cases. All conclusions are source-derived; no tests/runtime executed.
- Exact evidence: repositories.jsonl:simulationEconomyOperationsProgressionAudit. Remaining areas stay under the fixed master list.

## Pass111 — Simulation source closure and proof reconciliation

- 61 new pinned full reads: Simulation55 remaining sources, five direct tests and one manifest-hierarchy test. Two existing motion/IK proofs reconciled; an existing structurally screened helper receipt upgraded to full read. Simulation146source inventory closed; engine source queue177 ->121.
- Reuse: ticking resource/pressure/window services, ordered proposal resolution, jump/glide motion, Cartesian vehicle boost, seeded planar hazards, pursuit bands, recovery receipts and rig-space forward/two-bone inverse kinematics.
- Core lifecycle gaps: normal Simulation reset calls the wrong resolution method; service snapshots omit resolution ECS state. State writes/events can partially apply before a later error. Proposal duplicate IDs do not check changed content; async callbacks are not rejected/awaited.
- Restore gaps: resource/pressure loads clear collections before validation, aggregate loads mutate incrementally, and unclamped resource values clamp on restore. Direct service methods lack operation receipts.
- Motion gaps: jump/dash cooldowns are calculated but not persisted; dash speed ignores admission. Vehicle turnRate is unused, analog magnitude is discarded and boundary response reverses both planar axes. Rendering/contact/controller wiring remains external.
- IK/rig gaps: jointLimits are metadata only; ownership/cycle/dependent-reference checks are incomplete. Nonnegative along-axis clamping breaks some unequal-segment configurations. Equal-length fixture coverage does not prove those cases.
- Hazard firstAt is lost through double normalization; large/small steps differ and generated hazard fit is not checked at admission. Soft respawn records a location/velocity but does not reset the motion actor.
- Tests cover selected ordering, snapshots, equal-length IK and happy paths; they do not establish complete gameplay loops or the identified failure cases. Source inspected only, no execution.
- Public helper fully read:428unique re-exports, all existing and matching package JavaScript export targets. It loads relative sources, so it does not test consumer package subpaths. Domain hierarchy test covers metadata contracts.
- Exact paths: repositories.jsonl:simulationMotionResolutionAudit. Only World120 and generated Composition guide1 remain in the current source queue.

## Pass112 — World generation, navigation, terrain and water

- 52 pinned source reads; World68 and generated Composition1 remain. Reusable implementations include seeded rooms/corridors, square navmeshes and path search, landmark receipts, terrain sampling/cells, and analytic water queries.
- Generation algorithm lists affect metadata/signatures but do not dispatch alternative procedures. Obstacles can disconnect corridors and point scatter can repeat. Region edges and new hashes do not prove playable diversity.
- Navigation needs explicit coordinate conversion, actor clearance and current graph ownership. Planar navmesh cost uses elevation y where generated centers use horizontal z. Subunit/zero cost heuristics and unreopened closed nodes do not guarantee optimal paths. Graph links do not prove traversable elevation changes.
- Terrain produces sampled data rather than rendered terrain. Default carve bounds differ from default influence; moved focus can retain stale active cells between preload/unload radii. Heightmap dimensions and allocation limits need stronger admission.
- Water returns combined zone depth, drag, current, hazards and wave values; consumers must apply forces/rendering and map XYZ into its planar query coordinates.
- Existing restored-behavior proof source covers selected deterministic/hash/receipt/seam cases, not these integration limits or a player loop. No tests executed.
- Exact grouped findings and paths: repositories.jsonl:worldGenerationNavigationAudit.
- Review method updated by user: merge coherent source batches in memory for Luna summaries, then targeted parent reconciliation. Fixed18master areas preserved; no raw source persisted.

## Pass113 — Grouped World survey and current Engine closure

- Changed method as requested: merge coherent source groups in memory, use Luna for architectural classification, then reconcile important claims.68World files covered as batches rather than exhaustive per-file defect audits.
- World provides phased cell/provider orchestration, separate asynchronous patch preparation, scene transition state, weather evolution/sampling, semantic feature contributions and foundation blending. Renderer/host/provider execution remains external.
- Four key claims checked against source excerpts: synchronous builder rejects asynchronous provider methods; patch restore clears cached/queued work; scalar foundation elevation resolves while fields remain deferred; foundation/feature-family installation is controlled by World flags.
- The467KB generated Composition file is documentation data:22canonical chapter paths exist, seven are generated references. Generator and five selected chapters inspected; no claim that all prose was reread. No additional gameplay implementation is hidden there.
- Reconciled one stale core index receipt by preserving the earlier version and adding the current pinned blob. All23export targets exist. Inventory1642has no missing/mismatched identities and no byte-identical source groups.
- A02 architectural source survey complete. Consumer/version compatibility, experiments, builders and Drive continue under their existing A03-A18owners. Whole audit and runtime capability remain unproven.
- Detailed grouped source findings: repositories.jsonl:worldGroupedArchitectureAudit/currentArchitectureSummary/generatedGuideClassification.

## Pass114 — Engine version and migration groups

- Branches0.0.1/0.0.2 both declare package0.1.0 and expose broad root gameplay/AR modules.0.0.2adds DomainServiceKit;0.0.3adds87Core-kit files and9Foundation files while retaining legacy exports.
- Numeric0.0.4is a hard semantic cutover with205export keys; current main retains package0.0.4but advances semantic layout and Physics/Render/Authoring work. GitHub releases/tags remain empty and0.0.5branch absent. Use commit+export path, not version labels alone.
- Comparing numeric0.0.4to current main found420byte-identical files at different source paths. File growth and renamed paths do not count as new capabilities.
- Migration explicitly replaces old Core paths/default installation. Legacy World Physics splits into contact and respawn; concrete hosts/renderers/providers and authored gameplay live outside Core. Consumers must migrate separately.
- ProtoKit extraction README declares3698classified items and zero new Core atoms. This is historical ledger evidence, not an independently recomputed audit. It guides reuse-first exploration underA04.
- July23evidence-score ok and July31fixture failures have different run scopes; no contradiction or runtime success inferred. Stale kit graphs are historical evidence only.
- Three existing Drive version snapshots linked to current GitHub identities without pretending a fresh Drive read. Full document/relationship reconciliation remainsA14/A15.
- A03 complete as architecture/version mapping. Exact records: repositories.jsonl:versionMigrationSurvey. A04shared-kit survey is next.

## Pass115 — Shared-kit groups and frozen classification

- First-party catalog recomputed:140entries across23category keys;23official,14candidate,8scaffolded,95migration placeholders. Exactly45entry files exist; all95missing entries are declared placeholders. Some generated limitations documents still say134entries/8candidates.
- Concrete reuse includes camera smoothing, instancing descriptors/bounds/dirty slots, procedural object descriptors, bounded patch preparation, multiplayer prediction/reconciliation and WebGPU device/render/compute/frame providers. Concrete targets were inspected beyond re-export wrappers; execution remains untested.
- Shared loader rejects unresolved manifests normally. Unresolved opt-in yields empty runtime metadata shells, not the advertised gameplay. Executable hydration has separate owner/integrity/resolver gates.
- Kits peer-depends on Engine0.0.4 and dev-pins currenta74e. Its lock points to older Kits commite3246, not an Engine commit. Do not confuse the two repositories or assume current candidates are in that locked selection.
- Frozen ProtoKit JSON inventory/dispositions fetched through Git blob connector after large contents responses failed.530folders,905source file paths and3698unique items structurally verified; no raw source persisted.119core-reuse,115core-composition,3096external-kit,113recipe-data,236game-owned,19rejected-unproven.
- The224candidate Core gate records flag203missing reset/snapshot and223insufficient distinct consumers. These are recomputed historical assessment totals, not new runtime results.
- ProtoKit planning/graph/taxonomy/seed representatives contain useful list/graph algorithms but do not install full gameplay. Legacy core-kits/core-object imports and fallback shells need consumer-specific migration. Current Engine retirement policy differs from frozen ProtoKit incubation documents.
- A04 architectural source survey complete; consumer compatibility stays underA05/A11. Catalog presence and historical promotion labels are not acceptance evidence.

## Pass116 — Next Ledge readiness variants and Cavalry route ownership

Pinned NexusEngine-Experiments tree: b05957890f514356d2ce42e2510bbba6f424e3c9 (2,845 entries, not truncated). Twenty-four Next Ledge source/test blobs and six previously unrecorded Cavalry kit/arena blobs were added as exact receipts. See repositories.jsonl fields nextLedgeReadinessFamilyAudit and cavalryReadinessAndRouteReconciliation; source identities are in sources.jsonl.

- Eight Next Ledge themes share a descriptor architecture: six describe(snapshot, groups) content kits and a renderer handoff. They derive risk/readiness/route indicators from the base snapshot; they do not own input, physics, objective changes, lifecycle or reset. Entry wrappers can patch GameHost, merge renderer descriptors and draw Canvas2D overlays on RAF, but experiments/next-ledge/index.html does not load the eight readiness entry modules; no active route feedback is established.
- These provide authored spatial cues and decision context; source structure does not establish eight different action loops or outcome rules. Smoke sources assert descriptor/ownership contracts on supplied inputs; they were not executed.
- Cavalry readiness kits calculate descriptors; Canvas/RAF passes display them around campaign state. Arena-polish is a separate host drawing/input interception layer; hex campaign/combat remains with the base game/controllers.
- The live app is through campaign-041; the experiment route and manifest stop at campaign-038, omitting aqueduct sabotage, frontier beacon chain and standard-bearer morale.
- No browser, tests, or model was run. This is static source ownership and route evidence only.

## Pass117 — One hundred AAA profiles, one shared host

Pinned NexusEngine-Experiments tree: b05957890f514356d2ce42e2510bbba6f424e3c9 (2,845 entries, not truncated). Read the registry, all six shared host files, route generator, shared app route, three profile wrappers/routes, and two contract/static smoke sources as a grouped sample. Exact newly read receipts are in sources.jsonl; grouped audit is repositories.jsonl:aaaBatchFamilyAudit.

- The registry has 100 profiles with distinct themes, controls text, palettes and smoke-action strings. Static parsing found 26 kitStack combinations; 75 profiles use the same generic four-label stack. Those names are copied to state/readout, not resolved to adapter instances.
- All 100 profile routes share one four-node action/resource/pressure host and the same Canvas2D drawing shape. Only small generic action branches alter resource or lane/depth; most action names fall through to the same node-charge rule. This does not evidence 100 distinct gameplay families.
- These routes do not import NexusEngine or Three.js. The page loader waits for GameHost and renders boot state; it is not engine integration. The separate Cavalry app path is routed specially and is outside the 100-profile registry.
- The source tests call the host directly and test deterministic scripted completion/restart. They were not executed and do not provide normal-browser or visual evidence.
- Planning artifacts disagree on canonical portfolio counts (the 20-game refiner says 7; the seeder metadata says 16 while listing seven detailed portfolio records). Keep these as conflicting planning records pending manifest reconciliation; neither proves the present app count.

## Pass118 — Zombie Orchard imports an incompatible legacy Engine surface

Reconciled `experiments/zombie-orchard/src/kit-stack.js` (Experiments tree `b05957890f514356d2ce42e2510bbba6f424e3c9`, blob `2516c9dfff55568d38886dda75a57711b01dc65e`) against NexusEngine current-main tree `a74e8689d1a71c0b42236c009f0f4c46e9b89387`. Its adapter directly requests 12 `create*Kit` functions from the Engine root namespace: character movement, interaction and camera; world physics; light combat; objective flow; collectible; render descriptor; procedural; navmesh; pathfinding; and realism. The pinned public `src/index.js` re-exports the Engine runtime/composition contracts, while `src/engine.js` exports `createEngine`; neither exposes those 12 names. A browser resolving that exact source snapshot should reject those named imports. No runtime was executed; the consumer points to mutable `@main`, so present CDN behavior is not confirmed.

The same consumer imports survival-domain kits from `LuminaryLabs-Agents/NexusRealtime-ProtoKits@0.0.1`. GitHub reported that repository path as moved to repository ID `1266731854`, but the connector could not resolve that identity or the requested source file. The accessible `NexusEngine-ProtoKits` repository is not assumed to be the same project. Record the alias and migration mapping as unresolved; this is a concrete blocker for treating Zombie Orchard as current Engine-compatible. Evidence pointers: `repositories.jsonl:zombieOrchardLegacyEngineCompatibilityAudit`; exact source receipts already exist in `sources.jsonl`.

## Pass119 — GoldRush art authority versus the pending supersession task

Current Drive reads reconcile the prior conflict. `GoldRush-DecisionMaster` (revision `ANLCKQkt...`) still contains DEC-007 in the locked decisions section: prototype first, then Xander final art on surviving assets. The newer `GoldRush-TeamMaster` (revision `ANLCKQkG...`) and `GoldRush-ChatHandoff` (revision `ANLCKQna...`) state that art lanes are parallel and no creator must inherit another creator’s prototype geometry. `GoldRush-AssetMaster` (revision `ANLCKQkB...`) stages gameplay prototypes before art candidates but routes final/rebuild work to the appropriate creator lane; it does not require a Charity→Xander handoff. The current TaskTracker row GR-TASK-008 remains `Ready` and explicitly requires a new numbered locked decision, preserving DEC-007 as history. Thus the current team direction is clear, but the authoritative decision-log change/readback has not been completed.

This is design/document authority only; it proves no NexusEngine capability or game implementation. Drive receipts are in `drive.jsonl`; pass119 records the modified-time and status cross-check.

## Pass120 — Three attempted Engine consumers target an absent current-main API

GitHub connector reads of NexusEngine `/commits/main` and `/branches/main` both resolve to `a74e8689d1a71c0b42236c009f0f4c46e9b89387`. Its pinned `src/index.js` export closure includes `src/engine.js`, whose Engine constructor is `createEngine`; `src/ecs.js`, release metadata and Composition exports also do not provide `createRealtimeGame`. At the same Experiments pin, Fogline Relay `src/session.js:196`, Signal Bastion `src/boot.js:308`, and The Open Above `open-above.js:530` invoke `createRealtimeGame` while their configured Engine URL resolves to `@main`. These are attempted integrations, not compatible current-main consumers. If the URL serves the inspected commit, the property is undefined when invoked; no browser/runtime failure was observed.

Fogline’s local kit contains the semantic scan/relay/gate/wraith rules and is scheduled through the attempted host; this is an extraction lead, not current Engine proof. Signal Bastion’s boot additionally constructs an authoring-QA kit, then sets `valid:true` whether metadata exists or not and never calls a validator, so the apparent QA gate cannot reject an invalid preset. Open Above’s browser config also points to mutable Engine `@main`, while its npm lock records older commit `8a60167fc945109408851c586a9355b1147438d5`; the lock does not pin the browser URL. Pass118 already records Zombie Orchard’s 12 absent direct factory imports. Hellscape’s main route owns a separate local runtime; Sora is a launch gateway to Open Above.

This corrects source-level classifications from earlier passes and does not establish whether CDN cache/rewrite behavior or alternate entrypoints alter the result. Evidence: `repositories.jsonl:experimentCurrentMainCompatibilityAudit`; source identities remain in `sources.jsonl`.


## Pass121 — Grouped experiment ownership and route reconciliation

Seven canonical families were grouped at the pinned `NexusEngine-Experiments` tree (`b05957890f514356d2ce42e2510bbba6f424e3c9`): Third Person Follow Through, Infinite Radial Terrain, High Fidelity Meadow, Signal Isles, Tropical Island, Cozy Island, and Peer Scene Transition. Entry scripts and their direct ownership seams were read together; no tests or runtime were run. Grouped architectural synthesis used `gpt-6-luna` at low effort; representative ownership claims were then checked against pinned GitHub source by the primary agent. The 16 canonical routes now have source-based renderer/state-owner classifications, and readiness/theme variants plus Sora’s Open Above gateway are kept under their owning games.

A key correction: Tropical Island imports a Nexus namespace but its inspected boot constructs `createMiniNexus`/`createMiniRuntime` locally. Signal Isles similarly boots a local composition, renderer, and debug host; the Engine namespace is used for export metadata. Meadow passes the namespace to local descriptor factories but builds its Three.js scene locally. Infinite Radial can continue if the Engine CDN import fails. Third Person and Peer Scene use local state/presentation with legacy or metadata-only Engine imports. These are source-level local/hybrid implementations, not proven current Engine runtime consumers.

Pass120 compatibility findings are now reflected in `canonicalEntryAudit`: Fogline Relay, Signal Bastion, and The Open Above call `createRealtimeGame`, absent from the verified current Engine main commit. This is a static API mismatch, not an observed browser error. Signal Bastion’s inspected QA gate always sets `valid=true`. Next Ledge remains the strongest current-API seam because its wrapper can fall back to `createEngine({kits})`; its dependency closure and browser behavior are still unverified. Path Meadow is recorded separately as an inline Three.js/WebGL area-kit proof using mutable ProtoKits `@main`, not a complete game.

Exact evidence: `repositories.jsonl:experimentFamilyOwnershipPass121`, refreshed route summaries under `canonicalEntryAudit`, and the two new pinned receipts in `sources.jsonl`.


## Pass122 — Next Ledge current Engine kit-installation seam

Re-read the active Next Ledge cargo wrapper at Experiment tree `b05957890f514356d2ce42e2510bbba6f424e3c9`, the Engine public entry at `a74e8689d1a71c0b42236c009f0f4c46e9b89387`, and the cargo kit at ProtoKits commit `04d34f049f58ae359cf71d43466c429dac2a6d08`. The wrapper chooses `createRealtimeGame ?? createRealtimeEngine ?? createEngine`; current public exports expose `createEngine`, `src/engine.js` installs each `options.kits` entry, and ECS re-exports `defineResource`/`defineEvent` while the kit uses `defineRuntimeKit`. The pinned cargo kit returns the corresponding `initWorld`/`install`/systems contract. This supports a **static API-shaped integration seam**, not end-to-end compatibility or browser proof.

The ownership split remains decisive: local closure state owns climbing, branch choice, progression, and terminal outcomes; the Engine-hosted cargo/route/pressure service mirrors and reacts to local events. The existing source audit finds that cargo delivery does not gate base win/failure, its runtime ticks at `dt=0`, auxiliary snapshots can mutate state, and reset/replay/disposal are not unified. Treat the kit as a reusable support service, not proof that this game loop is Engine-authored or reliable.

Grouped architecture review used `gpt-6-luna` at low effort; the primary agent verified the Engine export/install surface and pinned kit shape. Exact identities and bounded conclusions: `repositories.jsonl:nextLedgeCurrentApiFitAudit` and `collections.jsonl:nestedAudits.nextLedgeCurrentApiFitAudit`. No tests or runtime were run.


## Pass123 — Cavalry diplomatic, hospital, and convoy readiness are overlays

At Experiments tree `b05957890f514356d2ce42e2510bbba6f424e3c9`, three paired domain/pass families were grouped: diplomatic command, field hospital, and grain convoy. Each domain kit produces six kinds of snapshot-derived descriptors plus a renderer handoff. Each pass reads `GameHost` state and draws to an `aria-hidden`, pointer-transparent Canvas2D overlay. The inspected pass modules do not mutate campaign or combat state; importing the Engine namespace does not establish Engine-owned game logic. These are three readiness features over the Cavalry family, not three additional playable game loops.

Six corresponding smoke sources were read. Domain-kit smokes call descriptor functions on case data and assert declared shape/IDs. The `cdn-state-input` smokes use source-string checks for imports, route wiring, host accessors and manifest markers; they do not fetch the CDN, run a browser, or establish player input causing campaign consequences. None of the tests were run. Exact module and test pins are recorded in `repositories.jsonl:cavalryReadinessDescriptorPass123` and `sources.jsonl`.

Remaining Cavalry work is now narrower: reconcile campaign 039–041 route ownership, classify other readiness entries, and inspect any imported implementation before attributing it to Engine. Runtime/browser evidence remains absent.


## Pass124 — Cavalry campaign 039–041 route and ownership reconciliation

At Experiments tree `b05957890f514356d2ce42e2510bbba6f424e3c9`, the app route is at campaign 041 and loads passes 039–041; the experiment entry stops at 038. Its cutover manifest still declares Cavalry through grain convoy/038, while `domain-plan.json` stops at diplomatic command/036. The campaign entries therefore disagree; there is no `manifest.json` inside the Cavalry experiment folder.

The 039 aqueduct, 040 beacon-chain, and 041 standard-bearer kits derive readiness descriptors from campaign snapshots. Their passes add derived getters/snapshot fields and draw pointer-transparent Canvas2D overlays; no campaign mutation or NexusEngine API use was observed in those passes. These are readability/presentation features over the existing campaign, not new gameplay loops. Six corresponding smoke sources cover synthetic descriptor cases and static route/import markers. The 040 smoke expects a campaign-040 build stamp absent from the current campaign-041 app route; that assertion appears stale. Sources were read only; tests, CDN, and browser were not run.

Exact identities are in `repositories.jsonl:cavalryCampaign039041RouteAudit` and `sources.jsonl`.


## Pass125 — Cavalry active route has a local state owner and an objective-wire concern

At the pinned Experiments tree, the campaign-041 app route uses a locally authored state object in `cavalry-campaign-3d-terrain-pass.js`, exposed as `CavalryCampaignMap`. That module generates the campaign and raw WebGL2 terrain; the active space-selection, hex-engagement, and world-action passes mutate its troop, ownership, turn, and action fields through shared globals. This is not NexusEngine-owned gameplay, and the base renderer is raw WebGL2/Canvas2D rather than Three.js.

The terrain pass’s `checkEnd()` marks `complete` when every territory has any owner (not specifically player ownership). The active space-selection/engagement/world-action paths do not call it. This is a source-level objective wiring risk, not a confirmed live failure. Exact pinned source identities were already recorded in `sources.jsonl`; grouped ownership findings are in `repositories.jsonl:cavalryCampaignGameplayOwnershipAudit`. No tests, CDN requests, or browser were run.


## Pass126 — Three experiment hosts call an API absent from current Engine exports

The pinned Experiment tree has three canonical hosts that invoke `createRealtimeGame({ kits })`: Fogline Relay (`session.js:196`), Signal Bastion (`boot.js:308`), and The Open Above (`open-above.js:530`). Current NexusEngine main resolves to `a74e8689d1a71c0b42236c009f0f4c46e9b89387`; its public `src/index.js` re-exports `src/engine.js`, where the constructor is `createEngine` (`engine.js:120`). The fetched pinned entrypoint exposes no `createRealtimeGame`. The older, versioned `docs/API_SURFACE_0.0.3.md` still lists it, while `src/release.js` declares 0.0.4. This is source/API documentation drift and a reproducibility concern, not proof these games currently fail: all three hosts point at the mutable CDN `@main`, and no CDN or browser run was performed.

The integration ownership differs by game. Fogline’s custom runtime kit owns its relay resource and simulation system; Signal Bastion installs domain kits and advances `engine.tick` from its app-owned animation frame; The Open Above directly orchestrates kit calls and `engine.tick` in an app-owned frame loop. These are not interchangeable engine-ownership claims. Luna grouped the three source paths; the primary agent verified the current branch ref, exports, and code paths. The Drive document “0.0.5 Version and Architecture State” records main at `bacc8fc` on September 4; GitHub confirms that commit exists, while current main is `a74e868` from September 7. The inspected `src/index.js`, `src/engine.js`, and `src/release.js` blobs are identical at both commits, so the constructor mismatch is present in both snapshots; the Drive packet remains a historical checkpoint, not the current branch pointer. Exact details and receipts: `repositories.jsonl:consumerCurrentMainCompatibilityPass126`, `collections.jsonl:nestedAudits.consumerCurrentMainCompatibilityPass126`, and `sources.jsonl`; Drive reconciliation is in `drive.jsonl`. No tests, CDN requests, or browser execution.


## Pass127 — ProtoKits old repository name resolves to the current canonical identity

GitHub `get_repo` for `LuminaryLabs-Agents/NexusRealtime-ProtoKits` returned repository ID `1266731854`, canonical name `LuminaryLabs-Agents/NexusEngine-ProtoKits`; exact old-name repository search returned no results. At that repository, `package.json` tag `0.0.1` declares `@luminarylabs/nexusrealtime-protokits` version `0.0.1` (blob `42bcbf95b87904fbb3300cb00fb19e99b7175c89`), while `main` declares `@luminarylabs/nexusengine-protokits` version `0.0.2` (blob `103dc90d4a1ce90a68275bc7fbf9840ea14b1ef6`). The old-name ledger is historical evidence, not current identity evidence. Zombie Orchard imports the old URL and tag `zombie-orchard-protokits`; its generic survival adapter at tag `0.0.1` (blob `5b06711ceda2f0aecbb33d7582e35de0902b79ac`) also imports that target. The exact subref was not found in the accessible canonical repository. This supports a repository/package identity transition but does not establish its date, commit continuity, or historical CDN delivery. See `repositories.jsonl:protoKitsIdentityPass127`, `sources.jsonl` and `collections.jsonl:nestedAudits.protoKitsIdentityPass127`. No CDN request or runtime test.

## Pass128 — Seven experiment families grouped by renderer and state ownership

At Experiments commit `b05957890f514356d2ce42e2510bbba6f424e3c9`, a grouped Luna review and primary source reread covered Third Person Follow Through, Peer Scene Transition, Infinite Radial Terrain, High Fidelity Meadow, Signal Isles, Tropical Island and Cozy Island Cloudbar. Third Person Follow Through does instantiate and tick a legacy `createRealtimeGame`/CoreDebugKit sidecar, but its Three.js scene, player movement/collision and camera gameplay are locally owned. Four imported Engine paths return 404 at the pinned current Engine snapshot; this is static path absence, not observed CDN/browser failure. The other samples vary: Peer Scene Transition, Signal Isles and Infinite Radial Terrain keep gameplay/render ownership in local app code; High Fidelity Meadow passes Engine namespace data into local descriptor factories; Tropical Island uses a local mini-runtime; Cozy Island Cloudbar imports mutable ProtoKits domains without a NexusEngine module in the inspected renderer. Exact path/hash evidence is indexed at `repositories.jsonl:experimentFamilyOwnershipPass128`; existing source identities are in `sources.jsonl`. This is a representative static sample, not A05 closure. No tests, CDN fetches or browser runs.


## Pass129 — Cavalry completion helper is not wired into active interaction paths

At Experiments `b05957890f514356d2ce42e2510bbba6f424e3c9`, primary rereads covered the base terrain/state pass, space-selection pass, hex-engagement pass and world-actions pass. The campaign is locally state-owned and renders through raw WebGL2/Canvas2D. `checkEnd()` in `cavalry-campaign-3d-terrain-pass.js` marks the campaign complete when every territory has any owner, including rival owners. The inspected active selection/combat/action files do not invoke `checkEnd()`. This is a likely missing or incorrect victory transition, not an observed gameplay failure. The four base files contain no NexusEngine/GameHost calls; this is evidence of local state ownership, not proof that the route runs. See `repositories.jsonl:cavalryObjectiveWiringPass129` and `collections.jsonl:nestedAudits.cavalryObjectiveWiringPass129`. No tests, CDN requests or browser run.


## Pass130 — Next Ledge wrapper fallback does not cover the base-session constructor

Primary reread at Experiments `b05957890f514356d2ce42e2510bbba6f424e3c9` confirmed the active chain: `main.js` loads the cargo wrapper, which loads the visual wrapper, which calls the base session. Both wrappers select `createRealtimeGame ?? createRealtimeEngine ?? createEngine`; however, `experiments/next-ledge/src/session.js` directly invokes `NexusEngine.createRealtimeGame` while constructing the base session (blob `14a013501e7d376e6ca417e30dba1d97bf4ab560`). At Engine `a74e8689d1a71c0b42236c009f0f4c46e9b89387`, `src/index.js` exports `src/engine.js`, whose constructor is `createEngine` (blobs `6cbdd4f224cf3cd7a4feb6f976ddc9fd627ba8d1` and `3fcb74243a30d084595df6136b0f11e61cb1efb1`). Thus the outer fallback does not cover the inner base-session call. This is a pinned source compatibility risk, not a tested runtime failure. Base session owns climbing win/fail; the cargo wrapper mirrors auxiliary state and does not gate terminal outcomes. Reset is split, and visual snapshot decoration calls configure plus `tick(0)`, so reads have side effects. See `repositories.jsonl:nextLedgeNestedLegacyFactoryPass130` and `collections.jsonl:nestedAudits.nextLedgeNestedLegacyFactoryPass130`; exact source receipts already exist. No tests, CDN or browser execution.


## Pass131 — Builder outputs do not yet prove a playable NexusEngine game handoff

A grouped review covered four pinned builder roots. At NexusBuilder `862ce82513c9aa1a020e9e2677c1fef32c626231`, NexusBuilder-Lite produces prompts, manifests and virtual-file text; its validator checks text/JSON shape. LMStudioCodeGen stages and applies generated source batches, but the injected `AlwaysPassGate` does not validate a candidate and its execution step runs the target directory before the batch is applied. At NexusFactory `e26a5a80eb85a0102ad728d7552f23b72a9e22f1`, the Arcane Totem factory writes procedural FBX/GLB/textures and structurally checks output node/animation metadata. Its preview is Canvas2D; `fbxLoaded`, `glbLoaded` and animation assertions are published by the page itself, and the review stage hardcodes positive visual answers. This capture therefore does not prove that an exported model was loaded or played. At NexusFactory-Kits `cf3a220e81dad914c04b77308f422d23c8c91793`, reusable kits expose artifact generate/validate/variation/export services; the sampled Ballista produces an asset GLB and Reef declares an image-2d/PNG artifact. At NexusFactory-Studio `6d37fe078ec8db8c6e58d35903a39e8672a81b97`, a generic declarative registry host imports kits and invokes those services/viewers, but no automatic Factory-Kits or NexusEngine integration was found. The group reaches text/assets/previews, not a demonstrated game compiler, Engine composition, or playable loop. Exact receipts: `sources.jsonl`; audit index: `repositories.jsonl:builderOutputAuditPass131` and `collections.jsonl:nestedAudits.builderOutputAuditPass131`. Grouped Luna synthesis plus primary source verification; no commands, tests, browser, CDN or game execution.


## Pass132 — A05 closed at the connector-only source-evidence boundary

A05’s recorded source scope now maps the canonical experiment families, local versus Engine ownership, main current-Engine constructor/export mismatches, the legacy Zombie Orchard factory imports, the old ProtoKits repository/package identity, the Next Ledge nested legacy constructor, and Cavalry’s likely completion-transition defect. The checked items point to pinned sources in `repositories.jsonl`, `collections.jsonl` and `sources.jsonl`. The area is complete as a static capability audit because each known finding has an owner, source identity and explicit disposition. It does not claim the games run. Mutable CDN resolution, unindexed additional consumers, the unavailable historical Zombie Orchard ref, all tests, and browser/runtime behavior remain explicitly unresolved. See `repositories.jsonl:a05SourceLevelDispositionPass132`. Next fixed area: A06 Builders.


## Pass133 — Remaining builder handoffs classified at pinned source scope

Grouped `gpt-6-luna` synthesis covered NexusEngine-Builder, NexusEngine-TreeFactory, NexusIdeaFactory, NexusRealtime-KitBuilder01 and KitBuilder02. The primary agent checked the compiler, packager, static server, Quest demo/config/interaction sequence, TreeFactory Three.js app/domain/export seam, idea orchestrators, and representative fleet/peer kit sources at their recorded commits.

NexusEngine-Builder’s project compiler validates an IR and emits native crate files; the packager stages/normalizes input and records package artifacts. Its Quest cube demo separately imports a local frame-loop kit and declares controls and host commands. Static sources do not show that the compiler output is the Quest demo, nor that the declared host commands resolve to an executable host. NexusEngine-TreeFactory installs Engine procedural kits and a Three renderer adapter and exports tree/object assets (GLB/PNG/JSON); it is an asset authoring path, not a playable game builder. NexusIdeaFactory is upstream text idea orchestration. KitBuilder01 simulates fleet deployment; KitBuilder02 supplies peer-room/network infrastructure.

A06 is complete within the connector-only audit scope because the relevant remaining roots now have explicit roles, source pins, and output-to-runtime evidence limits. No build, tests, browser, CDN, Quest device, or game was executed; successful compilation and gameplay remain unverified. Exact source receipts are in `sources.jsonl`; per-repository classifications are in `repositories.jsonl:builderOutputHandoffAuditPass133`, with grouped index in `collections.jsonl:nestedAudits.builderOutputHandoffPass133`. Luna synthesis was used as an architectural aid; all claims above were checked against the pinned source paths.


## Pass134 — Agent-harness roles and generated outputs reconciled

Grouped `gpt-6-luna` synthesis covered the KitBuilder03 LiveHarnessV.01 harness and one active generated voxel-game tree, together with the already pinned NexusAgent A1, LiquidUniversal, LiquidPro and Lite lanes. The primary agent verified exact source blobs and the active manifest/tree identities.

KitBuilder03’s active selector names LiveHarnessV.01 and says `manual_review_required`. Its inspected massive-build v4 path promotes after deterministic static validation and self-alignment advance; the reviewer helper approves when the tool-result `ok` flag is true and does not perform a separate gameplay review. The manifest contains three active IDs with identical generated directory trees. Repository-wide directory comparison yields 36 published folders and 16 unique trees.

The sample game has a real-looking local Three.js loop and local movement, build/break, objective, input, renderer and GameHost modules. The runtime adapter attempts alias imports but falls back locally; the domain-service adapter describes a local build-break fallback and checks trace-shaped state. The gameplay modules are locally implemented, so NexusEngine domain ownership is not demonstrated. The only inspected smoke test asserts command-ID de-duplication and a valid spawn height; it was not run and does not cover game interactions or completion.

NexusAgent’s existing pinned lane receipts show an action-limited planner/reviewer, bounded recursive capability routing, profile/goal/packet gating and grouped Lite outputs. These support architectural classification only. A07 is complete at the static connector boundary; model calls, candidate build, tests, browser play, human review behavior and engine handoff remain unverified. The apparent mismatch between the manual-review policy and visible auto-promotion condition is explicitly unresolved unless another uninspected gate exists. Exact pins: `repositories.jsonl:agentHarnessOutputAuditPass134`, `repositories.jsonl:agentHarnessCrossAuditPass134`, `collections.jsonl:agentHarnessOutputAuditPass134` and existing NexusAgent source receipts.


## Pass135 — Sandbox builder lanes and historical runs mapped

At `LuminaryLabs-Agents/NexusRealtime-Sandbox` commit `5a06ee1d85c75fd55c798a87be61e81947aaa3e3`, grouped `gpt-6-luna` synthesis covered SandboxBuilder V1/V2, the manifest-driven KitSandboxer, and `.agent/protokit-automation` history. The primary agent checked the package scripts, representative kit implementations, composition/proof path, model/action boundary, saved verification records, and generated resource-loop tick source.

V1 is the preserved procedural-object ProtoKit lane: reusable deterministic geometry/placement and pressure-state kits produce serializable data, while capture apps and adapters own presentation. Its package declares syntax plus five headless suites; the flow-pressure suite specifies deterministic ticking, threshold transitions, release/reset, and serializable snapshots. V2 is a separate renderer-free composition lane: deterministic geometry, organ layout and support kits combine as recipe data; its proof checks required children, JSON serialization, and repeat equality. Both are useful patterns for domain ownership and headless contracts, but neither is a demonstrated Three.js/NexusEngine game compiler.

KitSandboxer is a manifest-driven candidate-kit workflow with staged model actions, constrained sandbox commands, proof, and review artifacts. Its policy requires a domain boundary and headless proof and forbids renderer ownership/direct push. Historical outputs include a Resource Loop kit with deterministic state/tick functions. One recorded local test artifact says 3/3 kits passed 20 ticks, but we did not rerun it; the sample generated module declares host-surface metadata as strings and does not import NexusEngine. Treat this as a reusable prototype and historical test claim, not current Engine integration. Other sample turn records are explicitly dry-run and set `local_builders_run=false`.

The tracked top-level `Runs/` has only `.gitkeep`; run records live in `.agent/protokit-automation`. Separate tree reads fully enumerate asks, kit-turns, smoke, runs, and most offload categories. The deep offload/packets tree is still truncated, and recursive parent/child counts conflict, so A08 is closed only for its scoped source and role map; the exact deep generated-artifact inventory remains unresolved. No code, tests, providers, browser, game, or runtime were executed. Evidence: `repositories.jsonl:sandboxAuditPass135`, `collections.jsonl:a08SandboxPass135`, and pinned receipts in `sources.jsonl`.

## Private arcade import/version reconciliation (pass136)

Pinned snapshot: `LuminaryLabs-Dev/NexusArcade-Private@1c602f3a93bf299521ffb6c3e4b9d47f81d89823`. The app package is `nexus-arcade@0.1.0`; its package manifest does not declare `nexusrealtime`. In the representative and shared arcade pages inspected, the bare `nexusrealtime` specifier is mapped to the checked-in `_site/vendor/nexusrealtime/src/index.js`, not to a package-manager dependency. The vendored barrel has blob `7bb76a62579f4440ccc9525eecd48637b9fdf6a3`; the shared route runtime imports three names that the barrel does not export: `createTimingWindowKit`, `gradeTimingWindow`, and `TimingWindowState`.

Pinned import/export comparison covered the shared route runtime and six representative game modules. Missing named exports are: `freight-surge` (`createTransferZoneKit`); `it-pixel-place` (seven kit factories and seven state symbols); `riftwarden-wilds` (`createCameraKit`, `createLocomotionKit`, `createPhysicsKit`); `tidebound-delve` (`createLocomotionKit`); `tropical-jetski-rescue` (`AssistanceTargetState`, `TransferZoneState`, `createAssistanceTargetKit`, `createTransferZoneKit`); and `you-thought-you-were-big` (three state symbols and three kit factories). This is a static ES-module export mismatch in the pinned snapshot; no game was imported or run, so the audit does not claim which deployed pages fail or whether server/CDN rewriting changes the served files.

The 14 entries previously classified as Three.js use multiple versions in their inspected HTML: r128 classic scripts in `aether-threads-rpg`, `aether-threads`, `infinite-tropical-jetski`, and `the-infinity-bean-stalk`; module imports at 0.161.0 in `LGT-Bosses`, `cozy-fishing`, `neon-drift-courier`, `reef-rescue`, `relayfall-sky-below`, and `riftwarden-wilds`; 0.184.0 in `midnight-pizza`, `skyline-idle-builder`, and `tidebound-delve`; `industrial-overgrowth-flight` has no Three.js URL in the inspected entry HTML. Some Three pages do not use an import map. The app package separately declares Three `^0.184.0`; that does not pin the runtime loaded by every individual game.

The current public NexusEngine root index remains a separate API/version identity from this checked-in private vendor. Earlier pinned comparison records current Engine package/export evidence and missing legacy API names; neither the vendor folder name nor package labels establish compatibility. A09 is closed for the scoped static import, renderer-version, and runtime-family map. Nested local module trees, deployment rewrites/cache state, and actual browser playability remain outside this evidence boundary.

## Pass137 — A10 builder history reconciled without repeating the builder handoff audit

A10 reuses pinned NexusBuilder evidence already audited in the fixed A06/A07 work, and classifies the historical/staged-work reports that were still unresolved. NexusBuilder-Lite expands list/manifest inputs into prompts and virtual file text, then validates output text/JSON shape; its source does not establish a runnable game. LMStudioCodeGen has HTTP, stage, process and apply plumbing, but the custom endpoint is not shown to be an LM Studio provider; its `AlwaysPassGate`, target-directory execution before applying the batch, weak failure propagation and non-atomic file updates prevent interpreting completion labels as successful candidate validation. The older native stage shell writes task-description artifacts and does not establish model generation, compilation or game play. These are static source findings from the exact pinned commit, not reproduced behavior.

The historical validation material also names a release-build log that is absent from the pinned tree. No output from that missing log or any staged-work PASS assertion is counted as proof. A10 is complete at the pinned-source/report inventory boundary; exact linked release/build output, test execution and runtime handoff remain unverified. No broad source re-read, build, test or game execution occurred. Evidence: `collections.jsonl:a10BuilderHistoryPass137`, `sources.jsonl` existing NexusBuilder receipts, and `repositories.jsonl` NexusBuilder tree record.

## Pass138 — Published game source families reconciled at current pinned snapshots

The publish registry is a mixed collection, not one runtime family. The source map separates seven declared NexusEngine consumers (HorrorCorridor, TheOpenAbove, PrehistoricRush, MyCozyIsland, TheLongHaul, AcrossTheCanopy and TheLastBell); locally owned Nexus-style runtimes (Cavalry of Rome, Zombie Orchard and Into the Meadow); independent Three/WebGL/Canvas game implementations (including Phantom Command and The Unmapped House); and documentation-only/comparable-engine projects (AetherVale and ToyboxTorque). Reuse claims stay attached to their actual owner: corridor residency/sequence and Engine capability wiring; Long Haul truck/course/run/product kits; Canopy navigation/world/persistence/presentation imports; MyCozyIsland transactions/agriculture; local runtime rules remain local.

Primary files were re-read at exact current main commits and their blob SHAs reconciled to the existing source index. The Long Haul's lock resolves its manifest's mutable Engine `#main` specifier to Engine commit `8a60167fc945109408851c586a9355b1147438d5` and pins Three 0.165.0. PrehistoricRush's `runtime-versions.js` sets live module URLs to `main` while also storing a separate validated commit constant; those are not interchangeable pins. HorrorCorridor's active root route reaches BrowserGame and `createHorrorCorridorV2`; its composition pins Engine `a74e8689`. Current package/source identities are listed in `collections.jsonl:a11PublishedGamesPass138` and exact source refs in `sources.jsonl`.

No production URL or deployed bundle was inspected. Git source commits establish source identity only; they do not establish which bytes are currently deployed, actual browser behavior, or release acceptance. Historical build/browser records remain historical evidence with their stated scope. A11 is complete at the connector-only source/runtime ownership boundary, with deployment identity explicitly unresolved.

## Pass139 — A12 content factories classified by output and engine seam

The grouped factory sources produce assets, recipes, previews, or descriptors; those outputs are not themselves complete game loops. NexusFactory's Arcane Totem writes FBX/GLB and texture artifacts, while its Canvas2D preview and positive review fields do not prove that an exported model is loaded or played. NexusFactory-Kits provides typed artifact contracts, catalog/domain metadata and per-kit generation/validation/variation/export services; its sampled Ballista output is GLB and Reef output is a 2D PNG artifact. NexusFactory-Studio invokes registered services/viewers through a generic host; no automatic Engine/game-assembly handoff was established.

NexusEngine-TreeFactory is the clearest Engine-connected asset authoring seam: its Three app imports Engine, Engine Kits and ProtoKits, installs procedural object/tree kits and a Three render adapter, and exports JSON/GLB/PNG. It authors reusable tree/object payloads rather than composing a playable game. WorldFactory's pinned Unity-package manifest contains URP and FBX packages, while its Node-safe generator creates deterministic terrain recipes. BotanyFactory generates specimens/render artifacts for a Unity-first tree workflow; the custom specimen path evaluates supplied source with `new Function` and must not be treated as sandboxed. AviationFactory builds validated flight descriptors and estimated fuel/time; its Three pane assembles a visual aircraft preview, not flight physics. ShaderFactory and TextureFactory implement raw WebGL shader/texture recipe tools. CelestialFactory V2 combines local procedural/terrain/render kits with an optional legacy CDN loader; its Three renderer is a presentation adapter, not evidence that an Engine integration is always active.

A12 is complete at the pinned source/output ownership boundary. The useful reusable contracts are explicit output media types, deterministic recipes, validation/export boundaries, and Engine-to-renderer adapter seams. No factory was run; no exported asset was imported into a game or accepted based on its own preview, test label, or output metadata. See `collections.jsonl:a12ContentFactoriesPass139` and pinned receipts in `sources.jsonl`.


## Pass140 — A13 historical Unity roots pinned and classified

Grouped `gpt-6-luna` synthesis and exact commit-pinned connector reads classify the ten historical roots into legacy Unity Engine consumers, a shared sequence-source example, and asset/package work. Nine roots provide a declared/documented historical Unity NexusEngine seam; DiskGolf-XR and WindRider-8-24-Release share one identical `WaitForGoalHit` source blob that derives `NexusSequence` and completes from `Goal.OnGoalHit`. NexusAssets is an asset package and tool lane (local package version 1.0.33), not evidence of a standalone game family. These are historical Unity dependencies and do not establish support by the current JavaScript NexusEngine Core architecture.

All ten named root trees are complete at exact commits. The separate `LL_AssetPacks` tree remains truncated at 41,254 entries; three root manifests and Unity versions were read, but descendants are not exhaustively classified. No repository was cloned; no Unity build, test, scene, browser, device, or runtime was run. Selected manifests contain embedded credential-bearing URLs: the packet records their presence and omits the values. See `collections.jsonl:a13UnityRootsPass140` and the exact source receipts in `sources.jsonl`.


## Pass141 — Drive design documents are evidence of intent, not implementation

The frozen LittleReef v0.1 docs define a compact deterministic breeding loop: choose two distinct eligible parents, produce one seeded child, place it into a bounded nursery, evaluate a visible objective, and reject invalid operations atomically. The system specs make useful, testable requirements around matrix-authoritative state, fish identity, compatibility, capacity, lineage, and recovery. Economy, extended progression and advanced genetics are deferred. The game is described as Vite/vanilla JavaScript with Three.js presentation; no claim of current NexusEngine integration follows from the docs.

A later handoff reports a live service-oriented Three.js implementation, while also declaring that architecture unreconciled with frozen matrix authority and listing gameplay gaps. Its test/deployment statements remain self-reported. The Nexus WorldGen tracker describes a distinct Engine-rooted ECS + Three.js world-generation game and records 34/36 work items complete with two blocked validation gates; tracker counts and deployment/render assertions are not verified source evidence.

Grouped gpt-6-luna reads covered 15 LittleReef Docs; the primary agent directly read all five exact Nexus WorldGen tracker tabs after metadata confirmation. No code, tests, browser, deployment or runtime were inspected in this Drive batch. Exact IDs/statuses and scope are in `drive.jsonl` and `collections.jsonl:a14LittleReefAndWorldGenPass141`.

## Pass142 — Current project authority and status reconciliation

Current Drive materials were grouped by project/version and compared with exact source identities where available. Across the Canopy’s live tracker (revision 28) supersedes the Aug 22 workbook for current task/evidence state; it describes a narrow alpha with a failed start interaction and open issues, while its test/build/render statuses remain reported evidence. GoldRush’s master names `NexusEngine-GoldRush` as code authority; art/opportunity boards contain open work, not delivered capabilities. PrehistoricRush’s tracker pin is older than current main (`de44325b6b604a4e3cbed9ed4a22b232bf9812cb`), and its Engine-owned convention is not integration proof.

The Quest Device Twin is a deterministic device/tooling simulator with explicit non-goals around Quest hardware and provider validation. NexusVoice is a separate Unity/TTS tool lane with package/runtime/licensing gates still open. NexusEngine 0.0.10 materials authorize planning only; exact current Engine main remains `a74e8689d1a71c0b42236c009f0f4c46e9b89387`. RAWG report artifacts describe a separate corpus-authoring workflow and include accepted requests without runtime proof.

NexusWorldGen’s tracker’s reported run `33285987471` matches the audited main commit `72d6c9f2325d162ba986ca828095d9abbd99fe71` and completed successfully. Run `33285598780` was the preceding successful deployment of `2537ed2d50a36f840254180d08493b9c1e3850de`; both are consecutive deploys, resolving the earlier apparent disagreement. Neither deployment metadata alone verifies all tests described in README. Refer to `collections.jsonl:a14GroupedDriveAuthorityPass142` and `a15CrossSourceAuthorityPass142` for exact Drive revisions and repository pins.

## Pass143 — audit completion and evidence limits

All 18 areas are closed to their scoped evidence boundary. The one stored broad Drive cursor returned HTTP 400 `Invalid Value` when resumed; this is recorded as an access/discovery limitation, not a search miss. The exact-title filter had no further page. No private/missing repository identity was inferred from 404 or empty responses, and the 392-repository baseline was not rerun. The remaining 68 metadata-only Drive rows each have an explicit disposition; 106 folder pointers remain folder pointers, and one partial historical document retains its documented limit. The capability map includes only source-backed claims, while runtime support remains unproven unless there is matching execution evidence.
