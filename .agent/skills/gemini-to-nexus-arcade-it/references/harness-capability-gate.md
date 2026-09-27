# Harness Capability Gate

After mapping source behavior to Nexus ownership, compare every requirement against the current NexusArcade Harness.

Use exactly one classification for each requirement.

## A — Existing Harness capability

The Harness already exposes a trusted capability that matches the required semantics.

Action: reuse it. Do not fork or duplicate it.

Examples may include current trusted graph primitives such as controls, objectives, checkpoints, delivery, valves, or flow capabilities. Verify the current registry before claiming support.

## B — Core-supported, Harness bridge missing

Nexus Core owns and implements the mechanism, but NexusArcade does not expose the required bridge/composition capability.

Action: add the smallest generic reusable NexusArcade adapter/binding/domain-service integration over the pinned Core capability.

Requirements:

- product-neutral name;
- closed typed settings;
- explicit inputs/outputs;
- deterministic lifecycle/reset/snapshot behavior as applicable;
- no game-specific labels/rules embedded in the shared primitive;
- proof that it uses the intended Core authority.

Bad: `arboria-tree-domain`.

Better: a generic vegetation/placement bridge if those semantics are actually supported by pinned Core.

## C — Core mechanism exists; generic composition primitive missing

The needed truth belongs to an existing Core mechanism, but the Harness graph lacks a reusable primitive to compose it.

Action: add a generic graph/composition primitive, keeping authored game values in the game profile.

Example shape only:

```text
resource
inputs: add, spend
outputs: amount, affordable
```

Do not encode game names such as `sunEnergy` in shared Harness code.

## D — Presentation only

The behavior does not own gameplay truth.

Examples:

- mesh sway;
- rain particles;
- water waves;
- floating score text;
- camera smoothing;
- visual interpolation;
- decorative ambient wildlife.

Action: keep downstream of Nexus state/events in presentation/rendering. Do not create a gameplay Domain simply to animate it.

## E — Genuine Core gap

Neither current NexusArcade nor verified current NexusEngine can represent the required product-neutral capability.

Action: stop Core implementation under this skill.

Document:

- required capability;
- source behavior that requires it;
- why existing Arcade capabilities are insufficient;
- why current Core cannot express it;
- proposed Core owner;
- minimum contract/proof needed.

A separate `LuminaryLabs-Dev/NexusEngine` authorization is required.

## Required capability matrix

Before implementation, produce:

| Source | Behavior | Current owner | Nexus owner | Harness status | Decision |
|---|---|---|---|---|---|

Allowed decisions:

- REUSE
- REPLACE
- DECOMPOSE
- ADAPT
- EXTEND_HARNESS
- GAME_DATA
- PRESENTATION_ONLY
- BLOCK_CORE_GAP
- REMOVE

Do not implement while a required row has UNKNOWN ownership.
