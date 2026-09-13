import renderDeviceContract from "./kits/render-device-contract-kit/kit.manifest.js";
import deviceFeature from "./kits/device-feature-kit/kit.manifest.js";
import deviceLimit from "./kits/device-limit-kit/kit.manifest.js";
import deviceCapability from "./kits/device-capability-kit/kit.manifest.js";
import deviceMemory from "./kits/device-memory-kit/kit.manifest.js";
import deviceQueue from "./kits/device-queue-kit/kit.manifest.js";
import deviceLifecycle from "./kits/device-lifecycle-kit/kit.manifest.js";
import deviceLoss from "./kits/device-loss-kit/kit.manifest.js";
import deviceDiagnostics from "./kits/device-diagnostics-kit/kit.manifest.js";

export const RENDER_DEVICE_KIT_MANIFESTS = Object.freeze([
  renderDeviceContract,
  deviceFeature,
  deviceLimit,
  deviceCapability,
  deviceMemory,
  deviceQueue,
  deviceLifecycle,
  deviceLoss,
  deviceDiagnostics
]);
