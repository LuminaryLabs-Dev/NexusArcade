# Source Audit

Use this reference before changing a Gemini-generated game.

## Goal

Establish what the supplied game actually is and what it actually does. The source may be poorly structured, but it is still evidence. Do not redesign from memory or from the prompt alone.

## Freeze source identity

Record:

- source ID or task-local name;
- exact file list, archive hash, repository commit, or supplied attachment identity;
- entry point;
- local runtime command and URL;
- browser viewport used for baseline evidence;
- external scripts, CDN imports, fonts, images, audio, models, and network calls;
- storage dependencies such as localStorage or IndexedDB;
- randomness/time sources;
- known user-approved behavior changes or known bugs.

Do not silently replace CDN versions, source assets, or source behavior before the baseline is captured.

## Inspect the code

For HTML/JavaScript/Three.js sources, locate:

- inline and external JavaScript;
- global mutable objects/arrays/scalars;
- event listeners and input bindings;
- requestAnimationFrame loops and clocks;
- timers, cooldowns, intervals, promises, async work;
- DOM elements used as game state;
- Three.js scene/camera/renderer/control setup;
- mesh `userData` or renderer objects carrying gameplay data;
- collision/raycast logic;
- entity creation/destruction;
- resource, score, health, objective, progression, inventory, world, weather, and persistence state;
- audio/VFX triggers;
- win/loss/restart behavior;
- network/storage side effects.

Search broadly first; then trace the functions that mutate important state.

## Run the original

Serve the exact source over localhost when browser APIs require HTTP. Exercise every discoverable primary control and at least one complete gameplay route when possible.

Capture:

- initial frame;
- controls and hotkeys;
- player verbs;
- camera behavior;
- world/level layout;
- HUD and feedback;
- state transitions;
- timers and resource changes;
- success/failure behavior;
- reset/restart;
- console errors;
- failed network requests;
- unexpected external dependencies;
- representative before/after screenshots.

Do not use screenshots as a substitute for state/behavior inspection.

## Output

Produce a Source Identity block and a Source Findings block. Mark unknowns explicitly. Continue to the behavior contract only after the original is runnable or the exact blocker is documented.
