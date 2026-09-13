import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";
import schedule from "./sequence/schedule/subdomain.manifest.js";
import scheduleKit from "./sequence/schedule/kits/schedule-kit/kit.manifest.js";

const runtimeProof = ["tests/realtime-core-tick-contract-smoke.mjs", "tests/domain-service-kit-smoke.mjs"];
const dataProof = ["tests/core-kits/core-data-kit-smoke.mjs", "tests/core-domain-kits-smoke.mjs"];
const transactionProof = ["tests/core-kits/core-transaction-ledger-smoke.mjs"];
const persistenceProof = ["tests/core-domain-kits-smoke.mjs"];
const sequenceProof = ["tests/sequence-node-runtime-smoke.mjs", "tests/sequence-node-kit-deploy-smoke.mjs"];
const startupProof = ["tests/core-kits/core-startup-domain-smoke.mjs", "tests/core-kits/core-assets-startup-bridge-smoke.mjs"];

export const runtimeDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({
    id: "runtime-domain",
    domainPath: "n:runtime",
    label: "Runtime",
    responsibility: "Own deterministic engine lifecycle, ticks, state mutation contracts, and runtime service installation.",
    owns: ["runtime lifecycle", "deterministic ticks", "runtime service installation", "state mutation ordering"],
    forbiddenResponsibilities: ["game rules", "renderer lifecycle", "platform process lifecycle", "authored content"],
    provides: ["n:runtime", "runtime:lifecycle", "runtime:kit-installation"],
    proofReferences: runtimeProof
  }),
  subdomains: [
    domainNode({ id: "runtime-realtime-domain", domainPath: "n:runtime:realtime", parentDomainPath: "n:runtime", label: "Realtime Runtime", responsibility: "Own deterministic frame context and realtime phase execution.", owns: ["frame context", "phase ordering", "tick execution"], forbiddenResponsibilities: ["wall-clock policy", "rendering", "gameplay systems"], requires: ["n:runtime"], provides: ["n:runtime:realtime", "runtime:tick", "runtime:frame-context", "runtime:phase-order"], proofReferences: runtimeProof }),
    domainNode({ id: "runtime-data-domain", domainPath: "n:runtime:data", parentDomainPath: "n:runtime", label: "Runtime Data", responsibility: "Own schemas, snapshots, selectors, migrations, deterministic random streams, and portable data envelopes.", owns: ["schemas", "snapshots", "selectors", "migrations", "state digests", "portable data envelopes"], forbiddenResponsibilities: ["storage transport", "game inventory meaning", "network replication"], requires: ["n:runtime"], provides: ["n:runtime:data", "data:schema", "data:snapshot", "data:migration", "data:digest"], proofReferences: dataProof }),
    domainNode({ id: "runtime-transaction-domain", domainPath: "n:runtime:transaction", parentDomainPath: "n:runtime", label: "Runtime Transaction", responsibility: "Own portable repeat-safe operation and transaction receipts.", owns: ["idempotency keys", "operation receipts", "transaction replay protection"], forbiddenResponsibilities: ["economy policy", "payment processing", "network transport"], requires: ["n:runtime"], provides: ["n:runtime:transaction", "transaction:ledger", "transaction:idempotency"], proofReferences: transactionProof }),
    domainNode({ id: "runtime-persistence-domain", domainPath: "n:runtime:persistence", parentDomainPath: "n:runtime", label: "Runtime Persistence", responsibility: "Own save/load targets, save slots, recovery records, and adapter contracts.", owns: ["save targets", "save slots", "recovery records", "persistence adapter contracts"], forbiddenResponsibilities: ["filesystem implementation", "browser storage implementation", "cloud storage implementation"], requires: ["n:runtime:data"], provides: ["n:runtime:persistence", "persistence:save", "persistence:load", "persistence:adapter-contract"], proofReferences: persistenceProof }),
    domainNode({ id: "runtime-sequence-domain", domainPath: "n:runtime:sequence", parentDomainPath: "n:runtime", label: "Runtime Sequence", responsibility: "Own deterministic sequence nodes, ordered execution, and frame-driven sequence state.", owns: ["sequence nodes", "sequence ordering", "sequence state", "sequence receipts"], forbiddenResponsibilities: ["authored story", "game missions", "renderer timelines"], requires: ["n:runtime"], provides: ["n:runtime:sequence", "sequence:nodes", "sequence:execution"], proofReferences: sequenceProof }),
    domainNode({ id: "runtime-startup-domain", domainPath: "n:runtime:startup", parentDomainPath: "n:runtime", label: "Runtime Startup", responsibility: "Own launch truth, preparation facts, continuation choice, structured failure, and readiness receipts.", owns: ["launch state", "preparation facts", "startup readiness", "startup receipts"], forbiddenResponsibilities: ["application routes", "asset transport", "renderer startup", "platform window lifecycle"], requires: ["n:runtime"], optional: ["n:asset"], provides: ["n:runtime:startup", "startup:preparation", "startup:readiness", "startup:receipt"], proofReferences: startupProof }),
    schedule
  ],
  publicEntry: { subpath: "./domains/runtime", module: "./src/core-domains/runtime/index.js" },
  publicKits: [
    atomicKit({ id: "runtime-lifecycle-kit", responsibility: "Own deterministic runtime lifecycle and Kit installation receipts.", domainPath: "n:runtime", apiName: "runtime", provides: ["n:runtime", "runtime:lifecycle", "runtime:kit-installation"], module: "./src/core-domains/runtime/kits/runtime-lifecycle-kit/index.js", exportName: "createRuntimeLifecycleKit", publicSubpath: "./domains/runtime/lifecycle", proofReferences: runtimeProof }),
    atomicKit({ id: "realtime-runtime-kit", responsibility: "Create deterministic realtime frame context and phase execution.", domainPath: "n:runtime:realtime", apiName: "realtime", requires: ["n:runtime"], provides: ["n:runtime:realtime", "runtime:tick", "runtime:frame-context", "runtime:phase-order"], module: "./src/core-domains/runtime/realtime/kits/realtime-kit/index.js", exportName: "createRealtimeKit", publicSubpath: "./domains/runtime/realtime", proofReferences: runtimeProof }),
    atomicKit({ id: "runtime-data-kit", responsibility: "Provide deterministic schemas, snapshots, selectors, migrations, and data envelopes.", domainPath: "n:runtime:data", apiName: "data", requires: ["n:runtime"], provides: ["n:runtime:data", "data:schema", "data:snapshot", "data:migration", "data:digest"], module: "./src/core-domains/runtime/data/kits/data-kit/index.js", exportName: "createDataKit", publicSubpath: "./domains/runtime/data", proofReferences: dataProof }),
    atomicKit({ id: "transaction-ledger-kit", responsibility: "Record repeat-safe operation keys and immutable transaction receipts.", domainPath: "n:runtime:transaction", apiName: "transaction", requires: ["n:runtime"], provides: ["n:runtime:transaction", "transaction:ledger", "transaction:idempotency"], module: "./src/core-domains/runtime/transaction/kits/transaction-ledger-kit/index.js", exportName: "createTransactionLedgerKit", publicSubpath: "./domains/runtime/transaction", proofReferences: transactionProof }),
    atomicKit({ id: "persistence-contract-kit", responsibility: "Describe save/load targets, slots, recovery records, and persistence adapter contracts.", domainPath: "n:runtime:persistence", apiName: "persistence", requires: ["n:runtime:data"], provides: ["n:runtime:persistence", "persistence:save", "persistence:load", "persistence:adapter-contract"], module: "./src/core-domains/runtime/persistence/kits/persistence-kit/index.js", exportName: "createPersistenceKit", publicSubpath: "./domains/runtime/persistence", proofReferences: persistenceProof }),
    atomicKit({ id: "runtime-sequence-kit", responsibility: "Install deterministic sequence node definitions and execution state.", domainPath: "n:runtime:sequence", apiName: "sequence", requires: ["n:runtime"], provides: ["n:runtime:sequence", "sequence:nodes", "sequence:execution"], module: "./src/core-domains/runtime/sequence/kits/sequence-kit/index.js", exportName: "createSequenceKit", publicSubpath: "./domains/runtime/sequence", proofReferences: sequenceProof }),
    atomicKit({ id: "runtime-startup-kit", responsibility: "Coordinate deterministic startup preparation and readiness receipts.", domainPath: "n:runtime:startup", apiName: "startup", requires: ["n:runtime"], provides: ["n:runtime:startup", "startup:preparation", "startup:readiness", "startup:receipt"], module: "./src/core-domains/runtime/startup/kits/startup-kit/index.js", exportName: "createStartupKit", publicSubpath: "./domains/runtime/startup", proofReferences: startupProof }),
    scheduleKit
  ]
}));

export default runtimeDomainManifest;
