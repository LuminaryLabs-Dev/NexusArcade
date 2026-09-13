import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-texture-domain",
  domainPath: "n:render:texture",
  parentDomainPath: "n:render",
  label: "Render Texture",
  responsibility: "Own portable logical Texture descriptors, typed views, formats, mip plans, streaming records, and proven subresource residency.",
  owns: [
    "portable logical Texture records",
    "2D Cube and Array Texture views",
    "color depth and shadow execution views",
    "portable Texture format and block layout records",
    "explicit contiguous mip-chain plans",
    "Buffer-backed stream requests and provider receipts",
    "desired and proven resident Texture subresources"
  ],
  forbiddenResponsibilities: [
    "source image content or decoding",
    "Render Resource identity or whole-resource lifecycle",
    "Buffer staging byte ownership",
    "Presentation material image lighting or authored shadow meaning",
    "Pipeline attachment or pass execution",
    "GPU handles allocation upload mip generation eviction or repair",
    "provider-specific format enums"
  ],
  requires: [
    "n:render",
    "n:render:resource",
    "n:render:buffer",
    "render:resource-identity",
    "render:resource-lifecycle",
    "render:buffer-resource",
    "render:device-queue"
  ],
  provides: [
    "n:render:texture",
    "render:texture-format",
    "render:texture-resource",
    "render:texture-2d",
    "render:texture-cube",
    "render:texture-array",
    "render:target-texture",
    "render:depth-texture",
    "render:shadow-texture",
    "render:texture-mipmap",
    "render:texture-stream",
    "render:texture-residency"
  ],
  proofReferences: proof
});
