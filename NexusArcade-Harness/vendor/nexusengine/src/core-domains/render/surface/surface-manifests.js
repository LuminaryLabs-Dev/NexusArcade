import renderSurface from "./kits/render-surface-kit/kit.manifest.js";
import windowSurface from "./kits/window-surface-kit/kit.manifest.js";
import offscreenSurface from "./kits/offscreen-surface-kit/kit.manifest.js";
import swapchainSurface from "./kits/swapchain-surface-kit/kit.manifest.js";
import viewport from "./kits/viewport-kit/kit.manifest.js";
import scissor from "./kits/scissor-kit/kit.manifest.js";
import resize from "./kits/resize-kit/kit.manifest.js";
import fullscreen from "./kits/fullscreen-kit/kit.manifest.js";
import surfaceFormat from "./kits/surface-format-kit/kit.manifest.js";

export const RENDER_SURFACE_KIT_MANIFESTS = Object.freeze([
  renderSurface,
  surfaceFormat,
  windowSurface,
  offscreenSurface,
  swapchainSurface,
  viewport,
  scissor,
  resize,
  fullscreen
]);
