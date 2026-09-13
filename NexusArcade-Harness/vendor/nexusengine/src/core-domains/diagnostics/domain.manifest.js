import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";

const diagnosticsProof = ["tests/core-kits/core-debug-kit-smoke.mjs", "tests/core-domain-kits-smoke.mjs"];

export const diagnosticsDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "diagnostics-domain", domainPath: "n:diagnostics", label: "Diagnostics", responsibility: "Own renderer-neutral telemetry, health, determinism, performance, replay, and debug evidence descriptors.", owns: ["telemetry descriptors", "health state", "determinism evidence", "performance counters", "debug descriptors"], forbiddenResponsibilities: ["debug overlay rendering", "log transport", "developer UI", "platform profiling implementation"], provides: ["n:diagnostics", "diagnostics:telemetry", "diagnostics:health", "diagnostics:debug-descriptor"], proofReferences: diagnosticsProof }),
  publicEntry: { subpath: "./domains/diagnostics", module: "./src/core-domains/diagnostics/index.js" },
  publicKits: [
    atomicKit({ id: "diagnostics-kit", responsibility: "Collect serializable telemetry, runtime health, determinism, and performance evidence.", domainPath: "n:diagnostics", apiName: "diagnostics", provides: ["n:diagnostics", "diagnostics:telemetry", "diagnostics:health"], module: "./src/core-domains/diagnostics/kits/diagnostics-kit/index.js", exportName: "createDiagnosticsKit", publicSubpath: "./domains/diagnostics/runtime", proofReferences: diagnosticsProof }),
    atomicKit({ id: "debug-descriptor-kit", responsibility: "Record renderer-neutral rays, markers, scalars, and capture packets for diagnostics.", domainPath: "n:diagnostics", apiName: "debugDescriptors", provides: ["diagnostics:debug-descriptor", "diagnostics:capture-packet"], module: "./src/core-domains/diagnostics/kits/debug-descriptor-kit/index.js", exportName: "createDebugDescriptorKit", publicSubpath: "./domains/diagnostics/debug", proofReferences: ["tests/core-kits/core-debug-kit-smoke.mjs"] }),
    atomicKit({ id: "debug-draw-descriptor-kit", responsibility: "Create stateless renderer-neutral debug draw descriptors.", domainPath: "n:diagnostics", apiName: "debugDraw", provides: ["diagnostics:debug-draw-descriptor"], module: "./src/core-domains/diagnostics/kits/debug-draw-kit.js", exportName: "createDebugDrawDescriptorKit", publicSubpath: "./domains/diagnostics/debug-draw", proofReferences: ["tests/core-kits/core-utility-articulation-smoke.mjs"] })
  ]
}));

export default diagnosticsDomainManifest;
