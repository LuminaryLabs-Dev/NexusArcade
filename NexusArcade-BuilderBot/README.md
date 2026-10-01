# NexusArcade BuilderBot

Discord-native intake for NexusArcade game requests. The bot collects structured specifications; it **does not build games, edit GitHub, trigger CI/CD, or deploy**.

## First-time setup

From the BuilderBot directory:

```bash
cd NexusArcade-BuilderBot
npm install
npm run setup
```

The setup wizard asks for:

- Discord Client/Application ID
- Discord Bot Token (hidden while typing)
- Discord Guild/Server ID
- optional Builder channel restriction
- debug mode

It validates the credentials against Discord **before anything is saved**. The token is never printed.

After validation you can choose:

```text
[1] Save local .env
[2] Temporary for this session
[3] Cancel
```

Persistent mode writes only `NexusArcade-BuilderBot/.env`, with restrictive file permissions where supported. That file is Git-ignored.

Temporary mode keeps credentials only in the current setup/Bot process chain. No credential file is written.

The wizard can then optionally register the slash commands and start the bot.

### Temporary setup directly

```bash
npm run setup:temp
```

This forces memory-only credential storage for that run.

### Normal development startup

```bash
npm run dev
```

If configuration already exists, the bot starts in Node watch mode.

If required configuration is missing:

```text
BuilderBot is not configured.

[1] Persistent setup
[2] Temporary setup
[3] Exit
```

so a fresh checkout does not require manual `.env` editing.

## Discord commands

- `/new-game` — private adaptive new-game wizard
- `/new-game-collaborative` — shared new-game session with participant voting
- `/update-game` — private update wizard with game search
- `/update-game-collaborative` — shared update session with participant voting

## Existing .env safety

Setup never silently overwrites an existing `.env`.

For persistent setup it asks whether to:

1. update while preserving unrelated environment values;
2. replace BuilderBot configuration values;
3. cancel.

If validation fails, nothing is saved and setup offers another attempt.

## Manual configuration

Manual configuration is still supported through `.env.example`:

```text
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
NEXUS_ARCADE_BUILDER_CHANNEL_ID=
NEXUS_ARCADE_DEBUG=true
NEXUS_ARCADE_SESSION_TTL_HOURS=24
```

Then:

```bash
npm run register-commands
npm run dev
```

## Game registry

Populate `config/games.json` with authoritative game IDs:

```json
{
  "games": [
    {
      "gameId": "example-game",
      "name": "Example Game",
      "aliases": ["example"],
      "status": "playable"
    }
  ]
}
```

The update wizard searches IDs, names, and aliases. Runtime requests and sessions are stored under `live-data/` and ignored by Git.

## Runtime model

```text
Discord
  -> private/shared session
  -> adaptive question graph
  -> GameProfile / ChangeProfile
  -> user confirmation
  -> NAB-###### request in live-data/requests/
```

The wizard asks high-value missing questions instead of presenting a long fixed form. One answer can populate several structured fields.

Private sessions are isolated to their owner. Collaborative sessions share one profile. Participants join, vote on the current question, and the session owner locks the leading answer before the wizard advances. Only the owner can submit the final request.

## Data authority

The running BuilderBot owns live request/session data. Google Drive can document the operating process, but it is not required for runtime operation.

## Security boundary

The setup/runtime only needs Discord configuration.

It must never receive:

- GitHub write credentials
- CI/CD credentials
- deployment credentials
- Google Drive write credentials
- shell commands from Discord users

The Discord token must never enter request tickets, `live-data/`, logs, or Git history.

## Tests

```bash
npm test
```

The deterministic tests cover environment parsing/writing, safe existing-`.env` behavior, Discord validation logic, request persistence, request IDs, and wizard behavior.
