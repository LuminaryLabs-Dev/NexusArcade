# G08 — View and movement: Build

## Summary
Make perspective and locomotion change what players perceive and decide.

## Outcome
100 new provisionally accepted slots in B02, plus all failed-attempt accounting and evidence for the next reviewer.

## Changes
- Required work: Implement reusable camera/movement providers and generate compatible profiles without embedding game-specific movement scripts.
- Entry: G07 completed with current evidence. Follow [shared rules](../RULES.md); queue fields are indexed in ../goal-queue.json.
- Implement shared prerequisites and verify before game admission. Create/repair games only through the harness; retain exact versions and attempt lineage.

## Validation

Execution authority: [goal-queue.json](../goal-queue.json) entry G08 and [execution-contract.json](../execution-contract.json).

- Run source-mapped capability probes and existing relevant checks. Pass: Required capability contracts implemented and evidence version-bound. Evidence: evidence-manifest.
- Reconcile candidate-index with all required per-game gate results. Pass: 100 distinct provisional slots; no expired or failed idea counted. Evidence: candidate-index.
- Apply full baseline including visual and interaction novelty. Pass: No protected regression or unreviewed mandatory requirement. Evidence: evidence-manifest.

## Review and Gates
- Specific gate: A new camera offset alone cannot satisfy novelty; unsupported input remains explicit.
- Missing implementation, unfrozen required thresholds or unresolved mandatory evidence blocks progress.
- Failed review returns findings to this cycle owner; preserve unaffected verified work. Do not proceed by weakening the spec.
- Rollback: restore shared baseline and invalidate dependent evidence; generated artifacts remain immutable with their original verdict history.
- Status: planned, not executed. This document is not runtime proof.
