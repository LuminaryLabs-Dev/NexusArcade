# Generation architecture

`generation/` is a Node-only subsystem, exported separately from the installer.

1. **Supply** samples weighted, compatible inputs from versioned local pools.
2. **Design chains** produce two ideas, choose one, critique it, refine the
   interaction labels, then choose pacing. A deterministic compiler assembles the
   complete specification from independently accepted fields and locked rules.
3. **Orchestrator** owns the queue, stage checkpoints, global call reservations,
   deadlines, cancellation, bounded repair, and state transitions.
4. **Builder** checks pinned dependencies and assembles browser files from the
   specification and a trusted family. No model output becomes executable code.
5. **Validation/admission** separately checks schemas, syntax, exact file hashes,
   browser rendering, input playthrough, restart, simulated failure, and pause.
   Only real passing evidence can admit exact bytes to the local catalog.
6. **Posts** produces unpublished invitation text and a deterministic factual
   description after game admission. Post failure does not revoke a valid game.

## Kernel provenance

The selected LiquidUniversal kernel was copied from NexusAgent commit
`1458aead98aab5714a72f89e41deb62d91a593e3` and first verified against its Git blob
manifest. The full upstream harness remained outside this repository. Original
file hashes are in `kernel/UPSTREAM.json`; Arcade adds strict schema gating and
schema forwarding and uses its own bounded local-model adapter.

The generic kernel provides core, chain, and branching-tree APIs. The Arcade
factory uses core decisions with persisted stage orchestration rather than a
large in-memory universal tree. The host owns restart and artifact side effects.

## Authority and trust

- LFM proposes data; strict independent schemas gate each response.
- Game specifications cannot define code paths, shell commands, dependencies, or
  arbitrary engine identifiers.
- Three.js and copied NexusEngine components are exact version/hash dependencies.
- Source changes require a new batch; evidence hashes must match game bytes.
- The local model endpoint must be loopback HTTP and cannot redirect.
- Raw responses are bounded and retained separately from validated decisions.
- Programmatic test adapters are trusted developer hooks, never model-callable tools.

## Limits

This is one game family with bounded configuration repair. It does not generate
arbitrary JavaScript, add engine capabilities, change its own harness, publish to
GitHub, update the public registry, or manage cabinets. The existing public
installer source allowlist remains intact; the generated local catalog is separate.

Physical cabinet scheduling, hardware inference performance, commercial content
quality, and long unattended runs need subsequent measured development.
