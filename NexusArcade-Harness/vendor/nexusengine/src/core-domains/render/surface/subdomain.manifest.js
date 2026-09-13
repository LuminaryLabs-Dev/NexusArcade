import { domainNode } from "../../manifest-input.js";

export default domainNode({
  id: "render-surface-domain",
  domainPath: "n:render:surface",
  parentDomainPath: "n:render",
  label: "Render Surface",
  responsibility: "Own portable output-surface descriptors, logical regions, format choices, and deterministic transition intents.",
  owns: [
    "portable surface identities and dimensions",
    "window, offscreen, and swapchain descriptors",
    "viewport and scissor regions",
    "resize and fullscreen intents",
    "surface format selections",
    "exact-once descriptor lifecycle records"
  ],
  forbiddenResponsibilities: [
    "DOM elements or native window handles",
    "GPU swapchains or backend resources",
    "provider execution or platform transitions",
    "frame encoding, submission, or presentation",
    "Presentation graph ownership"
  ],
  requires: ["n:render", "render:provider-contract", "render:device-contract", "render:device-lifecycle"],
  provides: [
    "n:render:surface",
    "render:surface",
    "render:window-surface",
    "render:offscreen-surface",
    "render:swapchain-surface",
    "render:viewport",
    "render:scissor",
    "render:resize",
    "render:fullscreen",
    "render:surface-format"
  ],
  proofReferences: ["tests/core-domains/core-render-surface-smoke.mjs"]
});
