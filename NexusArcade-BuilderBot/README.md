# NexusArcade BuilderBot

Discord-native intake for NexusArcade game requests. The bot collects structured specifications; it **does not build games, edit GitHub, trigger CI/CD, or deploy**.

## Commands

- `/new-game` — private adaptive new-game wizard
- `/new-game-collaborative` — shared new-game session with participant voting
- `/update-game` — private update wizard with game search
- `/update-game-collaborative` — shared update session with participant voting

## Local setup

```bash
cd NexusArcade-BuilderBot
npm install
cp .env.example .env
# fill DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID
npm run register-commands
npm run dev
```

Optionally set `NEXUS_ARCADE_BUILDER_CHANNEL_ID` to restrict the four commands to one Discord channel.

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

## Security

The bot requires Discord credentials only. Do not add GitHub, deployment, CI, shell-execution, or Google Drive write credentials to this service.
