import { NEXUS_ENGINE_VERSION } from "../../release.js";
import { defineCoreDomainManifest } from "../domain-manifest.js";

const objectSchema = Object.freeze({ type: "object", additionalProperties: true });

export const mcpDomainManifest = defineCoreDomainManifest({
  identity: {
    id: "mcp-domain",
    domainPath: "n:mcp",
    parentDomainPath: null,
    label: "Model Context Protocol",
    status: "stable-candidate"
  },
  ownership: {
    responsibility: "Own opt-in transport-neutral MCP contracts, provider registration, authorization, and protocol dispatch.",
    owns: ["MCP provider contracts", "MCP registry state", "tool dispatch", "resource dispatch", "prompt dispatch", "authorization gates"],
    forbiddenResponsibilities: ["application tools", "agent planning", "automatic protocol exposure", "transport process lifecycle"]
  },
  ownedState: [{
    id: "mcp-registry",
    description: "Registered provider metadata, capabilities, and authorization policy.",
    schema: objectSchema,
    persistence: "snapshot",
    owner: "mcp-domain"
  }],
  inputs: [
    { id: "mcp:provider-registration", description: "Explicit provider records with tool, resource, and prompt contracts." },
    { id: "mcp:request", description: "Validated protocol requests supplied by a host transport." }
  ],
  systems: [
    { id: "mcp:contract-validation", description: "Validate provider and method schemas before registration or dispatch." },
    { id: "mcp:authorization", description: "Enforce approval and authorization policy before invocation." },
    { id: "mcp:dispatch", description: "Dispatch a validated request to exactly one registered provider surface." }
  ],
  outputs: [
    { id: "n:mcp", description: "Transport-neutral MCP capability." },
    { id: "mcp:tools", description: "Registered and schema-validated tool contracts." },
    { id: "mcp:resources", description: "Registered resource contracts." },
    { id: "mcp:prompts", description: "Registered prompt contracts." },
    { id: "mcp:result", description: "Structured protocol result envelope." }
  ],
  lifecycle: {
    install: "Create one opt-in MCP registry without opening a transport.",
    duplicateInstall: "Return the existing registry API when the manifest identity matches.",
    reset: "Restore the configured provider registry and authorization state.",
    snapshot: "Serialize provider metadata and authorization state without executable handlers.",
    replay: "Dispatch identical validated requests against an equivalent registry snapshot."
  },
  dependencies: { requires: [], optional: ["n:composition"] },
  settingsSchema: objectSchema,
  proof: {
    status: "proven",
    references: [
      "src/core-domains/mcp/tests/mcp-contract-negative.mjs",
      "src/core-domains/mcp/tests/mcp-registry-smoke.mjs",
      "src/core-domains/mcp/tests/node-stdio-smoke.mjs"
    ],
    consumers: [
      { id: "mcp-registry-consumer", description: "In-process provider registration and dispatch consumer." },
      { id: "mcp-node-transport-consumer", description: "Node stdio adapter consumer using the same Core registry." }
    ]
  },
  subdomains: [],
  publicEntry: {
    subpath: "./domains/mcp",
    module: "./src/core-domains/mcp/index.js"
  },
  publicKits: [{
    id: "mcp-registry-kit",
    version: NEXUS_ENGINE_VERSION,
    status: "stable-candidate",
    kind: "domain-service-kit",
    responsibility: "Register and dispatch schema-valid MCP providers through an explicit authorization boundary.",
    atomic: true,
    productNeutral: true,
    determinism: "isolated-nondeterminism",
    domainPath: "n:mcp",
    parentDomainPath: null,
    apiName: "mcp",
    requires: [],
    provides: ["n:mcp", "mcp:tools", "mcp:resources", "mcp:prompts", "mcp:result"],
    composes: [],
    idempotency: {
      key: "provider-id-and-contract-content",
      duplicateInstall: "Matching providers are a no-op; changed content for an existing id is rejected."
    },
    reset: { supported: true, semantics: "Restore the configured provider and authorization snapshot." },
    snapshot: { supported: true, schema: objectSchema },
    environments: ["browser", "node", "worker"],
    settingsSchema: objectSchema,
    source: {
      module: "./src/core-domains/mcp/kits/mcp-registry-kit/index.js",
      exportName: "createMcpRegistryKit",
      publicSubpath: "./domains/mcp/registry"
    },
    proof: {
      status: "proven",
      references: [
        "src/core-domains/mcp/tests/mcp-contract-negative.mjs",
        "src/core-domains/mcp/tests/mcp-registry-smoke.mjs"
      ],
      consumers: [
        { id: "mcp-contract-consumer", description: "Negative schema, authorization, and collision consumer." },
        { id: "mcp-dispatch-consumer", description: "Positive tools, resources, prompts, and reset consumer." }
      ]
    }
  }],
  providers: [],
  adapters: [{
    id: "node-mcp-sdk-adapter",
    domainPath: "n:mcp",
    responsibility: "Translate Node MCP SDK transport messages to and from the Core registry.",
    source: { module: "./src/core-domains/mcp/adapters/node-mcp-sdk-adapter/index.js" },
    environments: ["node"],
    proofReferences: ["src/core-domains/mcp/tests/node-stdio-smoke.mjs"]
  }]
});

export default mcpDomainManifest;
