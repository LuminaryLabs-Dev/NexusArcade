import { defineCoreDomainManifest } from "../domain-manifest.js";
import { domainNode, manifestShell } from "../manifest-input.js";
import { PHYSICS_BODY_KIT_MANIFESTS } from "./body/body-manifests.js";
import physicsBodySubdomainManifest from "./body/subdomain.manifest.js";
import { PHYSICS_COLLIDER_KIT_MANIFESTS } from "./collider/collider-manifests.js";
import physicsColliderSubdomainManifest from "./collider/subdomain.manifest.js";
import { PHYSICS_CONSTRAINT_KIT_MANIFESTS } from "./constraints/constraints-manifests.js";
import physicsConstraintsSubdomainManifest from "./constraints/subdomain.manifest.js";
import { PHYSICS_CONTRACT_KIT_MANIFESTS } from "./contracts/contract-manifests.js";
import physicsContractsSubdomainManifest from "./contracts/subdomain.manifest.js";
import { PHYSICS_DETECTION_KIT_MANIFESTS } from "./detection/detection-manifests.js";
import physicsDetectionSubdomainManifest from "./detection/subdomain.manifest.js";
import { PHYSICS_LIFECYCLE_KIT_MANIFESTS } from "./lifecycle/lifecycle-manifests.js";
import physicsLifecycleSubdomainManifest from "./lifecycle/subdomain.manifest.js";
import { PHYSICS_MATERIAL_KIT_MANIFESTS } from "./material/material-manifests.js";
import physicsMaterialSubdomainManifest from "./material/subdomain.manifest.js";
import { PHYSICS_SHAPE_KIT_MANIFESTS } from "./shape/shape-manifests.js";
import physicsShapeSubdomainManifest from "./shape/subdomain.manifest.js";
import { PHYSICS_WORLD_KIT_MANIFESTS } from "./world/world-manifests.js";
import physicsWorldSubdomainManifest from "./world/subdomain.manifest.js";

const proof = ["tests/core-domains/core-physics-canonical-domain-contract-smoke.mjs"];

export const physicsDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({
    id: "physics-domain",
    domainPath: "n:physics",
    label: "Physics",
    responsibility: "Own the canonical backend-neutral Physics boundary and compose its atomic capability subdomains.",
    owns: ["Physics domain identity", "Physics capability catalog", "provider-neutral Physics contracts"],
    forbiddenResponsibilities: ["concrete physics backend implementation", "renderer resources or frame submission", "input bindings", "gameplay damage or scoring"],
    requires: ["n:runtime"],
    provides: ["n:physics", "physics:domain-contract"],
    proofReferences: proof
  }),
  subdomains: [
    physicsContractsSubdomainManifest,
    physicsLifecycleSubdomainManifest,
    physicsBodySubdomainManifest,
    physicsShapeSubdomainManifest,
    physicsMaterialSubdomainManifest,
    physicsColliderSubdomainManifest,
    physicsDetectionSubdomainManifest,
    physicsConstraintsSubdomainManifest,
    physicsWorldSubdomainManifest
  ],
  publicEntry: { subpath: "./domains/physics", module: "./src/core-domains/physics/index.js" },
  publicEntries: [
    { domainPath: "n:physics:contracts", subpath: "./domains/physics/contracts", module: "./src/core-domains/physics/contracts/index.js" },
    { domainPath: "n:physics:lifecycle", subpath: "./domains/physics/lifecycle", module: "./src/core-domains/physics/lifecycle/index.js" },
    { domainPath: "n:physics:body", subpath: "./domains/physics/body", module: "./src/core-domains/physics/body/index.js" },
    { domainPath: "n:physics:shape", subpath: "./domains/physics/shape", module: "./src/core-domains/physics/shape/index.js" },
    { domainPath: "n:physics:material", subpath: "./domains/physics/material", module: "./src/core-domains/physics/material/index.js" },
    { domainPath: "n:physics:collider", subpath: "./domains/physics/collider", module: "./src/core-domains/physics/collider/index.js" },
    { domainPath: "n:physics:detection", subpath: "./domains/physics/detection", module: "./src/core-domains/physics/detection/index.js" },
    { domainPath: "n:physics:constraints", subpath: "./domains/physics/constraints", module: "./src/core-domains/physics/constraints/index.js" },
    { domainPath: "n:physics:world", subpath: "./domains/physics/world", module: "./src/core-domains/physics/world/index.js" }
  ],
  publicKits: [
    ...PHYSICS_CONTRACT_KIT_MANIFESTS,
    ...PHYSICS_LIFECYCLE_KIT_MANIFESTS,
    ...PHYSICS_BODY_KIT_MANIFESTS,
    ...PHYSICS_SHAPE_KIT_MANIFESTS,
    ...PHYSICS_MATERIAL_KIT_MANIFESTS,
    ...PHYSICS_COLLIDER_KIT_MANIFESTS,
    ...PHYSICS_DETECTION_KIT_MANIFESTS,
    ...PHYSICS_CONSTRAINT_KIT_MANIFESTS,
    ...PHYSICS_WORLD_KIT_MANIFESTS
  ]
}));

export default physicsDomainManifest;
