# Arcade generation

A local, Node-only game factory owned by NexusArcade. LFM supplies constrained
creative/design decisions. A tested-source builder assembles one arena family.
This is configuration-driven production, not arbitrary model-written JavaScript
or a general autonomous programming agent.

## Current status

The first release has live LFM design/assembly evidence and passing deterministic
tests. Browser startup was prohibited in the implementation sandbox, so gameplay
validation and recording are **BLOCKED** there. No physical cabinet validation
has been performed. Do not advertise the candidates as validated games.

## Requirements

- Node.js 20 or newer, npm, and enough local disk space for run evidence.
- The approved LFM2.5-350M-heretic-high-reasoning.Q8_0.gguf model (379,218,272 bytes;
  SHA-256 `b0bd59bbb030aab7754eafc4c75a72737d2596e0615fe660e0281881537ed316`).
- A compatible llama.cpp HTTP service bound to localhost. The tested runtime was
  the pinned Ubuntu x64 CPU b10663 build. ARM and cabinet performance are unproven.
- Optional Playwright dependency plus its Chromium/FFmpeg downloads for full
  browser acceptance and videos. `npm install --omit=optional` permits model
  design and assembly, but browser validation returns BLOCKED.

Acquire the approved model through your existing LFM setup workflow. The factory
never downloads models, copies credentials, or starts an unknown executable.
For an already verified runtime/model:

```sh
llama-server -m /absolute/path/LFM2.5-350M-heretic-high-reasoning.Q8_0.gguf --host 127.0.0.1 --port 18081 -c 4096
npm install
npx playwright install chromium
node generation/cli.mjs doctor
```

`doctor` checks the configured service's reported model identity, not its weight
file hash. Verify the weights independently before trusting an existing service.
Use `--server-url` to change the localhost port. Remote and credential-bearing
URLs are rejected. Advanced hosts can set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`
to an existing compatible browser; this does not override host permissions.

## Commands

```sh
# Generate/refine ideas and complete structured game specifications.
node generation/cli.mjs ideas --workspace ./arcade-work --id concepts --seed 73019 --count 3

# Build candidates with static validation; no claim of gameplay acceptance.
node generation/cli.mjs assemble --workspace ./arcade-work --id candidates --seed 73019 --count 3

# Full pipeline: model -> assembly -> browser proof -> local admission -> draft post.
node generation/cli.mjs batch --workspace ./arcade-work --id full-batch --seed 73019 --count 3

# One game; otherwise identical to the full batch path.
node generation/cli.mjs build --workspace ./arcade-work --id one-game --seed 99

node generation/cli.mjs status --workspace ./arcade-work --id full-batch
node generation/cli.mjs cancel --workspace ./arcade-work --id full-batch
node generation/cli.mjs resume --workspace ./arcade-work --id full-batch
node generation/cli.mjs benchmark --output ./selection-benchmark.json
```

Global limits can be lowered or explicitly configured through `--max-calls` and
`--max-ms`. Defaults: 3 games, 1 concurrent job, 60 model calls per game, 20 minutes
from the first start of each game, up to 3 attempts per decision, 2 permitted game
repair cycles. The persisted deadline includes interruption/downtime. A stopped
operation cannot obtain another budget merely by resuming.

Cancellation is observed at request/stage boundaries; an in-flight HTTP request
has a maximum 45-second timeout. Browser playthrough is bounded at 180 seconds;
cancellation during that stage is reconciled after it returns.

`assemble` and `ideas` do not enter the accepted catalog. To validate an already
assembled specification programmatically, use `validateGame` from
`generation/validation/report.mjs`, then `admit` only with its genuine passing
report. The CLI full-batch path does this automatically for new full runs.

## Workspace records

All runtime files live beneath the selected workspace:

| Path | Contents |
| --- | --- |
| `batches/<id>.json` | Batch inputs, generator fingerprint, job IDs, summary |
| `runs/<id>/job.json` | Stage state, locked specification, model requests/responses, decisions, budgets |
| `runs/<id>/candidate/` | Assembly-only candidate |
| `runs/<id>/attempt-N/game/` | Immutable attempt source |
| `runs/<id>/attempt-N/evidence/` | Validation report, screenshots, video when available |
| `games/<id>/` | Accepted local game bytes only |
| `releases/<id>.json` | Specification and acceptance evidence |
| `catalog.json` | Accepted local inventory |
| `drafts/<id>.json` | Unpublished draft copy linked to evidence |
| `supply-history.json` | Bounded recent creative supply selections |
| `cancel/<batch>.json` | Per-batch cancellation request |

Use a dedicated workspace, not an existing document or application directory.
IDs cannot contain paths. The writer lock rejects competing processes. Stale
locks are recovered only when the recorded process is absent; a corrupt lock or
abandoned lock-recovery marker stops with an explicit error for inspection.
Process restart recovery is covered; physical power-loss durability is not.

Batch IDs are idempotency keys. Different count/seed/goal needs a new ID. Source
changes invalidate resume; use a new batch ID instead of silently mixing versions.
A model response interrupted before checkpointing may need repetition, but its
reserved call remains charged. Quarantined/exhausted jobs do not retry indefinitely.

## Game family

Three-stage arena objectives with keyboard/gamepad movement, moving hazards,
resource pressure, win/fail, restart, pause, and procedural audio. Supported modes:

- `hold`: restore each station by interacting nearby.
- `deliver`: collect a central supply, carry it, then interact at a station.
- `sequence`: activate the stations in numbered order.

Three.js owns presentation. Exact copied NexusEngine components own seeded random
numbers, resource meters, and pressure channels. Arcade owns all game-specific
composition and rules. See `builders/dependencies.lock.json` and vendor notices.

A sampled seed plus the same pool/history reproduces the creative inputs. It does
not guarantee identical inference. Saved raw responses and decisions preserve the
actual run. Word/combination diversity is a heuristic, not proof of originality.

## Improving the harness

Keep a fixed evaluation set. Compare raw schema acceptance, semantic correctness,
repairs, calls, latency, and final game evidence independently. Never count
fallback text as model success. Never self-edit the running harness. Apply reviewed
improvements to source, run tests, then start fresh batches with the new fingerprint.

The provided 20-case benchmark measures narrow constrained selection. It does not
measure creative quality, game completeness, retention, or commercial readiness.
Game naming and prose remain subject to editorial review. Model-written invitation
text is explicitly a draft; only the deterministic description uses verified facts.

## Verification

```sh
npm test
npm run test:generation
npm pack --dry-run --json
```

The default test suite does not start live inference or browsers. Full `batch`
runs invoke fresh browser validation. Videos, when available, are in the run's
evidence folder. Generated files remain out of Git and npm packages.
