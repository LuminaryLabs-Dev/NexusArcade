import shape_identity from "./kits/shape-identity/kit.manifest.js";
import shape_registry from "./kits/shape-registry/kit.manifest.js";
import shape_validation from "./kits/shape-validation/kit.manifest.js";
import sphere_shape from "./kits/sphere-shape/kit.manifest.js";
import box_shape from "./kits/box-shape/kit.manifest.js";
import capsule_shape from "./kits/capsule-shape/kit.manifest.js";
import cylinder_shape from "./kits/cylinder-shape/kit.manifest.js";
import cone_shape from "./kits/cone-shape/kit.manifest.js";
import plane_shape from "./kits/plane-shape/kit.manifest.js";
import convex_shape from "./kits/convex-shape/kit.manifest.js";
import triangle_mesh_shape from "./kits/triangle-mesh-shape/kit.manifest.js";
import heightfield_shape from "./kits/heightfield-shape/kit.manifest.js";
import compound_shape from "./kits/compound-shape/kit.manifest.js";
import scaled_shape from "./kits/scaled-shape/kit.manifest.js";
export const PHYSICS_SHAPE_KIT_MANIFESTS = Object.freeze([
  shape_identity,
  shape_validation,
  sphere_shape,
  box_shape,
  capsule_shape,
  cylinder_shape,
  cone_shape,
  plane_shape,
  convex_shape,
  triangle_mesh_shape,
  heightfield_shape,
  compound_shape,
  scaled_shape,
  shape_registry
]);
