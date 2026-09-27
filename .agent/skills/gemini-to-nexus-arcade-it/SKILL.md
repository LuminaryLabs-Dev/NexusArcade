---
name: gemini-to-nexus-arcade-it
description: Convert an existing Gemini-generated HTML, JavaScript, or Three.js browser game into a causal NexusArcade/NexusEngine composition. Ground the conversion in the running source game, preserve accepted player behavior and visual identity, map mutable truth to current Nexus Core Domains, use the NexusArcade Harness compiler/runtime where supported, identify capability gaps explicitly, and prove the converted game through deterministic and browser validation. Do not preserve duplicate gameplay authority or invent unsupported Nexus capabilities.
---

# Gemini to Nexus Arcade IT

Use this skill when the source is a Gemini-generated browser game, especially a single-file HTML/JavaScript/Three.js game, and the requested outcome is a real NexusArcade/NexusEngine implementation rather than a wrapper around the old code.

## Outcome

Produce a conversion in which:

- accepted player behavior and recognizable visual identity are preserved unless an explicit change is approved;
- each mutable gameplay truth has exactly one authoritative Nexus owner;
- the NexusArcade Harness compiles and runs the game from trusted capabilities and typed data;
- Three.js or another renderer consumes Nexus state instead of owning gameplay truth;
- gameplay construction works without model inference;
- deterministic, causal, browser, and source-parity evidence supports the final status.

A build, screenshot, model verdict, or Nexus import by itself is not conversion proof.

## Required procedure

1. **Freeze the exact source.** Record source identity, files or commit, entry point, dependencies, runtime URL, controls, browser dimensions, and known assumptions. Do not rewrite before baseline inspection.
2. **Run the original.** Serve the exact game locally and record controls, player verbs, camera, world layout, HUD, state transitions, timing, win/loss, restart, console/network behavior, important VFX, and audio where testable. Follow [source-audit.md](references/source-audit.md) and [behavior-contract.md](references/behavior-contract.md).
3. **Extract mutable truth.** Inventory authoritative gameplay state, derived state, input state, presentation state, transient effects, configuration, and external/platform state. Do not let DOM or renderer objects become accidental authorities.
4. **Trace causality.** For every meaningful player action, trace validation, state mutations, consequences, objective changes, and presentation effects. Split mixed source functions into their real responsibilities.
5. **Resolve current Nexus ownership.** Inspect the exact current/pinned NexusEngine manifests and APIs used by NexusArcade. Map each responsibility to Domain, Kit, adapter, provider, presentation, or authored game data. Follow [nexus-domain-mapping.md](references/nexus-domain-mapping.md). Never infer an API from memory.
6. **Gate against the Harness.** Compare every required capability with the current NexusArcade Harness. Classify it A–E using [harness-capability-gate.md](references/harness-capability-gate.md). Reuse existing capability before adding one.
7. **Freeze a conversion matrix.** Before implementation, record source symbol/state, player-visible behavior, current owner, Nexus owner, Harness implementation, and decision: reuse, replace, decompose, adapt, extend, block, or remove. Do not implement while ownership is ambiguous.
8. **Define the target graph.** Draw the intended typed causal graph before code. Separate authored rules/data from reusable product-neutral mechanism.
9. **Implement the smallest authorized conversion.** Prefer existing trusted Harness domains and pinned Nexus Core capabilities. If a Nexus capability exists but Arcade lacks a bridge, add only a generic reusable Harness capability. Never add game-named shared primitives when a product-neutral capability suffices.
10. **Keep presentation downstream.** Reuse good source geometry, materials, CSS, models, shaders, particles, camera framing, and sound where useful, but make them consume Nexus state/events. Follow [presentation-boundary.md](references/presentation-boundary.md).
11. **Compile model-free first.** Gameplay must compile/run through the Harness without an LLM. Models may later assist bounded interpretation, editorial choices, or visual inspection; they may not supply executable gameplay, override compiler/runtime failures, or declare acceptance.
12. **Run deterministic proof.** Validate start/input/tick/state/events/reset/repeat, deterministic replay, required interactions, failure behavior, and idle behavior. Use existing Harness preflight machinery where applicable.
13. **Run causal ablation.** Freeze or remove each important gameplay domain and replay representative routes. A claimed domain must materially contribute to an accepted behavior or objective. Decorative Nexus integration is a failure.
14. **Run browser proof.** Exercise the built artifact through the actual browser/player path, including controls, pause/resume, focus loss, restart, HUD/state projection, win/loss, reload where relevant, console errors, and unexpected network dependencies.
15. **Compare against the original.** Evaluate every accepted behavior from the baseline against the Nexus version. Classify differences as INTENTIONAL_IMPROVEMENT, BUG_FIX, ARCHITECTURAL_ONLY, REGRESSION, or UNRESOLVED. Any unapproved regression blocks PASS.
16. **Report truthfully.** Use PASS, PARTIAL, BLOCKED, or FAILED as defined in [validation-gate.md](references/validation-gate.md). Never promote an incomplete result by relabeling it.

The ordered working procedure is in [conversion-workflow.md](references/conversion-workflow.md).

## Capability ownership rule

Use this priority:

1. existing current Nexus Core capability;
2. existing current NexusArcade Harness capability;
3. generic reusable NexusArcade bridge/composition primitive over an existing Core capability;
4. game-authored configuration/data;
5. explicit BLOCKED Core gap requiring a separately authorized NexusEngine task.

Do not modify `LuminaryLabs-Dev/NexusEngine` under this skill unless the user separately authorizes that exact repository/action.

## Model policy

Default to **model-free gameplay construction**.

Models may assist with source summarization, bounded interpretation, titles, palettes, labels, and visual inspection only when their output is schema-bounded and independently validated. Model output is untrusted data.

Models must not:

- write or inject arbitrary executable gameplay;
- invent unsupported Domains/Kits/APIs;
- bypass compiler, preflight, browser, parity, or acceptance failures;
- establish gameplay correctness, novelty, device qualification, or factory acceptance by assertion.

## Repository mutation boundary

Before persistent writes, state the exact repository and action.

For shared Harness expansion:

```text
Repository: LuminaryLabs-Dev/NexusArcade
Action: add the minimum generic Harness capability required by the conversion.
```

For a genuine Core gap:

```text
STOP
Repository: LuminaryLabs-Dev/NexusEngine
Action: separate task and separate authorization required.
```

Never silently cross repository scope.

## Required conversion packet

Every conversion should leave a compact evidence packet containing:

- Source Identity
- Behavior Baseline
- Mutable State Inventory
- Player Verb Inventory
- Causal System Traces
- Nexus Ownership Map
- Harness Capability Matrix
- Capability Gaps
- Target Domain Graph
- Authored Game Data
- Implementation Changes
- Deterministic Proof
- Causal Ablation Proof
- Browser Proof
- Original-vs-Converted Parity
- Final Status and blockers

## Completion gate

Do not report PASS unless all applicable checks are satisfied:

- exact original source was run and baselined;
- accepted player-visible behavior was inventoried;
- mutable truth has one authoritative owner each;
- current Nexus contracts were verified from code;
- the Harness capability matrix is complete;
- unsupported capability gaps are explicit;
- no arbitrary model-written gameplay is required;
- the typed graph/profile compiles;
- deterministic preflight passes;
- important domains pass causal ablation;
- Three.js/rendering consumes Nexus truth instead of duplicating it;
- reset/replay lifecycle works;
- browser runtime proof passes;
- original-vs-converted parity has no unapproved regression.

