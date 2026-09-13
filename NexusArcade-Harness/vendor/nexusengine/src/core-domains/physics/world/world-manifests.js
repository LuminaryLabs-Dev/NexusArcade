import physicsWorld from "./kits/physics-world-kit/kit.manifest.js";
import physicsWorldSettings from "./kits/physics-world-settings-kit/kit.manifest.js";
import gravityField from "./kits/gravity-field-kit/kit.manifest.js";
import forceField from "./kits/force-field-kit/kit.manifest.js";
import windField from "./kits/wind-field-kit/kit.manifest.js";
import timeScale from "./kits/time-scale-kit/kit.manifest.js";
import simulationRegion from "./kits/simulation-region-kit/kit.manifest.js";

export const PHYSICS_WORLD_KIT_MANIFESTS = Object.freeze([
  physicsWorldSettings,
  gravityField,
  forceField,
  windField,
  timeScale,
  simulationRegion,
  physicsWorld
]);
