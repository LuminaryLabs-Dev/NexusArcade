import { atomicKit } from "../../../../manifest-input.js";

export default atomicKit({
  id: "collider-attachment-kit",
  responsibility: "Normalize a collider attachment to public Body and Shape registry identities.",
  domainPath: "n:physics:collider",
  apiName: "physicsColliderAttachment",
  requires: ["n:physics", "physics:body-registry", "physics:shape-registry"],
  provides: ["n:physics:collider", "physics:collider-attachment"],
  module: "./src/core-domains/physics/collider/kits/collider-attachment-kit/index.js",
  exportName: "createColliderAttachmentKit",
  publicSubpath: "./domains/physics/collider/attachment",
  proofReferences: ["tests/core-domains/core-physics-collider-smoke.mjs"]
});
