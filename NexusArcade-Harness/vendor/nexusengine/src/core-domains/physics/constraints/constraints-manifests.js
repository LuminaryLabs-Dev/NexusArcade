import ballSocket from "./kits/ball-socket-constraint-kit/kit.manifest.js";
import coneTwist from "./kits/cone-twist-constraint-kit/kit.manifest.js";
import distance from "./kits/distance-constraint-kit/kit.manifest.js";
import drive from "./kits/drive-constraint-kit/kit.manifest.js";
import fixed from "./kits/fixed-constraint-kit/kit.manifest.js";
import hinge from "./kits/hinge-constraint-kit/kit.manifest.js";
import limit from "./kits/limit-constraint-kit/kit.manifest.js";
import motor from "./kits/motor-constraint-kit/kit.manifest.js";
import slider from "./kits/slider-constraint-kit/kit.manifest.js";
import spring from "./kits/spring-constraint-kit/kit.manifest.js";
import constraintBreak from "./kits/constraint-break-kit/kit.manifest.js";
import registry from "./kits/constraint-registry-kit/kit.manifest.js";

export const PHYSICS_CONSTRAINT_KIT_MANIFESTS = Object.freeze([
  ballSocket,
  coneTwist,
  distance,
  drive,
  fixed,
  hinge,
  limit,
  motor,
  slider,
  spring,
  constraintBreak,
  registry
]);
