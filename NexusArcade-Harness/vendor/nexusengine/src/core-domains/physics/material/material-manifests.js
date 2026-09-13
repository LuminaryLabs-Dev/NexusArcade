import physicsMaterial from "./kits/physics-material-kit/kit.manifest.js";
import frictionMaterial from "./kits/friction-material-kit/kit.manifest.js";
import restitutionMaterial from "./kits/restitution-material-kit/kit.manifest.js";
import densityMaterial from "./kits/density-material-kit/kit.manifest.js";
import surfaceMaterial from "./kits/surface-material-kit/kit.manifest.js";
import materialCombinePolicy from "./kits/material-combine-policy-kit/kit.manifest.js";

export const PHYSICS_MATERIAL_KIT_MANIFESTS = Object.freeze([
  frictionMaterial,
  restitutionMaterial,
  densityMaterial,
  surfaceMaterial,
  materialCombinePolicy,
  physicsMaterial
]);
