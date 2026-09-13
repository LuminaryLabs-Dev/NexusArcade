# G09 — View and movement: Review

## Summary
Make perspective and locomotion change what players perceive and decide.

## Outcome
Independent B02 verdict and regression findings for affected earlier batches.

## Changes
- Required work: Test occlusion, orientation loss, rapid turns, input interruption, camera clipping and whether perspective changes interaction rather than just framing.
- Entry: G08 completed with current evidence. Follow [shared rules](../RULES.md); queue fields are indexed in ../goal-queue.json.
- Challenge the preceding build using independent cases and nearest-neighbor collection comparisons. Reopen owning findings and invalidate affected downstream readiness.

## Validation

Execution authority: [goal-queue.json](../goal-queue.json) entry G09 and [execution-contract.json](../execution-contract.json).

- Execute frozen cases independently from generation summaries. Pass: All mandatory checks evidenced; contradictory judgments unresolved until independently resolved. Evidence: evidence-manifest.
- Reconcile candidates, revocations and replacements. Pass: 100 accepted batch slots; affected earlier findings resolved or invalidate readiness. Evidence: review-verdict.
- Compare rubric and artifact versions before/after repair. Pass: No silent weakened gates, rewritten history or duplicate slots. Evidence: review-verdict.

## Review and Gates
- Specific gate: A new camera offset alone cannot satisfy novelty; unsupported input remains explicit.
- Missing implementation, unfrozen required thresholds or unresolved mandatory evidence blocks progress.
- Failed review returns findings to this cycle owner; preserve unaffected verified work. Do not proceed by weakening the spec.
- Rollback: restore shared baseline and invalidate dependent evidence; generated artifacts remain immutable with their original verdict history.
- Status: planned, not executed. This document is not runtime proof.
