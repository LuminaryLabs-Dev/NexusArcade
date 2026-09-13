import { NEXUS_ENGINE_VERSION } from "../../release.js";
import { defineCoreDomainManifest } from "../domain-manifest.js";

const objectSchema = Object.freeze({ type: "object", additionalProperties: true });

export const compositionDomainManifest = defineCoreDomainManifest({
  identity: {
    id: "composition-domain",
    domainPath: "n:composition",
    parentDomainPath: null,
    label: "Composition",
    status: "stable-candidate"
  },
  ownership: {
    responsibility: "Own deterministic Domain and Kit discovery, dependency planning, plan identity, and exactly-once apply receipts.",
    owns: ["domain catalog", "kit registry metadata", "capability graph", "composition plans", "apply receipts"],
    forbiddenResponsibilities: ["module installation", "host mutation policy", "application approval", "transport lifecycle"]
  },
  ownedState: [{
    id: "composition-registry",
    description: "Normalized Domain, Kit, recipe, provider, and receipt records.",
    schema: objectSchema,
    persistence: "snapshot",
    owner: "composition-domain"
  }],
  inputs: [
    { id: "composition:registry-records", description: "Declarative registry records to merge without executing code." },
    { id: "composition:request", description: "Requested Domain, Kit, or capability targets." }
  ],
  systems: [
    { id: "composition:collision-validation", description: "Reject identity and capability collisions before planning." },
    { id: "composition:dependency-planning", description: "Produce a deterministic dependency-ordered plan." },
    { id: "composition:receipt-reconciliation", description: "Return the prior receipt for an identical accepted plan." }
  ],
  outputs: [
    { id: "n:composition", description: "Composition Domain capability." },
    { id: "composition:registry", description: "Normalized non-executable registry metadata." },
    { id: "composition:plan", description: "Stable dependency-ordered composition plan." },
    { id: "composition:apply-receipt", description: "Persistent exactly-once application receipt." }
  ],
  lifecycle: {
    install: "Create one composition registry and receipt state owner.",
    duplicateInstall: "Return the installed composition API without duplicating state or systems.",
    reset: "Restore configured registry records and clear mutable plan/application state.",
    snapshot: "Serialize normalized registry metadata and receipts.",
    replay: "Recreate the same plan identity and receipt for the same registry and request."
  },
  dependencies: { requires: [], optional: ["n:mcp"] },
  settingsSchema: objectSchema,
  proof: {
    status: "proven",
    references: [
      "src/core-domains/composition/tests/composition-mcp-smoke.mjs",
      "tests/core-domain-kits-smoke.mjs"
    ],
    consumers: [
      { id: "composition-direct-api", description: "Direct registry and plan consumer exercised by Core smoke proof." },
      { id: "composition-mcp-api", description: "MCP provider consumer exercising plan and apply receipts." }
    ]
  },
  subdomains: [],
  publicEntry: {
    subpath: "./domains/composition",
    module: "./src/core-domains/composition/index.js"
  },
  publicKits: [{
    id: "composition-registry-kit",
    version: NEXUS_ENGINE_VERSION,
    status: "stable-candidate",
    kind: "domain-service-kit",
    responsibility: "Maintain normalized composition metadata and produce deterministic plans and receipts.",
    atomic: true,
    productNeutral: true,
    determinism: "deterministic",
    domainPath: "n:composition",
    parentDomainPath: null,
    apiName: "composition",
    requires: [],
    provides: ["n:composition", "composition:registry", "composition:plan", "composition:apply-receipt"],
    composes: [],
    idempotency: {
      key: "kit-id-and-manifest-content",
      duplicateInstall: "Return the existing API when content matches; reject changed content."
    },
    reset: { supported: true, semantics: "Restore configured registry records and clear mutable receipts." },
    snapshot: { supported: true, schema: objectSchema },
    environments: ["browser", "node", "worker"],
    settingsSchema: objectSchema,
    source: {
      module: "./src/core-domains/composition/kits/composition-registry-kit/index.js",
      exportName: "createCompositionKit",
      publicSubpath: "./domains/composition/registry"
    },
    proof: {
      status: "proven",
      references: [
        "src/core-domains/composition/tests/composition-mcp-smoke.mjs",
        "tests/core-domain-kits-smoke.mjs"
      ],
      consumers: [
        { id: "composition-service-consumer", description: "Direct Domain and Kit discovery and plan consumer." },
        { id: "composition-apply-consumer", description: "Approval-gated application controller consumer." }
      ]
    }
  }],
  providers: [],
  adapters: [{
    id: "composition-mcp-adapter",
    domainPath: "n:composition",
    responsibility: "Project composition operations onto an explicitly registered MCP provider.",
    source: { module: "./src/core-domains/composition/adapters/mcp/composition-mcp-provider.js" },
    environments: ["browser", "node"],
    proofReferences: ["src/core-domains/composition/tests/composition-mcp-smoke.mjs"]
  }]
});

export default compositionDomainManifest;
