# Nexus Domain Mapping

Map source responsibilities to the exact current/pinned NexusEngine capabilities used by NexusArcade.

## Source authority

Never map from memory alone. Inspect the exact NexusEngine revision pinned/vendorized by the current NexusArcade Harness and, when relevant, current upstream NexusEngine manifests.

Record the revision/hash used for mapping.

## Ownership test

For every mutable truth ask:

1. What does this value mean?
2. What operations mutate it?
3. What queries/events/snapshots must expose it?
4. Which current Nexus Domain explicitly owns that meaning?
5. Is the value game-authored configuration rather than reusable mechanism?
6. Does an adapter/provider merely translate it without owning it?

Principle:

> one mutable truth → one authoritative owner

## Classification vocabulary

Use these output classes:

- **Domain** — product-neutral semantic/state authority.
- **Kit** — installable capability implementing a Domain contract.
- **Adapter** — translation between owners; owns neither side's truth.
- **Provider** — backend implementation behind a contract.
- **Presentation** — renderer-neutral visual/audio/UI meaning.
- **Render** — execution into renderer/GPU/backend work.
- **Game data** — authored names, numbers, layouts, objectives, tuning, content.
- **Gap** — required capability not supported by verified current contracts.

## Common browser-game mappings

Verify before using; these are mapping heuristics, not API claims.

- deterministic lifecycle/ticks/snapshots → `n:runtime` / relevant runtime subdomains;
- transforms, bounds, distances → `n:spatial`;
- world cells/surfaces/weather/features → `n:world`;
- object identity/placement/vegetation → `n:object`;
- semantic actions/targets/input → `n:interaction`;
- objectives/resources/timers/motion → `n:simulation`;
- camera/UI/audio/graphics/sky descriptors → `n:presentation`;
- backend-neutral rendering execution → `n:render`.

## Do not over-promote game rules

Examples of authored game data, not new Core Domains:

- a tree species costs 20;
- an objective requires 3 items;
- a round lasts 300 seconds;
- a named route awards 5 points;
- a specific color palette or label.

Use Core for mechanism and the game profile for authored meaning.

## Core gap rule

If a required product-neutral capability is truly absent from current NexusEngine:

1. document the missing capability;
2. explain why NexusArcade cannot legitimately own it;
3. identify the proposed Core owner and minimum contract;
4. mark the conversion BLOCKED or PARTIAL as appropriate;
5. require a separate explicit task/authorization for `LuminaryLabs-Dev/NexusEngine`.

Do not silently edit Core from this skill.
