# Spatial composition capability map

Pinned NexusEngine Core: `a74e8689d1a71c0b42236c009f0f4c46e9b89387`.
The 467-file import closure (743 KB before license/manifest) is copied unchanged
under vendor/nexusengine. UPSTREAM.json records source paths and SHA-256 hashes.
Only required executable imports and their manifest dependencies are included.

| Owner | Installed capability | Used for |
|---|---|---|
| Upstream n:simulation:motion:locomotion | action-locomotion-kit | Player position, velocity and grounded movement |
| Upstream n:interaction:environmental-affordance | environmental-affordance-kit | Instant activation and sustained interaction progress |
| Upstream n:interaction:assistance-target | assistance-target-kit | Attach and complete carried cores |
| Upstream n:interaction:transfer-zone | transfer-zone-kit | Receiver location and accepted subject type |
| Upstream n:simulation:progression:lifecycle | lifecycle-progression-kit | Persistent completion and prerequisite enforcement |
| Local optional n:arcade-composition | kits/scene-kit.mjs | Spatial support, connections between the upstream services, input intent routing, deadline, extraction and reset |
| External renderer provider | player.mjs / Three.js 0.184.0 | Meshes, materials, lighting, camera, sound and UI; reads domain state |

The local kit is newly authored, reusable integration code registered through
NexusEngine defineDomainServiceKit. It is not claimed to be upstream Core or a
published NexusEngine-Kits package. No upstream source was modified.

Concept branches express connection, growth, migration, memory, exchange, patience,
order and care as supported activation, sustained restoration or transport actions.
The heuristic expander assembles spatial trees and prerequisite DAGs. The planner
selects and interprets a candidate. The writer authors presentation metadata;
executable instructions are compiled from the accepted composition.

Missing capabilities remain outside this implementation: arbitrary geometry synthesis,
combat, dynamic ecosystems, freeform physics puzzles, authored character animation,
external art packs, arbitrary user code, and AAA-quality certification. The engine's
larger catalog is not advertised as executable solely because its manifests exist.

Objective closures now include network restoration, expedition and recovery. Required
anchors always represent all three rolled concepts, and prerequisite/route closure adds
supporting anchors. Expedition can finish at a destination; other closures return home.
Prerequisites can create walkable bridge surfaces. Missing surfaces block movement until
completion; the renderer reads the same completion state to reveal those surfaces.

Movement is grounded on planar platform/bridge surfaces. Meshes and cameras are 3D,
but free vertical traversal and rigid-body physics are not implemented in this kit.
