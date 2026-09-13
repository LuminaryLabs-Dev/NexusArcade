import physicsInstallation from "./kits/physics-installation-kit/kit.manifest.js";
import physicsStartup from "./kits/physics-startup-kit/kit.manifest.js";
import physicsStep from "./kits/physics-step-kit/kit.manifest.js";
import physicsShutdown from "./kits/physics-shutdown-kit/kit.manifest.js";
import physicsReset from "./kits/physics-reset-kit/kit.manifest.js";
import physicsSnapshot from "./kits/physics-snapshot-kit/kit.manifest.js";

export const PHYSICS_LIFECYCLE_KIT_MANIFESTS = Object.freeze([
  physicsInstallation,
  physicsStartup,
  physicsStep,
  physicsShutdown,
  physicsReset,
  physicsSnapshot
]);
