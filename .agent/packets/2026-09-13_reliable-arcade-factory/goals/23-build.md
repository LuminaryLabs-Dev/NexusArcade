# G23 — Expressive feedback: Build

## Summary
Give each game responsive animation, audio and effects suited to its rules.

## Outcome
100 new provisionally accepted slots in B07, plus all failed-attempt accounting and evidence for the next reviewer.

## Changes
- Required work: Implement reusable feedback responses triggered by domain state; generate games with coherent response styles.
- Entry: G22 completed with current evidence. Follow [shared rules](../RULES.md); queue fields are indexed in ../goal-queue.json.
- Implement shared prerequisites and verify before game admission. Create/repair games only through the harness; retain exact versions and attempt lineage.

## Validation

Execution authority: [goal-queue.json](../goal-queue.json) entry G23 and [execution-contract.json](../execution-contract.json).

- Run source-mapped capability probes and existing relevant checks. Pass: Required capability contracts implemented and evidence version-bound. Evidence: evidence-manifest.
- Reconcile candidate-index with all required per-game gate results. Pass: 100 distinct provisional slots; no expired or failed idea counted. Evidence: candidate-index.
- Apply full baseline including visual and interaction novelty. Pass: No protected regression or unreviewed mandatory requirement. Evidence: evidence-manifest.

## Review and Gates
- Specific gate: More particles or camera shake is not automatically better; feedback must communicate actual state.
- Missing implementation, unfrozen required thresholds or unresolved mandatory evidence blocks progress.
- Failed review returns findings to this cycle owner; preserve unaffected verified work. Do not proceed by weakening the spec.
- Rollback: restore shared baseline and invalidate dependent evidence; generated artifacts remain immutable with their original verdict history.
- Status: planned, not executed. This document is not runtime proof.
