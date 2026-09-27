# Validation Gate

Use this gate to assign the final conversion status.

## Evidence classes

Keep these separate:

1. **Source baseline evidence** — proves what the original did.
2. **Structural/compiler evidence** — proves typed composition validity.
3. **Deterministic runtime evidence** — proves behavior through runtime state.
4. **Causal ablation evidence** — proves important domains materially contribute.
5. **Browser evidence** — proves the assembled player actually runs and projects state.
6. **Parity evidence** — proves accepted original behaviors were preserved or intentionally changed.
7. **Model observations** — may support bounded editorial/visual facts only; never substitute for gameplay proof.
8. **Physical-device evidence** — separate from browser/software-WebGL proof when required.

## Deterministic minimum

Where applicable verify:

- start state is valid;
- inputs are bounded and accepted;
- the expected route completes;
- idle cannot win accidentally;
- omitting required interactions prevents completion;
- expected failure conditions terminate correctly;
- reset restores baseline;
- the same replay produces equivalent outcome/timing within the contract;
- snapshots are observations, not a second mutable authority.

## Causal ablation minimum

Select important claimed gameplay owners. Freeze or remove each one independently and replay an affected behavior.

PASS requires evidence that the claimed capability materially changes at least one required route/behavior. A changing value that is redundant to the outcome is not enough.

## Browser minimum

Exercise the actual built artifact:

- loads through the intended local player path;
- renders meaningful geometry;
- controls work;
- start/pause/resume work;
- focus loss handling works if applicable;
- restart clears gameplay progress;
- HUD/presentation follows authoritative state;
- success/failure is reachable as designed;
- reload/persistence works when part of the contract;
- no unexpected console errors;
- no unexpected external network dependency;
- representative screenshots are captured.

## Parity table

Evaluate the same stable behavior IDs created during baseline.

| Behavior ID | Original | Nexus | Difference | Evidence |
|---|---|---|---|---|

Difference values:

- INTENTIONAL_IMPROVEMENT
- BUG_FIX
- ARCHITECTURAL_ONLY
- REGRESSION
- UNRESOLVED

Any unapproved REGRESSION blocks PASS.

## Final statuses

### PASS

All required ownership, compilation, deterministic, causal, browser, and parity checks pass. No unapproved regression or unresolved required gap remains.

### PARTIAL

A useful bounded conversion exists and evidence is truthful, but one or more required portions are not yet converted/proven. List the exact missing work.

### BLOCKED

A required dependency/capability/evidence is unavailable within the authorized scope, including a genuine Nexus Core gap that needs a separate task.

### FAILED

The attempted conversion does not satisfy required correctness/proof and is not a usable bounded partial result.

Never report complete/accepted merely because code builds, a screenshot looks correct, or a model says PASS.
