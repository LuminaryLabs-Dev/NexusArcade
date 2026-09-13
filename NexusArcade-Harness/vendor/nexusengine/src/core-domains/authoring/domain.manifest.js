import modifierManifest from "./modifier/kits/authoring-modifier-service-kit/kit.manifest.js";
import modifierDomain from "./modifier/subdomain.manifest.js";
import publishingManifest from "./publishing/kits/authoring-publishing-service-kit/kit.manifest.js";
import publishingDomain from "./publishing/subdomain.manifest.js";
import sequenceManifest from "./sequence/kits/authoring-sequence-service-kit/kit.manifest.js";
import sequenceDomain from "./sequence/subdomain.manifest.js";
import domainCompositionManifest from "./domain-composition/kits/authoring-domain-composition-service-kit/kit.manifest.js";
import domainCompositionDomain from "./domain-composition/subdomain.manifest.js";
import assemblyManifest from "./assembly/kits/authoring-assembly-service-kit/kit.manifest.js";
import assemblyDomain from "./assembly/subdomain.manifest.js";
import animationManifest from "./animation/kits/authoring-animation-service-kit/kit.manifest.js";
import animationDomain from "./animation/subdomain.manifest.js";
import skinManifest from "./skin/kits/authoring-skin-service-kit/kit.manifest.js";
import skinDomain from "./skin/subdomain.manifest.js";
import rigManifest from "./rig/kits/authoring-rig-service-kit/kit.manifest.js";
import rigDomain from "./rig/subdomain.manifest.js";
import paintManifest from "./paint/kits/authoring-paint-service-kit/kit.manifest.js";
import paintDomain from "./paint/subdomain.manifest.js";
import materialManifest from "./material/kits/authoring-material-service-kit/kit.manifest.js";
import materialDomain from "./material/subdomain.manifest.js";
import uvManifest from "./uv/kits/authoring-uv-service-kit/kit.manifest.js";
import uvDomain from "./uv/subdomain.manifest.js";
import curveManifest from "./curve/kits/authoring-curve-service-kit/kit.manifest.js";
import curveDomain from "./curve/subdomain.manifest.js";
import sculptManifest from "./sculpt/kits/authoring-sculpt-service-kit/kit.manifest.js";
import sculptDomain from "./sculpt/subdomain.manifest.js";
import brushManifest from "./brush/kits/authoring-brush-service-kit/kit.manifest.js";
import brushDomain from "./brush/subdomain.manifest.js";
import workspaceManifest from "./workspace/kits/authoring-workspace-service-kit/kit.manifest.js";
import workspaceDomain from "./workspace/subdomain.manifest.js";
import { defineCoreDomainManifest } from "../domain-manifest.js";
import { domainNode, manifestShell } from "../manifest-input.js";
import contractManifest from "./kits/authoring-domain-contract-kit/kit.manifest.js";
import projectManifest from "./project/kits/authoring-project-document-kit/kit.manifest.js";
import meshManifest from "./mesh/kits/authoring-mesh-document-kit/kit.manifest.js";
import editingManifest from "./editing/kits/authoring-editing-session-kit/kit.manifest.js";
import projectDomain from "./project/subdomain.manifest.js";
import meshDomain from "./mesh/subdomain.manifest.js";
import editingDomain from "./editing/subdomain.manifest.js";
export default defineCoreDomainManifest(
  manifestShell({
    root: domainNode({
      id: "authoring-domain",
      domainPath: "n:authoring",
      label: "Authoring",
      responsibility:
        "Own editable source documents and typed editing operations.",
      owns: ["editable source contracts", "source mutation protocols"],
      forbiddenResponsibilities: [
        "runtime playback",
        "renderers",
        "codecs",
        "filesystem",
      ],
      requires: ["n:runtime"],
      provides: ["n:authoring"],
      proofReferences: [
        "tests/core-domains/core-authoring-foundation.mjs",
        "tests/core-domains/core-authoring-public.mjs",
        "tests/core-domains/core-authoring-geometry.mjs",
        "tests/core-domains/core-authoring-surfaces-rig.mjs",
        "tests/core-domains/core-authoring-integration.mjs",
        "tests/core-domains/core-authoring-modeling.mjs",
      ],
      proofStatus: "proven",
    }),
    subdomains: [
      modifierDomain,
      publishingDomain,
      sequenceDomain,
      domainCompositionDomain,
      assemblyDomain,
      animationDomain,
      skinDomain,
      rigDomain,
      paintDomain,
      materialDomain,
      uvDomain,
      curveDomain,
      sculptDomain,
      brushDomain,
      workspaceDomain,
      projectDomain,
      meshDomain,
      editingDomain,
    ],
    publicEntry: {
      subpath: "./domains/authoring",
      module: "./src/core-domains/authoring/index.js",
    },
    publicKits: [
      modifierManifest,
      publishingManifest,
      sequenceManifest,
      domainCompositionManifest,
      assemblyManifest,
      animationManifest,
      skinManifest,
      rigManifest,
      paintManifest,
      materialManifest,
      uvManifest,
      curveManifest,
      sculptManifest,
      brushManifest,
      workspaceManifest,
      contractManifest,
      projectManifest,
      meshManifest,
      editingManifest,
    ],
  }),
);
