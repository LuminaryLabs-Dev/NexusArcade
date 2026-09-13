import textureFormat from "./kits/texture-format-kit/kit.manifest.js";
import textureResource from "./kits/texture-resource-kit/kit.manifest.js";
import texture2d from "./kits/texture-2d-kit/kit.manifest.js";
import textureCube from "./kits/texture-cube-kit/kit.manifest.js";
import textureArray from "./kits/texture-array-kit/kit.manifest.js";
import renderTargetTexture from "./kits/render-target-texture-kit/kit.manifest.js";
import depthTexture from "./kits/depth-texture-kit/kit.manifest.js";
import shadowTexture from "./kits/shadow-texture-kit/kit.manifest.js";
import mipmap from "./kits/mipmap-kit/kit.manifest.js";
import textureStream from "./kits/texture-stream-kit/kit.manifest.js";
import textureResidency from "./kits/texture-residency-kit/kit.manifest.js";

export const RENDER_TEXTURE_KIT_MANIFESTS = Object.freeze([
  textureFormat,
  textureResource,
  texture2d,
  textureCube,
  textureArray,
  renderTargetTexture,
  depthTexture,
  shadowTexture,
  mipmap,
  textureStream,
  textureResidency
]);
