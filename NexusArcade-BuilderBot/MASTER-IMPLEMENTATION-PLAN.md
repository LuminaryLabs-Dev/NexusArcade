# NexusArcade BuilderBot — Implementation Contract

## Action Summary

Build a Discord-native intake service inside the NexusArcade repository. It converts short private or collaborative conversations into structured `NEW_GAME` and `UPDATE_GAME` requests stored in local runtime data.

The bot never builds games, edits repositories, triggers CI/CD, deploys, or executes Discord-supplied commands.

## Outcome

```text
/new-game
  -> private adaptive GameProfile

/new-game-collaborative
  -> shared adaptive GameProfile
  -> participants vote
  -> owner locks decisions

/update-game
  -> private game search + ChangeProfile

/update-game-collaborative
  -> shared game search + ChangeProfile
  -> participants vote
  -> owner locks decisions

all four
  -> gap-driven question graph
  -> confirmation
  -> NAB-###### request
  -> live-data/
  -> later human NexusArcade production workflow
```

## Core rules

1. Ask one high-value missing question at a time.
2. Let one answer populate multiple profile fields.
3. Preserve whether information is explicit, inferred, defaulted, or unresolved.
4. Private sessions are owner-isolated and ephemeral where Discord supports it.
5. Collaborative sessions share one state object; participants join before mutation; the owner resolves the current decision and submits.
6. Runtime data is file-backed for debug operation and abstracted for a later hosted database.
7. Google Drive documents operations; it is not the live ticket database.
8. No GitHub/CI/deployment credentials are available to the bot.

## Validation Checklist

- [ ] Four Discord commands register.
- [ ] Private sessions cannot be mutated by other users.
- [ ] Collaborative sessions support multiple participants against one profile.
- [ ] Collaborative votes are serialized and owner-controlled.
- [ ] Required gaps are asked before submission.
- [ ] One answer can fill multiple fields.
- [ ] Existing game search supports IDs, names, aliases, and fuzzy matching.
- [ ] Requests receive unique `NAB-######` IDs.
- [ ] Sessions and requests survive process restarts.
- [ ] Runtime data and credentials remain outside Git.
- [ ] Bot cannot run arbitrary host commands.
- [ ] Bot has no GitHub, CI/CD, deployment, or Drive-write authority.
- [ ] `npm test` passes before release.
