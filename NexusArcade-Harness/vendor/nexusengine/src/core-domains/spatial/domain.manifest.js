import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";
import spatialScale from "./scale/subdomain.manifest.js";
import spatialScaleKit from "./scale/kits/spatial-scale-kit/kit.manifest.js";

const spatialProof = ["tests/core-domain-kits-smoke.mjs", "tests/core-kits/core-utility-articulation-smoke.mjs"];
const utilityProof = ["tests/core-kits/core-utility-articulation-smoke.mjs"];

export const spatialDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "spatial-domain", domainPath: "n:spatial", label: "Spatial", responsibility: "Own renderer-neutral transforms, coordinate spaces, bounds, zones, distance queries, and deterministic spatial math.", owns: ["transforms", "coordinate spaces", "bounds", "zones", "distance queries", "spatial math"], forbiddenResponsibilities: ["world generation", "physics resolution", "camera policy", "renderer coordinates"], provides: ["n:spatial", "spatial:transform", "spatial:bounds", "spatial:query", "spatial:math"], proofReferences: spatialProof }),
  subdomains: [spatialScale],
  publicEntry: { subpath: "./domains/spatial", module: "./src/core-domains/spatial/index.js" },
  publicKits: [
    atomicKit({ id: "spatial-contract-kit", responsibility: "Describe transforms, bounds, zones, spaces, and spatial query requests.", domainPath: "n:spatial", apiName: "spatial", provides: ["n:spatial", "spatial:transform", "spatial:bounds", "spatial:query"], module: "./src/core-domains/spatial/kits/spatial-kit/index.js", exportName: "createSpatialKit", publicSubpath: "./domains/spatial/contracts", proofReferences: spatialProof }),
    atomicKit({ id: "spatial-angle-math-kit", responsibility: "Normalize, compare, and interpolate angular values.", domainPath: "n:spatial", apiName: "angleMath", provides: ["spatial:angle-math"], module: "./src/core-domains/spatial/kits/angle-math-kit.js", exportName: "createAngleMathKit", publicSubpath: "./domains/spatial/angle-math", proofReferences: utilityProof }),
    atomicKit({ id: "spatial-vector-math-kit", responsibility: "Create and operate on renderer-neutral vector values.", domainPath: "n:spatial", apiName: "vectorMath", provides: ["spatial:vector-math"], module: "./src/core-domains/spatial/kits/vector-math-kit.js", exportName: "createVectorMathKit", publicSubpath: "./domains/spatial/vector-math", proofReferences: utilityProof }),
    atomicKit({ id: "spatial-transform-math-kit", responsibility: "Calculate deterministic transforms, bases, interpolation, and planar projections.", domainPath: "n:spatial", apiName: "transformMath", provides: ["spatial:transform-math"], module: "./src/core-domains/spatial/kits/transform-math-kit.js", exportName: "createTransformMathKit", publicSubpath: "./domains/spatial/transform-math", proofReferences: utilityProof }),
    atomicKit({ id: "spatial-quaternion-math-kit", responsibility: "Create, compose, normalize, rotate, and interpolate quaternions.", domainPath: "n:spatial", apiName: "quaternionMath", provides: ["spatial:quaternion-math"], module: "./src/core-domains/spatial/kits/quaternion-math-kit.js", exportName: "createQuaternionMathKit", publicSubpath: "./domains/spatial/quaternion-math", proofReferences: utilityProof }),
    spatialScaleKit
  ]
}));

export default spatialDomainManifest;
