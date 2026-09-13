import { NEXUS_ENGINE_VERSION } from "../../release.js";
import { defineCoreDomainManifest } from "../domain-manifest.js";

const objectSchema = Object.freeze({ type: "object", additionalProperties: true });

function subdomain({ id, domainPath, parentDomainPath = "n:object", label, responsibility, owns, forbidden, requires, provides, proof }) {
  return {
    identity: { id, domainPath, parentDomainPath, label, status: "stable-candidate" },
    ownership: { responsibility, owns, forbiddenResponsibilities: forbidden },
    ownedState: [{ id: `${id}-state`, description: `Serializable ${label} registry and lifecycle state.`, schema: objectSchema, persistence: "snapshot", owner: id }],
    inputs: requires.map((token) => ({ id: token, description: `${label} required capability.` })),
    systems: [{ id: `${domainPath}:lifecycle`, description: `Validate and apply deterministic ${label} lifecycle operations.` }],
    outputs: provides.map((token) => ({ id: token, description: `${label} provided capability.` })),
    lifecycle: {
      install: `Create one ${label} state owner and API.`,
      duplicateInstall: `Return the installed ${label} API without duplicate state or systems.`,
      reset: `Restore the configured ${label} baseline.`,
      snapshot: `Serialize ${label} state and descriptors.`,
      replay: `Reapply equivalent ${label} inputs deterministically.`
    },
    dependencies: { requires, optional: [] },
    settingsSchema: objectSchema,
    proof: {
      status: "proven",
      references: proof,
      consumers: [
        { id: `${id}-direct-consumer`, description: `Direct ${label} API fixture.` },
        { id: `${id}-composition-consumer`, description: `Installed Object composition fixture.` }
      ]
    }
  };
}

function atomicKit({ id, responsibility, domainPath, apiName, requires = [], provides, module, exportName, publicSubpath, proof, kind = "domain-service-kit", environments = ["browser", "node", "worker"] }) {
  return {
    id,
    version: NEXUS_ENGINE_VERSION,
    status: "stable-candidate",
    kind,
    responsibility,
    atomic: true,
    productNeutral: true,
    determinism: "deterministic",
    domainPath,
    parentDomainPath: domainPath === "n:object" ? null : domainPath.slice(0, domainPath.lastIndexOf(":")),
    apiName,
    requires,
    provides,
    composes: [],
    idempotency: {
      key: "kit-id-and-manifest-content",
      duplicateInstall: "Return the installed API for matching content; reject changed content for the same id."
    },
    reset: { supported: true, semantics: "Restore the configured baseline without duplicating state or systems." },
    snapshot: { supported: true, schema: objectSchema },
    environments,
    settingsSchema: objectSchema,
    source: { module, exportName, publicSubpath },
    proof: {
      status: "proven",
      references: proof,
      consumers: [
        { id: `${id}-direct-consumer`, description: "Direct API behavior fixture." },
        { id: `${id}-installed-consumer`, description: "Installed Object composition fixture." }
      ]
    }
  };
}

const objectProof = [
  "src/core-domains/object/tests/object-domain-smoke.mjs",
  "tests/core-kits/core-object-kit-smoke.mjs"
];

export const objectDomainManifest = defineCoreDomainManifest({
  identity: {
    id: "object-domain",
    domainPath: "n:object",
    parentDomainPath: null,
    label: "Object",
    status: "stable-candidate"
  },
  ownership: {
    responsibility: "Own renderer-neutral object identity, intrinsic geometry meaning, fidelity, vegetation identity, and placement.",
    owns: ["object identity", "object descriptors", "intrinsic bounds", "pivot", "ground anchor", "object registry"],
    forbiddenResponsibilities: ["renderer objects", "GPU resources", "physics resolution", "world generation", "agent decisions"]
  },
  ownedState: [{ id: "object-registry", description: "Serializable object descriptors and lifecycle records.", schema: objectSchema, persistence: "snapshot", owner: "object-domain" }],
  inputs: [{ id: "object:descriptor", description: "Renderer-neutral object descriptor." }],
  systems: [{ id: "object:lifecycle", description: "Register, update, resolve, snapshot, and reset object records." }],
  outputs: [
    { id: "n:object", description: "Object Domain capability." },
    { id: "object:descriptor-contract", description: "Canonical object descriptor contract." },
    { id: "object:registry", description: "Object identity registry." },
    { id: "object:lifecycle", description: "Object lifecycle API." }
  ],
  lifecycle: {
    install: "Create one object registry and lifecycle API.",
    duplicateInstall: "Return the installed Object API without duplicate state or systems.",
    reset: "Restore the configured object registry baseline.",
    snapshot: "Serialize object descriptors and registry state.",
    replay: "Reapply equivalent object commands deterministically."
  },
  dependencies: { requires: [], optional: ["n:asset", "n:simulation:physics"] },
  settingsSchema: objectSchema,
  proof: {
    status: "proven",
    references: objectProof,
    consumers: [
      { id: "object-registry-consumer", description: "Direct object identity and lifecycle consumer." },
      { id: "object-placement-consumer", description: "Placement composition consuming canonical object descriptors." }
    ]
  },
  subdomains: [
    subdomain({
      id: "object-shape-domain",
      domainPath: "n:object:shape",
      label: "Object Shape",
      responsibility: "Own source and derived geometric shapes, provider jobs, qualification, and fallback.",
      owns: ["shape sources", "shape derivation", "shape qualification", "shape jobs"],
      forbidden: ["object identity", "runtime fidelity selection", "materials", "rendering"],
      requires: ["object:descriptor-contract"],
      provides: ["n:object:shape", "object:shape-source", "object:shape-qualified", "object:shape-jobs"],
      proof: ["tests/core-domains/core-object-shape-domain-smoke.mjs", "tests/core-domains/core-object-shape-skinned-qualification-smoke.mjs"]
    }),
    subdomain({
      id: "object-fidelity-domain",
      domainPath: "n:object:fidelity",
      label: "Object Fidelity",
      responsibility: "Own valid object forms, fidelity packages, readiness, and contextual adaptation.",
      owns: ["object forms", "fidelity profiles", "fidelity packages", "fidelity selection"],
      forbidden: ["object identity", "shape derivation", "rendering", "asset transport"],
      requires: ["object:descriptor-contract"],
      provides: ["n:object:fidelity", "object:fidelity-forms", "object:fidelity-packages"],
      proof: ["tests/core-domains/core-object-fidelity-domain-smoke.mjs"]
    }),
    subdomain({
      id: "object-vegetation-domain",
      domainPath: "n:object:vegetation",
      label: "Object Vegetation",
      responsibility: "Own rooted plant species, instances, lifecycle, and deterministic variation.",
      owns: ["vegetation species", "vegetation instances", "plant lifecycle", "ecological preferences"],
      forbidden: ["geometry generation", "world placement", "terrain sampling", "rendering"],
      requires: ["n:object"],
      provides: ["n:object:vegetation", "vegetation:species", "vegetation:instances", "vegetation:lifecycle"],
      proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs", "tests/core-domains/core-object-vegetation-natural-growth-smoke.mjs"]
    }),
    subdomain({
      id: "object-vegetation-tree-domain",
      domainPath: "n:object:vegetation:tree",
      parentDomainPath: "n:object:vegetation",
      label: "Object Vegetation Tree",
      responsibility: "Own deterministic tree structure, canopy, growth, and fidelity descriptors.",
      owns: ["tree structure", "tree canopy", "tree growth", "tree fidelity"],
      forbidden: ["world placement", "rendering", "terrain"],
      requires: ["n:object:vegetation"],
      provides: ["n:object:vegetation:tree", "vegetation:tree-structure", "vegetation:tree-growth"],
      proof: ["tests/core-domains/core-object-vegetation-natural-growth-smoke.mjs"]
    }),
    subdomain({
      id: "object-vegetation-foliage-domain",
      domainPath: "n:object:vegetation:foliage",
      parentDomainPath: "n:object:vegetation",
      label: "Object Vegetation Foliage",
      responsibility: "Own deterministic foliage structure and descriptors.",
      owns: ["foliage structures", "foliage descriptors"],
      forbidden: ["world placement", "rendering", "terrain"],
      requires: ["n:object:vegetation"],
      provides: ["n:object:vegetation:foliage", "vegetation:foliage"],
      proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs"]
    }),
    subdomain({
      id: "object-vegetation-ecology-domain",
      domainPath: "n:object:vegetation:ecology",
      parentDomainPath: "n:object:vegetation",
      label: "Object Vegetation Ecology",
      responsibility: "Own deterministic vegetation suitability scoring and species selection.",
      owns: ["vegetation suitability", "species selection"],
      forbidden: ["terrain sampling", "world cells", "spawn budgets"],
      requires: ["n:object:vegetation"],
      provides: ["n:object:vegetation:ecology", "vegetation:ecology-score"],
      proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs"]
    }),
    subdomain({
      id: "object-placement-domain",
      domainPath: "n:object:placement",
      label: "Object Placement",
      responsibility: "Own deterministic placement transforms, grounding, alignment, fit, and validation receipts.",
      owns: ["placement descriptors", "grounding", "alignment", "fit validation", "placement receipts"],
      forbidden: ["object identity", "terrain generation", "physics simulation", "rendering"],
      requires: ["object:descriptor-contract"],
      provides: ["n:object:placement", "object:placement-descriptor", "object:placement-receipt"],
      proof: ["src/core-domains/object/placement/tests/placement-smoke.mjs", "src/core-domains/object/placement/tests/placement-roundtrip.mjs"]
    })
  ],
  publicEntry: { subpath: "./domains/object", module: "./src/core-domains/object/index.js" },
  publicKits: [
    atomicKit({ id: "object-registry-kit", responsibility: "Own object identity and renderer-neutral lifecycle records.", domainPath: "n:object", apiName: "object", provides: ["n:object", "object:descriptor-contract", "object:registry", "object:lifecycle"], module: "./src/core-domains/object/kits/object-registry-kit/index.js", exportName: "createObjectRegistryKit", publicSubpath: "./domains/object/registry", proof: objectProof }),
    atomicKit({ id: "object-shape-kit", responsibility: "Derive and qualify renderer-neutral geometric shape candidates.", domainPath: "n:object:shape", apiName: "objectShape", requires: ["object:descriptor-contract"], provides: ["n:object:shape", "object:shape-source", "object:shape-qualified", "object:shape-jobs"], module: "./src/core-domains/object/shape/kits/object-shape-kit/index.js", exportName: "createObjectShapeKit", publicSubpath: "./domains/object/shape", proof: ["tests/core-domains/core-object-shape-domain-smoke.mjs", "tests/core-domains/core-object-shape-skinned-qualification-smoke.mjs"] }),
    atomicKit({ id: "object-fidelity-kit", responsibility: "Package and select valid object fidelity forms.", domainPath: "n:object:fidelity", apiName: "objectFidelity", requires: ["object:descriptor-contract"], provides: ["n:object:fidelity", "object:fidelity-forms", "object:fidelity-packages"], module: "./src/core-domains/object/fidelity/kits/object-fidelity-kit/index.js", exportName: "createObjectFidelityKit", publicSubpath: "./domains/object/fidelity", proof: ["tests/core-domains/core-object-fidelity-domain-smoke.mjs"] }),
    atomicKit({ id: "object-vegetation-kit", responsibility: "Own deterministic plant species, instances, and lifecycle state.", domainPath: "n:object:vegetation", apiName: "vegetation", requires: ["n:object"], provides: ["n:object:vegetation", "vegetation:species", "vegetation:instances", "vegetation:lifecycle"], module: "./src/core-domains/object/vegetation/kits/object-vegetation-kit/index.js", exportName: "createVegetationKit", publicSubpath: "./domains/object/vegetation", proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs", "tests/core-domains/core-object-vegetation-natural-growth-smoke.mjs"] }),
    atomicKit({ id: "object-tree-kit", responsibility: "Produce deterministic tree structure, canopy, growth, and fidelity descriptors.", domainPath: "n:object:vegetation:tree", apiName: "vegetationTree", requires: ["n:object:vegetation"], provides: ["n:object:vegetation:tree", "vegetation:tree-structure", "vegetation:tree-growth"], module: "./src/core-domains/object/vegetation/tree-domain/index.js", exportName: "createTreeDomainKit", publicSubpath: "./domains/object/vegetation/tree", proof: ["tests/core-domains/core-object-vegetation-natural-growth-smoke.mjs"] }),
    atomicKit({ id: "object-foliage-kit", responsibility: "Produce deterministic foliage structures and descriptors.", domainPath: "n:object:vegetation:foliage", apiName: "vegetationFoliage", requires: ["n:object:vegetation"], provides: ["n:object:vegetation:foliage", "vegetation:foliage"], module: "./src/core-domains/object/vegetation/foliage-domain/index.js", exportName: "createFoliageDomainKit", publicSubpath: "./domains/object/vegetation/foliage", proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs"] }),
    atomicKit({ id: "object-vegetation-ecology-kit", responsibility: "Score vegetation suitability and select species deterministically.", domainPath: "n:object:vegetation:ecology", apiName: "vegetationEcology", requires: ["n:object:vegetation"], provides: ["n:object:vegetation:ecology", "vegetation:ecology-score"], module: "./src/core-domains/object/vegetation/ecology-domain/index.js", exportName: "createVegetationEcologyKit", publicSubpath: "./domains/object/vegetation/ecology", proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs"] }),
    atomicKit({ id: "object-placement-kit", responsibility: "Create, validate, and replay deterministic object placement receipts.", domainPath: "n:object:placement", apiName: "objectPlacement", requires: ["object:descriptor-contract"], provides: ["n:object:placement", "object:placement-descriptor", "object:placement-receipt"], module: "./src/core-domains/object/placement/kits/object-placement-kit/index.js", exportName: "createObjectPlacementKit", publicSubpath: "./domains/object/placement", proof: ["src/core-domains/object/placement/tests/placement-smoke.mjs", "src/core-domains/object/placement/tests/placement-roundtrip.mjs"] }),
    atomicKit({ id: "object-meshoptimizer-shape-provider-kit", kind: "provider-kit", responsibility: "Resolve object shape jobs through an explicitly registered meshoptimizer-compatible provider.", domainPath: "n:object:shape", apiName: "meshoptimizerShapeProvider", requires: ["object:shape-jobs"], provides: ["object:shape-provider"], module: "./src/core-domains/object/shape/providers/meshoptimizer-shape-provider-kit/index.js", exportName: "createMeshoptimizerShapeProviderKit", publicSubpath: "./domains/object/shape/meshoptimizer-provider", proof: ["tests/core-domains/core-object-shape-domain-smoke.mjs"] }),
    atomicKit({ id: "object-shape-fidelity-adapter-kit", kind: "adapter-kit", responsibility: "Translate qualified shape records into Object Fidelity form requests.", domainPath: "n:object:fidelity", apiName: "objectShapeFidelityAdapter", requires: ["object:shape-qualified", "object:fidelity-forms"], provides: ["object:shape-fidelity-adapter"], module: "./src/core-domains/object/adapters/object-shape-fidelity-adapter-kit/index.js", exportName: "createObjectShapeFidelityAdapterKit", publicSubpath: "./domains/object/adapters/shape-fidelity", proof: ["tests/core-domains/core-object-fidelity-domain-smoke.mjs"] }),
    atomicKit({ id: "object-vegetation-bridge-kit", kind: "adapter-kit", responsibility: "Project vegetation identities into canonical Object descriptors without owning either state.", domainPath: "n:object:vegetation", apiName: "vegetationObjectBridge", requires: ["n:object", "n:object:vegetation"], provides: ["vegetation:object-bridge"], module: "./src/core-domains/object/vegetation/adapters/vegetation-object-bridge-kit/index.js", exportName: "createVegetationObjectBridgeKit", publicSubpath: "./domains/object/adapters/vegetation-object", proof: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs"] })
  ],
  providers: [{
    id: "meshoptimizer-shape-provider",
    domainPath: "n:object:shape",
    responsibility: "Provide deterministic shape derivation behind the Object Shape provider contract.",
    source: { module: "./src/core-domains/object/shape/providers/meshoptimizer-shape-provider-kit/index.js" },
    environments: ["browser", "node", "worker"],
    proofReferences: ["tests/core-domains/core-object-shape-domain-smoke.mjs"]
  }],
  adapters: [
    { id: "object-shape-fidelity-adapter", domainPath: "n:object:fidelity", responsibility: "Translate Shape qualification into Fidelity form requests.", source: { module: "./src/core-domains/object/adapters/object-shape-fidelity-adapter-kit/index.js" }, environments: ["browser", "node", "worker"], proofReferences: ["tests/core-domains/core-object-fidelity-domain-smoke.mjs"] },
    { id: "object-vegetation-bridge", domainPath: "n:object:vegetation", responsibility: "Translate vegetation instances into canonical Object descriptors.", source: { module: "./src/core-domains/object/vegetation/adapters/vegetation-object-bridge-kit/index.js" }, environments: ["browser", "node", "worker"], proofReferences: ["tests/core-domains/core-object-vegetation-domain-smoke.mjs"] }
  ]
});

export default objectDomainManifest;
