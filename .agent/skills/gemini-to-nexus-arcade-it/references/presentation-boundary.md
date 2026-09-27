# Presentation Boundary

The converted game must distinguish authoritative Nexus truth from renderer/view state.

## Rule

> Three.js may own rendering state; it may not own authoritative gameplay state.

## Three.js may own

- scene graph objects;
- meshes and geometry;
- materials and textures;
- shaders and uniforms;
- visual interpolation;
- particles and their visual lifetime;
- camera smoothing;
- visual-only animation;
- renderer resources;
- projected labels and other view artifacts.

## Three.js must not own

- health;
- score/currency/resources;
- objective/progression truth;
- world occupancy;
- entity existence when it affects gameplay;
- weather truth;
- inventory/cargo truth;
- collision/game-rule truth;
- win/loss;
- authoritative timers.

A renderer object may carry an ID/reference for lookup, but its `userData`, transform, material, or existence must not become the hidden source of game truth unless that exact ownership is explicitly part of a verified Nexus contract.

## Correct projection

```text
Nexus authoritative state
        ↓
queries/events/snapshot
        ↓
presentation descriptors / view model
        ↓
Three.js adapter
        ↓
mesh/material/audio/UI
```

## Example: weather

Wrong:

```text
rainParticleSystem.visible
        ↓
game decides it is raining
```

Correct:

```text
World weather state = raining
        ├─ gameplay consumers
        └─ presentation projection
              ↓
          rain particles
```

## Example: placed object

Wrong:

```text
if mesh exists, tile is occupied
```

Correct:

```text
World/Object state says occupied + object instance exists
        ↓
renderer creates/updates mesh
```

## Presentation parity

Preserve recognizable visual identity where accepted:

- composition and camera;
- important colors/material language;
- readable HUD;
- meaningful feedback timing;
- iconic geometry/models;
- audio cues;
- important VFX.

Architectural migration does not justify unnecessary visual redesign.
