import materialContract from "./kits/material-contract-kit/kit.manifest.js";
import materialBinding from "./kits/material-binding-kit/kit.manifest.js";
import materialParameter from "./kits/material-parameter-kit/kit.manifest.js";
import textureBinding from "./kits/texture-binding-kit/kit.manifest.js";
import samplerBinding from "./kits/sampler-binding-kit/kit.manifest.js";
import materialInstance from "./kits/material-instance-kit/kit.manifest.js";
import materialVariant from "./kits/material-variant-kit/kit.manifest.js";
import materialValidation from "./kits/material-validation-kit/kit.manifest.js";
import materialCache from "./kits/material-cache-kit/kit.manifest.js";

export const RENDER_MATERIAL_KIT_MANIFESTS = Object.freeze([
  materialContract,
  materialBinding,
  materialParameter,
  textureBinding,
  samplerBinding,
  materialInstance,
  materialVariant,
  materialValidation,
  materialCache
]);
