import { buildCdnUrl } from "../core/source-policy.mjs";
import { virtualGamePath } from "../core/paths.mjs";

export class ArcadePlayer {
  constructor(iframe, { scopePath = "/nexus-arcade/", openWindow = (url) => globalThis.open(url, "_blank", "noopener,noreferrer") } = {}) {
    if (!iframe) throw new TypeError("An iframe is required");
    this.iframe = iframe;
    this.scopePath = scopePath;
    this.openWindow = openWindow;
    this.iframe.removeAttribute("sandbox");
    this.iframe.setAttribute("allow", "autoplay; fullscreen; gamepad");
    this.iframe.setAttribute("allowfullscreen", "");
  }

  launchPath(manifest) {
    return virtualGamePath(this.scopePath, manifest);
  }

  play(manifest) {
    const path = this.launchPath(manifest);
    this.iframe.src = path;
    return path;
  }

  openInstalled(manifest) {
    return this.openWindow(this.launchPath(manifest));
  }

  directSourceUrl(manifest) {
    return buildCdnUrl(manifest.source, manifest.entry);
  }

  openSource(manifest) {
    return this.openWindow(this.directSourceUrl(manifest));
  }
}
