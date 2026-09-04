# Nexus Arcade

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
const installer = new BrowserInstaller();
await installer.install(manifest, console.log);

const player = new ArcadePlayer(document.querySelector("iframe"));
player.play(manifest);
```

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

Node 20 or newer is required. The package intentionally has no runtime dependencies.

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
