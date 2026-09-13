# G25 — Progression and pacing: Plan

## Summary
Create distinct complete sessions with understandable development and endings.

## Outcome
A bounded execution packet for the next Build goal using EXECUTION-PACKET-TEMPLATE.md; audited capability scope, frozen gates and explicit blockers.

## Changes
- Required work: Specify learning steps, pressure curves, available decisions, intended session duration and success/failure/restart contracts separately from generation time.
- Entry: G24 completed with current evidence. Follow [shared rules](../RULES.md); queue fields are indexed in ../goal-queue.json.
- Create the following Build goal packet using ../EXECUTION-PACKET-TEMPLATE.md. Resolve capability and acceptance unknowns before declaring readiness.

## Validation

Execution authority: [goal-queue.json](../goal-queue.json) entry G25 and [execution-contract.json](../execution-contract.json).

- Inspect every design record and required calibration. Pass: No mandatory unresolved values when marking ready. Evidence: execution-packet.
- Map each requirement to build step and check. Pass: Every required output/check has source/capability owner; no future build evidence required. Evidence: execution-packet.
- Inspect held-out negative and contrast cases. Pass: Review can reject invalid or repetitive candidates without trusting generator text. Evidence: design-records.

## Review and Gates
- Specific gate: Automated completion does not prove enjoyment or human comprehension; unresolved required human review blocks acceptance.
- Plan may audit missing implementations; it cannot mark Build ready until implementation work and required checks are explicit and mandatory design decisions are resolved.
- Failed review returns findings to this cycle owner; preserve unaffected verified work. Do not proceed by weakening the spec.
- Rollback: restore shared baseline and invalidate dependent evidence; generated artifacts remain immutable with their original verdict history.
- Status: planned, not executed. This document is not runtime proof.
