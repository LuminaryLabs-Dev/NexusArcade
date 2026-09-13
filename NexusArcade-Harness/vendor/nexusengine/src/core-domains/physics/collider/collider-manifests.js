import colliderIdentity from "./kits/collider-identity-kit/kit.manifest.js";
import colliderAttachment from "./kits/collider-attachment-kit/kit.manifest.js";
import colliderPose from "./kits/collider-pose-kit/kit.manifest.js";
import colliderMaterial from "./kits/collider-material-kit/kit.manifest.js";
import collisionLayer from "./kits/collision-layer-kit/kit.manifest.js";
import collisionMask from "./kits/collision-mask-kit/kit.manifest.js";
import collisionGroup from "./kits/collision-group-kit/kit.manifest.js";
import colliderFilter from "./kits/collider-filter-kit/kit.manifest.js";
import sensorCollider from "./kits/sensor-collider-kit/kit.manifest.js";
import triggerCollider from "./kits/trigger-collider-kit/kit.manifest.js";
import colliderLifecycle from "./kits/collider-lifecycle-kit/kit.manifest.js";
import colliderRegistry from "./kits/collider-registry-kit/kit.manifest.js";

export const PHYSICS_COLLIDER_KIT_MANIFESTS = Object.freeze([
  colliderIdentity,
  colliderAttachment,
  colliderPose,
  colliderMaterial,
  collisionLayer,
  collisionMask,
  collisionGroup,
  colliderFilter,
  sensorCollider,
  triggerCollider,
  colliderLifecycle,
  colliderRegistry
]);
