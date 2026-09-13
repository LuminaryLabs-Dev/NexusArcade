import broadPhase from "./kits/broad-phase-kit/kit.manifest.js";
import spatialPartition from "./kits/spatial-partition-kit/kit.manifest.js";
import dynamicTree from "./kits/dynamic-tree-kit/kit.manifest.js";
import sweepAndPrune from "./kits/sweep-and-prune-kit/kit.manifest.js";
import broadPhasePair from "./kits/broad-phase-pair-kit/kit.manifest.js";
import narrowPhase from "./kits/narrow-phase-kit/kit.manifest.js";
import shapeIntersection from "./kits/shape-intersection-kit/kit.manifest.js";
import gjkDetection from "./kits/gjk-detection-kit/kit.manifest.js";
import epaPenetration from "./kits/epa-penetration-kit/kit.manifest.js";
import continuousCollision from "./kits/continuous-collision-kit/kit.manifest.js";
import collisionDetectionResult from "./kits/collision-detection-result-kit/kit.manifest.js";

export const PHYSICS_DETECTION_KIT_MANIFESTS = Object.freeze([
  collisionDetectionResult,
  broadPhasePair,
  spatialPartition,
  dynamicTree,
  sweepAndPrune,
  shapeIntersection,
  gjkDetection,
  epaPenetration,
  continuousCollision,
  narrowPhase,
  broadPhase
]);
