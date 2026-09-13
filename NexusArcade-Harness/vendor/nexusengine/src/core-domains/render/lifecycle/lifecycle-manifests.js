import renderInstallation from "./kits/render-installation-kit/kit.manifest.js";
import renderStartup from "./kits/render-startup-kit/kit.manifest.js";
import renderShutdown from "./kits/render-shutdown-kit/kit.manifest.js";
import renderRecovery from "./kits/render-recovery-kit/kit.manifest.js";
import renderReset from "./kits/render-reset-kit/kit.manifest.js";
import renderSnapshot from "./kits/render-snapshot-kit/kit.manifest.js";

export const RENDER_LIFECYCLE_KIT_MANIFESTS = Object.freeze([
  renderInstallation,
  renderStartup,
  renderShutdown,
  renderRecovery,
  renderReset,
  renderSnapshot
]);
