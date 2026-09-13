import bufferResource from "./kits/buffer-resource-kit/kit.manifest.js";
import bufferLayout from "./kits/buffer-layout-kit/kit.manifest.js";
import vertexBuffer from "./kits/vertex-buffer-kit/kit.manifest.js";
import indexBuffer from "./kits/index-buffer-kit/kit.manifest.js";
import uniformBuffer from "./kits/uniform-buffer-kit/kit.manifest.js";
import storageBuffer from "./kits/storage-buffer-kit/kit.manifest.js";
import instanceBuffer from "./kits/instance-buffer-kit/kit.manifest.js";
import indirectBuffer from "./kits/indirect-buffer-kit/kit.manifest.js";

export const RENDER_BUFFER_KIT_MANIFESTS = Object.freeze([
  bufferResource,
  bufferLayout,
  vertexBuffer,
  indexBuffer,
  uniformBuffer,
  storageBuffer,
  instanceBuffer,
  indirectBuffer
]);
