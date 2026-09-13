import { domainNode } from "../../manifest-input.js";

export default domainNode({
  id: "render-camera-domain",
  domainPath: "n:render:camera",
  parentDomainPath: "n:render",
  label: "Render Camera",
  responsibility: "Own portable camera binding, view, projection, viewport, stereo, multiview, jitter, and reprojection semantics.",
  owns: ["camera semantic records", "deterministic camera configuration", "stereo and multiview camera semantics", "camera capability tokens"],
  forbiddenResponsibilities: ["GPU handles", "provider execution", "frame submission", "platform camera APIs", "authored game camera policy"],
  requires: ["n:render", "render:provider-contract"],
  provides: [
    "n:render:camera",
    "render:camera-binding",
    "render:camera-projection",
    "render:camera-view",
    "render:stereo-camera",
    "render:multiview-camera",
    "render:camera-jitter",
    "render:camera-reprojection",
    "render:camera-viewport"
  ],
  proofReferences: ["tests/core-domains/core-graphics-domain-smoke.mjs"]
});
