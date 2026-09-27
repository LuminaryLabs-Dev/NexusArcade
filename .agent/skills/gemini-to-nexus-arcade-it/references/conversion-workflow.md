# Conversion Workflow

This is the ordered execution route for a Gemini browser-game conversion.

## 0. Scope and authorization

- Name the source game and target repository.
- Confirm whether the task is audit-only or includes persistent writes.
- Before GitHub mutation, state the exact repository and action.
- Never cross into NexusEngine writes without separate explicit authorization.

## 1. Freeze source

Record source identity and runtime assumptions. Preserve an exact copy/hash/commit reference. Do not edit the baseline.

## 2. Run baseline

Serve and execute the original. Capture player-visible behavior, runtime state changes, screenshots, controls, console/network findings, and complete-route behavior where possible.

## 3. Build behavior contract

Assign stable behavior IDs. Record preconditions, actions, truth changes, feedback, timing, rejection/failure, completion, and restart behavior.

## 4. Inventory mutable truth

Classify every important mutable value as authoritative, derived, input, presentation, transient, configuration, or platform state.

## 5. Trace causality

For each gameplay verb, identify all source mutations and effects. Split source monoliths into semantic responsibilities.

## 6. Resolve Nexus ownership

Inspect current pinned Nexus/Core contracts. Map each responsibility to Domain/Kit/adapter/provider/presentation/game data. Record the exact revision used.

## 7. Gate against the Harness

Classify every requirement A–E. Reuse existing capabilities first. Document real gaps before code.

## 8. Freeze conversion matrix and target graph

Produce the source→Nexus matrix and draw the typed causal graph. Separate generic mechanism from authored game data.

No implementation begins until all required truth has an owner.

## 9. Implement in layers

Recommended order:

1. trusted capability/domain graph;
2. authored profile/data;
3. adapters/bridges;
4. deterministic runtime;
5. presentation descriptors;
6. Three.js/view projection;
7. UI/audio/VFX projection.

Do not preserve the old source as a hidden second gameplay runtime.

## 10. Model-free compile

Use the current Harness's deterministic compile/assembly surfaces appropriate to the game. The game must construct and run without inference.

If the current full generation command requires a model for editorial/review stages, prove gameplay using the lower model-free compiler/runtime surfaces first.

## 11. Deterministic preflight

Exercise representative routes using runtime input, ticks, state, events, reset, and replay. Check:

- same inputs reproduce equivalent results;
- reset restores baseline;
- required interactions matter;
- idle does not accidentally complete;
- expected failure paths fail;
- success paths complete.

## 12. Causal ablation

For each important gameplay capability, freeze/remove its state changes and replay. At least one accepted behavior depending on that capability must fail/change as expected.

If a Nexus-owned system can be removed with no meaningful consequence, investigate decorative or duplicate integration.

## 13. Presentation migration

Reuse good source visuals where appropriate, but derive them from Nexus truth. Remove renderer-owned duplicate gameplay state.

## 14. Browser proof

Launch the assembled artifact and test real controls, rendering, pause/resume, focus behavior, restart, HUD projection, success/failure, reload/persistence where applicable, console errors, and unexpected network dependencies.

## 15. Parity review

Evaluate every baseline behavior ID against the converted version.

Difference labels:

- INTENTIONAL_IMPROVEMENT
- BUG_FIX
- ARCHITECTURAL_ONLY
- REGRESSION
- UNRESOLVED

Any unapproved REGRESSION blocks PASS.

## 16. Final report

Return the conversion packet and PASS/PARTIAL/BLOCKED/FAILED. State exact evidence, unresolved gaps, and the single next action when not PASS.
