# Review of all 50 final candidates

Read-only review of all 50 stored plans, recipes and review records against the shared runtime on 2026-09-12. This is source/evidence analysis, not 50 new human playthroughs. Generated games and harness code were not changed.

## What the existing labels mean

All final50 candidates have stored automated PASS results. The browser lists every historical campaign together: currently 147 runs, 131 PASS, 13 FAIL, 3 CANCELLED. The 13 failed runs comprise six LM Studio grammar errors, three final text-validation errors, one unsupported pickup goal, and three browser-check failures involving resources, upgrades or orbit contact. Earlier attempts inside these runs may contain additional findings. Old PASS records belong to old source revisions.

## Why they feel alike

- All 50 use open layout, the same rectangular arena, controls, shapes, fixed duration and timer/health ending.
- 22 component combinations and 39 configured mechanical profiles (excluding seed, prose and palette); 17 root sets and 21 titles. These counts do not measure distinct player experiences.
- 29 use orchid palette; Resource Run occurs 13 times. 46 use movement speed 150 or 200.
- Collection: scatter 27, trail 0. Pursuit: chase 19, orbit 0. Territory: hold 24, activate 0. Resources: rest 22, refill 0. Delivery: depot 30, relay 1. Progression: speed 20, shield 7.
- Depth 1 intentionally forces defaults (17 runs); depth 2 offers alternatives (17); depth 3 adds narrow numeric ranges (16). Even expanded runs mostly select defaults.
- 31 have no pursuit and therefore no implemented health-loss source. All games award passive score every eight seconds. Waiting can earn progression thresholds; standing in a territory site can repeatedly score after cooldown. Current tests do not assess these incentives.
- Goal and role strings do not drive gameplay. Planner integration mostly survives as prose; code wires a fixed set of interactions. Collection fills delivery cargo, pickups can refill resources, and score unlocks player upgrades, but the AI cannot choose new relationships.
- Islands/lanes mainly change spawn arrangement and lane decoration. They do not provide traversable islands, walls or navigational constraints.

## All 50, by actual components

All rows have historical automated PASS. The final column is this source-based design review, not a replacement test result. Numeric values below mean count for scatter/chase, delivery reward, hold seconds, resource drain, or upgrade threshold.

| ID | Title | Depth | Actual components and values | Goal shown to player | Design finding |
|---|---|---:|---|---|---|
| final50-001 | Maze Runner | 1 | progression: speed 4; collection: scatter 9; delivery: depot 5 | Earn upgrades through play | Maze and path unlocking are absent. |
| final50-002 | City Scavenger | 2 | resources: rest 2; delivery: depot 5; collection: scatter 9 | Collect scattered items while managing resources | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-003 | Scavenger Run | 3 | collection: scatter 12; delivery: depot 3; territory: hold 1 | Secure territories while gathering items. | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-004 | Resource Run | 1 | resources: rest 2; collection: scatter 9; delivery: depot 5 | Score points using collected items | Premise promises progression through levels; no level sequence exists. |
| final50-005 | Gather and Progress | 2 | collection: scatter 9; progression: speed 4; resources: rest 2 | Increase score using a collection of scattered objects | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-006 | City Run | 3 | progression: shield 5; delivery: relay 3; resources: rest 1 | Earn two upgrade layers and 3 points | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-007 | City Quest | 1 | pursuit: chase 2; delivery: depot 5; collection: scatter 9 | Reach the final checkpoint | Final checkpoint is absent. |
| final50-008 | Pursuit Plan | 2 | pursuit: chase 2; progression: speed 4; resources: rest 2 | Avoid opponents that threaten health while earning upgrades through play | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-009 | City Challenge | 3 | resources: rest 1; progression: shield 5; territory: hold 3 | Earn upgrades through play | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-010 | City Run | 1 | delivery: depot 5; pursuit: chase 2; progression: speed 4 | Score points by navigating traffic | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-011 | Scatter and Secure | 2 | collection: scatter 9; territory: hold 2; delivery: depot 5 | Complete five-minute tasks | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-012 | Maze Runner | 3 | progression: shield 5; territory: hold 3; collection: scatter 12 | Earn upgrades through play | Maze and shifting obstacles are absent. |
| final50-013 | Resource Run | 1 | territory: hold 2; collection: scatter 9; pursuit: chase 2 | Complete a five minute mission | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-014 | Resource Run | 2 | pursuit: chase 2; delivery: depot 5; collection: scatter 9 | Gather items and escape threats | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-015 | Resource Run | 3 | delivery: depot 3; pursuit: chase 1; collection: scatter 5 | Gather as many items as possible in five minutes | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-016 | Scatter and Secure | 1 | collection: scatter 9; territory: hold 2; pursuit: chase 2 | Collect objects to increase score while occupying territory to avoid threats | Territory capture does not provide protection from enemies. |
| final50-017 | Resource Run | 2 | collection: scatter 9; pursuit: chase 2; resources: rest 2 | Gather items to increase score. | Pursuit role describes points instead of enemy damage. |
| final50-018 | City Run | 3 | territory: hold 1; collection: scatter 5; progression: shield 2 | Collect resources and earn upgrades in five minutes | Premise suggests obstacles; no enemies or obstacle geometry. |
| final50-019 | Resource Run | 1 | resources: rest 2; delivery: depot 5; territory: hold 2 | Collect resources to sustain life | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-020 | Arena Balance | 2 | territory: hold 2; progression: speed 4; pursuit: chase 2 | Secure territory and earn progression. | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-021 | Resource Run | 3 | resources: rest 1; territory: hold 3; progression: speed 2 | Complete a five minute level using roll mechanics | Premise promises progression through levels; runtime has one arena. |
| final50-022 | Pursuit | 1 | pursuit: chase 2; territory: hold 2; delivery: depot 5 | Avoid health loss while moving through territory. | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-023 | Scatter and Collect | 2 | collection: scatter 9; progression: speed 4; delivery: depot 5 | Gather scattered objects to boost scores | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-024 | City Scavenger | 3 | territory: hold 1; delivery: depot 3; collection: scatter 5 | Collect scattered objects to increase progress and rewards. | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-025 | City Quest | 1 | delivery: depot 5; progression: speed 4; territory: hold 2 | Collect resources and advance territory | No obstacle geometry; territory is not a safe zone. |
| final50-026 | Scavenger Run | 2 | territory: hold 2; delivery: depot 5; collection: scatter 9 | Collect scattered objects to complete the mission. | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-027 | City Run | 3 | delivery: depot 3; territory: hold 1; pursuit: chase 1 | Complete a five minute city challenge | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-028 | City Scavenger | 1 | delivery: depot 5; progression: speed 4; collection: scatter 9 | Collect items and reach a final point | No final-point completion condition or obstacles. |
| final50-029 | City Run | 2 | resources: rest 2; progression: speed 4; delivery: depot 5 | Complete a five-minute city challenge | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-030 | Gather and Progress | 3 | collection: scatter 5; delivery: depot 3; progression: shield 2 | Collect items to build upgrades | Upgrades alter the player; no stage sequence. |
| final50-031 | Scatter and Collect | 1 | collection: scatter 9; delivery: depot 5; pursuit: chase 2 | Gather scattered objects for score | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-032 | City Delivery Run | 2 | territory: hold 2; pursuit: chase 2; delivery: depot 5 | Deliver essentials while avoiding threats | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-033 | Five Minute Run | 3 | collection: scatter 10; resources: rest 3; progression: speed 2 | Gather items and earn speed upgrades | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-034 | Resource Run | 1 | delivery: depot 5; territory: hold 2; resources: rest 2 | Complete five missions | No five-mission objective or mission counter. |
| final50-035 | Scatter and Survive | 2 | collection: scatter 9; resources: rest 2; progression: speed 4 | Gather items to increase score. | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-036 | Resource Sprint | 3 | pursuit: chase 1; progression: shield 5; resources: rest 3 | Complete a five minute roll to earn upgrades | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-037 | Resource Run | 1 | resources: rest 2; pursuit: chase 2; delivery: depot 5 | Reach the destination safely | Role says chase opponents, but opponents chase the player; destination does not end the game. |
| final50-038 | Resource Run | 2 | delivery: depot 5; resources: rest 2; pursuit: chase 2 | Gather all resources to survive | Pickups respawn; gathering all is not a survival/win condition. |
| final50-039 | Scatter and Survive | 3 | collection: scatter 10; resources: rest 3; pursuit: chase 1 | Collect as many items as possible while avoiding threats | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-040 | Maze Quest | 1 | progression: speed 4; collection: scatter 9; territory: hold 2 | Uncover hidden paths | No maze or hidden-path system. |
| final50-041 | Pursuit | 2 | pursuit: chase 2; territory: hold 2; progression: speed 4 | Avoid opponents that threaten health | Pursuit role says resource management instead of avoiding contact damage. |
| final50-042 | Resource Run | 3 | progression: shield 5; pursuit: chase 1; resources: rest 2 | Earn upgrades while avoiding threats | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-043 | City Survival | 1 | progression: speed 4; resources: rest 2; collection: scatter 9 | Collect resources and maintain health | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-044 | Resource Run | 2 | territory: hold 2; progression: speed 4; delivery: depot 5 | Complete a five minute mission using available domains | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-045 | Cargo Run | 3 | delivery: depot 3; progression: speed 5; territory: hold 1 | Complete a five-minute roll to earn upgrades | Existing actions support the general idea; displayed goal still does not define an executable success condition. |
| final50-046 | City Survival | 1 | territory: hold 2; delivery: depot 5; resources: rest 2 | Secure all marked locations | Captures repeat after cooldown; securing all sites does not end the run. |
| final50-047 | Scatter and Secure | 2 | progression: speed 4; collection: scatter 9; territory: hold 2 | Collect items to unlock territory upgrades | Upgrades affect the player, not territory. |
| final50-048 | City Quest | 3 | delivery: depot 3; resources: rest 1; collection: scatter 5 | Collect all scattered items | Pickups respawn; collecting all does not complete the run. |
| final50-049 | City Builder Challenge | 1 | delivery: depot 5; territory: hold 2; progression: speed 4 | Complete five missions using available domains | No building system or five-mission objective. |
| final50-050 | Resource Run | 2 | delivery: depot 5; resources: rest 2; progression: speed 4 | Earn upgrades through play | Existing actions support the general idea; displayed goal still does not define an executable success condition. |

## Smallest useful next design

Keep independent domain rolls. Add one profile-curation stage inside NexusArcade-Harness after expansion and before assembly. Give it structured controls for objective, movement/action choices, physical arena structure, pacing, pressure, domain-to-domain rules and presentation. Inputs can be Auto or explicitly selected; implementation must exist for every admitted choice.

The profile must record action, target, measurable success/failure, supported component IDs, settings, and explicit links between components. Generate the instructions from those same rules. Distinguish new implementation work (walls, exit objectives, cargo penalties, pacing) from options already present (enemy count, resource drain, palette).

Use heuristics to suggest underused supported choices after the independent root roll, and let LFM Thinking integrate them. Compare mechanical signatures, not titles. Keep the recent signature counts and verified stage lessons in compact contextual state. Do not silently replace a difficult roll.

Keep Complexity and Generate as hero controls. An advanced profile foldout can group Goal, Controls, Arena, Challenge, Pacing and Look, with Auto defaults. Preserve the user's manual-game-edit prohibition: all future candidates still go through the harness.

Validation must separately report Runs correctly, Matches profile, and Variety; human play review remains separate. Verify the profile's actual success/failure condition, component links, player instructions, idle scoring incentives, and differences from recent games. Preserve historical cohort labels and make their grouping visible in the UI.
