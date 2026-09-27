# Behavior Contract

The behavior contract is the player-facing acceptance baseline for the conversion.

## Record player verbs

Separate actions into:

- **gameplay verbs** — actions that mutate game meaning;
- **selection/input verbs** — choose targets, tools, modes, directions;
- **presentation controls** — camera, fullscreen, audio, quality;
- **system controls** — start, pause, resume, restart, load.

Do not turn every button into a gameplay domain.

## Record accepted behavior

For each important behavior, capture:

- preconditions;
- player action;
- authoritative state change;
- visible/audible feedback;
- objective/progression consequence;
- timing/cooldown if relevant;
- failure/rejection behavior;
- reset/replay expectation.

Example shape:

| ID | Preconditions | Action | Truth change | Feedback | Acceptance |
|---|---|---|---|---|---|
| B01 | free target + enough resource | perform action | resource decreases, object created | mesh/audio/UI update | exact cost and object creation observed |

## Classify source state

Every mutable source value belongs to exactly one category:

1. **Authoritative gameplay state** — changes what is true in the game.
2. **Derived state** — can be recomputed from authoritative state.
3. **Input state** — current player intent or edge/axis state.
4. **Presentation state** — visual/audio policy that does not determine gameplay truth.
5. **Transient effect** — particles, toast lifetime, interpolation, screen shake.
6. **Configuration** — authored constants, names, costs, thresholds, tuning.
7. **External/platform state** — browser focus, storage, network, host state.

DOM nodes, Three.js meshes/materials, and renderer transforms are not authoritative by default. If source code uses them as authority, note that as a migration problem.

## Trace mixed functions

For each large source function, decompose its causal responsibilities.

Example:

```text
Source action()
├─ validates target
├─ checks resource
├─ spends resource
├─ mutates world
├─ creates entity
├─ changes progression
├─ emits sound/UI/VFX
└─ checks completion
```

The Nexus conversion should split these by owner rather than renaming the monolith.

## Authority conflicts

If the running source contradicts an explicit accepted design decision, record both. The user's current explicit instruction or accepted design decision controls; do not silently preserve a known source bug.

## Parity IDs

Give accepted behaviors stable IDs. The final parity report must evaluate the same IDs against the converted game.
