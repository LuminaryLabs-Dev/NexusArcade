import bodyIdentity from "./kits/body-identity-kit/kit.manifest.js";
import bodyType from "./kits/body-type-kit/kit.manifest.js";
import bodyPose from "./kits/body-pose-kit/kit.manifest.js";
import bodyVelocity from "./kits/body-velocity-kit/kit.manifest.js";
import bodyForce from "./kits/body-force-kit/kit.manifest.js";
import bodyMass from "./kits/body-mass-kit/kit.manifest.js";
import bodyInertia from "./kits/body-inertia-kit/kit.manifest.js";
import bodyDamping from "./kits/body-damping-kit/kit.manifest.js";
import bodySleep from "./kits/body-sleep-kit/kit.manifest.js";
import bodyWake from "./kits/body-wake-kit/kit.manifest.js";
import bodyLifecycle from "./kits/body-lifecycle-kit/kit.manifest.js";
import bodyState from "./kits/body-state-kit/kit.manifest.js";
import bodyRegistry from "./kits/body-registry-kit/kit.manifest.js";

export const PHYSICS_BODY_KIT_MANIFESTS = Object.freeze([
  bodyIdentity,
  bodyType,
  bodyPose,
  bodyVelocity,
  bodyForce,
  bodyMass,
  bodyInertia,
  bodyDamping,
  bodySleep,
  bodyWake,
  bodyLifecycle,
  bodyState,
  bodyRegistry
]);

