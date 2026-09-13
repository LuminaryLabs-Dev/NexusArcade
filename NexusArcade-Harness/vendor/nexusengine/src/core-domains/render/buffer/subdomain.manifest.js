import { domainNode } from "../../manifest-input.js";

const proof = ["tests/core-domains/core-graphics-domain-smoke.mjs"];

export default domainNode({
  id: "render-buffer-domain",
  domainPath: "n:render:buffer",
  parentDomainPath: "n:render",
  label: "Render Buffer",
  responsibility: "Own portable logical Buffer descriptors, explicit layouts, semantic typed views, and bounded provider update receipts.",
  owns: [
    "portable logical Buffer records",
    "explicit Buffer layouts and formats",
    "Vertex Index Uniform Storage Instance and Indirect Buffer views",
    "bounded Buffer content revision state",
    "provider-neutral Buffer update requests and receipts"
  ],
  forbiddenResponsibilities: [
    "source asset bytes or decoding",
    "Render resource identity or residency",
    "Device memory capacity or queue execution",
    "GPU handles allocation or mapping",
    "provider byte transfer or command execution",
    "Geometry mesh or Texture meaning"
  ],
  requires: ["n:render", "n:render:resource", "render:resource-identity", "render:resource-lifecycle", "render:device-queue"],
  provides: [
    "n:render:buffer",
    "render:buffer-resource",
    "render:buffer-layout",
    "render:vertex-buffer",
    "render:index-buffer",
    "render:uniform-buffer",
    "render:storage-buffer",
    "render:instance-buffer",
    "render:indirect-buffer"
  ],
  proofReferences: proof
});
