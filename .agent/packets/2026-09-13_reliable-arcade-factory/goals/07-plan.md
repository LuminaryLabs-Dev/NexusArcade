# G07 — View and movement: Plan

## Summary
Make perspective and locomotion change what players perceive and decide.

## Outcome
A bounded execution packet for the next Build goal using EXECUTION-PACKET-TEMPLATE.md; audited capability scope, frozen gates and explicit blockers.

## Changes
- Required work: Declare supported inputs, movement semantics, camera limits and comfort/readability checks for each combination.
- Entry: G06 completed with current evidence. Follow [shared rules](../RULES.md); queue fields are indexed in ../goal-queue.json.
- Create the following Build goal packet using ../EXECUTION-PACKET-TEMPLATE.md. Resolve capability and acceptance unknowns before declaring readiness.

## Validation

Execution authority: [goal-queue.json](../goal-queue.json) entry G07 and [execution-contract.json](../execution-contract.json).

- Inspect every design record and required calibration. Pass: No mandatory unresolved values when marking ready. Evidence: execution-packet.
- Map each requirement to build step and check. Pass: Every required output/check has source/capability owner; no future build evidence required. Evidence: execution-packet.
- Inspect held-out negative and contrast cases. Pass: Review can reject invalid or repetitive candidates without trusting generator text. Evidence: design-records.

## Review and Gates
- Specific gate: A new camera offset alone cannot satisfy novelty; unsupported input remains explicit.
- Plan may audit missing implementations; it cannot mark Build ready until implementation work and required checks are explicit and mandatory design decisions are resolved.
- Failed review returns findings to this cycle owner; preserve unaffected verified work. Do not proceed by weakening the spec.
- Rollback: restore shared baseline and invalidate dependent evidence; generated artifacts remain immutable with their original verdict history.
- Status: planned, not executed. This document is not runtime proof.
