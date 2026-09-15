# Agent packets

Current: [NexusArcade — Reliable Arcade Factory](packets/2026-09-13_reliable-arcade-factory/PLAN.md).

33 ordered planning/build/review goals. Packet JSON is draft planning data, not active harness configuration. Start at G01; do not launch batches from this index alone.

Execution detail now lives in goal-queue.json and execution-contract.json within the current packet. The catalog has typed options and explicit capability gaps; game-profile.example.json is a worked design with unfulfilled acceptance gates, not a generated game.

## Mission resume state
Use the global `arcade-it` skill to continue the long-running factory goal. Its compact resume pointer and decision history are in [`.agent/arcade-it/`](arcade-it/current-state.json); the goal packet and runtime queue remain authoritative.
