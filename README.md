# Nexus Arcade

For the local domain-roll experiment UI, see [NexusArcade-Harness](NexusArcade-Harness/README.md).
Its ignored game outputs and evidence live in `NexusArcade-Experiments/`.
The installer and legacy generation entry points below remain available.

`@luminarylabs/nexus-arcade` is the shared installer for the public Nexus Arcade catalog. It reads a small, versioned registry and installs integrity-pinned browser games through jsDelivr.

The package has two adapters:

- `@luminarylabs/nexus-arcade/browser` stores verified files in Cache Storage and launches them from same-origin virtual URLs handled by a service worker.
- `@luminarylabs/nexus-arcade` stores verified files on disk and serves them over local HTTP for cabinets and kiosk Chromium.

## Browser

```js
import { ArcadeLibrary, BrowserInstaller, ArcadePlayer } from "@luminarylabs/nexus-arcade/browser";

const library = new ArcadeLibrary();
const games = await library.load();
const manifest = await library.getManifest(games[0]);
const sessionId = crypto.randomUUID();
const installer = new BrowserInstaller({ sessionId });
await installer.install(manifest, console.log);

const player = new ArcadePlayer(document.querySelector("iframe"));
player.play(manifest);
```

Browser installs are temporary by default. The adapter stores executable files only in validated `nexus-arcade-game-*` Cache Storage entries. `remove()`, `removeStaleSessions()` and session-release messages delete only those assets and `nexus-arcade-installed` metadata; game saves in other localStorage keys or IndexedDB are preserved.

On page exit, a client may release its validated session through the service worker:

```js
const games = installer.storage.releaseSessionMetadata(sessionId);
navigator.serviceWorker.controller?.postMessage({
  type: "NEXUS_ARCADE_RELEASE_SESSION",
  sessionId,
  games,
});
```

The service worker derives every cache name from a validated game ID and semantic version. It never accepts a caller-supplied cache name. Run `removeStaleSessions(sessionId)` during startup to recover from crashes and interrupted exits.

The future save bridge uses validated messages shaped as `{ type: "nexus-arcade:save", gameId, slot, schemaVersion, payload }` and `{ type: "nexus-arcade:load", gameId, slot }`. Until a game adopts that bridge, its existing same-origin localStorage or IndexedDB data remains untouched by asset cleanup.

Register the service-worker module from a same-origin service worker file. See the Website repository's `/nexus-arcade/sw.js` integration.

## Node

```js
import { NodeInstaller, createLocalGameServer } from "@luminarylabs/nexus-arcade";

const installer = new NodeInstaller({ destination: "/var/lib/nexus-arcade" });
const games = await installer.library.load();
await installer.install(games[0].id, console.log);

const server = await createLocalGameServer({ root: "/var/lib/nexus-arcade" });
console.log(server.url);
```

Node 20 or newer is required. The installer implementation has no runtime dependencies. The optional generation entry point uses Three.js and, for browser validation, Playwright.

## Security model

- Registry metadata is accepted only from the exact public Nexus Arcade registry path.
- Game files must use an explicitly allowed repository and a full commit SHA.
- Absolute paths, traversal, encoded traversal and backslashes are rejected.
- Every downloaded file must match its declared byte length and SHA-256 digest before activation.
- Failed installs are discarded without replacing the last working version.

## Development

```sh
npm test
npm run build
npm pack --dry-run
```

## Earlier standalone generator (experimental)

`@luminarylabs/nexus-arcade/generation` is a separate Node-only factory. It uses
an existing local LFM 350M service, strict decision schemas, seeded creative
inputs, resumable batches, and one deterministic Three.js arena builder.
The browser installer does not import the generation system.

```sh
npm install
npx playwright install chromium
node generation/cli.mjs doctor --server-url http://127.0.0.1:18081
node generation/cli.mjs batch --workspace ./arcade-work --id first-batch --seed 73019 --count 3
```

The initial sandbox implementation passed the unit/integration suite and live
model design/assembly checks. Chromium was blocked by the execution environment's
process-socket permissions: gameplay, screenshots, and video remain unverified.
Generated candidates are not certified arcade releases.

See [the complete generation guide](generation/README.md),
[architecture](generation/ARCHITECTURE.md), and
[validation record](generation/VALIDATION.md).


## Reliable Arcade Factory (active development)

`NexusArcade-Harness/` owns the current local LM Studio workflow: LFM2.5
Thinking 1.2B plans; LFM2.5 VL 3B writes bounded presentation choices and reviews
actual images. Generated games contain data composed with pinned NexusEngine
adapters and Three.js. Models do not write executable gameplay scripts.

```sh
node NexusArcade-Harness/cli.mjs factory-check
node NexusArcade-Harness/server.mjs
# Open http://127.0.0.1:4318
node NexusArcade-Harness/cli.mjs assemble-scene --profile /absolute/path/scene.json
node NexusArcade-Harness/cli.mjs scene --id unique-idea-id --profile /absolute/path/scene.json
```

A playable scene profile has five fields: `version: 1`, `scene`, `presentation`,
`replayReason`, and `validationPlan`. The scene contains catalog behavior
selections, domain instances and typed connections, movement/collision adapters,
and session rules. Presentation selects a supported palette and camera, labels
and tones for domain presenters, and up to four progress readouts. Validation
steps use only bounded `move`, `interact`, and `wait` actions; the current browser
plan supports walking compositions. See `scene-spec.mjs`, `catalog-compiler.mjs`
and `kits/scene-presentation.mjs` for the closed contracts.

The shared presenter builds physical prefabs and collision footprints from the
same placement data. Actual domain state drives valve orientation, stored liquid,
flow connections, progress, endings and records. Keyboard taps are retained until
simulation consumes them; pause, focus loss and restart clear pending input.

To repair a development idea, add `--retry-of prior-id --repair-reason "specific
shared correction"` to `scene`. It retains the original 25-minute clock, seed,
concept selections and required intent. Expired ideas cannot be repaired by
renaming them. Fix shared source or profile input through the harness; never edit
files in a generated game. `cleanup-failed --id failed-id --apply` removes only
unreferenced failed launch files and preserves diagnostics/runtime dependencies.

The arcade's ordinary Generate button still uses the earlier pilot path. Generic
scene generation is an explicit development CLI path until catalog sampling,
repair and full acceptance are integrated. A preview PASS is not acceptance:
G02 foundation work remains open, later goals remain gated, and accepted count
must come from the campaign index. Software WebGL checks, model observations,
independent image inspection and target-device performance are separate evidence.

To expand supported presentation choices before inference, use
`node NexusArcade-Harness/cli.mjs roll-scene-layers --lists /absolute/path/lists.json --seed 12`.
Each list contains `pointId` and `options`; each option contains `optionId` and
`parameters`, whose values are nonempty lists of allowed choices. Currently
supported bindings are `materials.luminous-standard` (`roughness`, `metalness`)
and `lighting.directional-fog` (`exposure`, `fogDensity`). Every supplied value is
validated against the master catalog, including values the seed does not select.
Retain the returned seed, lists and hashes; place its `resolved` list in a playable
profile's optional `layers` field. Compilation stores the resolved settings and
bindings, and the renderer applies them to actual materials, exposure and fog.
Unsupported layers are rejected. These changes do not establish distinct gameplay
or visual novelty. Personal records include the full presentation configuration,
so a visibility change cannot reuse a record set under different conditions.
