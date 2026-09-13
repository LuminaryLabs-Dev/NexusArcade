import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";

const hostProof = ["tests/core-domain-kits-smoke.mjs"];
const gpuProof = ["tests/core-domains/core-gpu-host-smoke.mjs"];

function gpuNode(id, path, parent, label, responsibility, owns, forbidden, requires = ["n:host:gpu"]) {
  return domainNode({
    id,
    domainPath: path,
    parentDomainPath: parent,
    label,
    responsibility,
    owns,
    forbiddenResponsibilities: forbidden,
    requires,
    provides: [path],
    proofReferences: gpuProof
  });
}

const gpuSubdomains = [
  gpuNode(
    "host-gpu-domain",
    "n:host:gpu",
    "n:host",
    "Host GPU",
    "Own the shared GPU environment, portable physical-resource identity, device lifecycle, cross-consumer readiness, and recovery used by Compute and Render.",
    ["shared GPU capability", "logical GPU device identity", "shared queue identity", "portable physical GPU-resource identity", "GPU resource residency and lifetime", "cross-consumer resource readiness", "GPU device-loss recovery"],
    ["compute algorithms", "WGSL compute semantics", "render materials", "draw semantics", "world-generation rules", "game logic", "raw GPU handles in portable state"],
    ["n:host"]
  ),
  gpuNode("host-gpu-capability-domain", "n:host:gpu:capability", "n:host:gpu", "Host GPU Capability", "Own backend-neutral GPU features, limits, profiles, and compatibility requirements.", ["GPU features", "GPU limits", "GPU capability profiles", "GPU compatibility requirements"], ["device acquisition", "compute dispatch", "render pipelines"]),
  gpuNode("host-gpu-device-domain", "n:host:gpu:device", "n:host:gpu", "Host GPU Device", "Own portable logical GPU device identity and the device lifecycle shared by GPU consumers.", ["logical GPU device identity", "device generation", "device readiness", "shared device state"], ["raw GPUDevice handles", "compute pipelines", "render passes"]),
  gpuNode("host-gpu-device-adapter-domain", "n:host:gpu:device:adapter", "n:host:gpu:device", "Host GPU Adapter", "Own portable adapter discovery and selection semantics.", ["adapter discovery", "adapter compatibility", "adapter selection"], ["raw GPUAdapter handles", "product preference policy", "render surfaces"], ["n:host:gpu:device"]),
  gpuNode("host-gpu-device-logical-domain", "n:host:gpu:device:logical-device", "n:host:gpu:device", "Host GPU Logical Device", "Own logical-device acquisition, identity, generation, and state.", ["logical-device acquisition", "logical-device identity", "logical-device generation", "logical-device state"], ["raw GPUDevice handles", "resource interpretation", "shader execution"], ["n:host:gpu:device"]),
  gpuNode("host-gpu-device-queue-domain", "n:host:gpu:device:queue", "n:host:gpu:device", "Host GPU Queue", "Own portable shared-queue submission ordering and completion receipts.", ["shared queue identity", "submission sequence", "queue completion receipts"], ["raw GPUQueue handles", "Compute graph ordering", "Render pass meaning"], ["n:host:gpu:device"]),
  gpuNode("host-gpu-device-lifecycle-domain", "n:host:gpu:device:lifecycle", "n:host:gpu:device", "Host GPU Device Lifecycle", "Own readiness, loss, release, and generation transitions for the shared logical GPU device.", ["device readiness", "device loss", "device release", "device generation transitions"], ["provider-specific repair", "product restart policy", "render frame lifecycle"], ["n:host:gpu:device"]),
  gpuNode("host-gpu-resource-domain", "n:host:gpu:resource", "n:host:gpu", "Host GPU Resource", "Own portable shared GPU-resource identity, usage, revision, residency, references, and lifetime.", ["GPU resource identity", "combined resource usage", "resource revision", "resource residency", "resource references", "shared resource lifetime"], ["raw GPUBuffer handles", "raw GPUTexture handles", "compute kernel meaning", "render material meaning"]),
  gpuNode("host-gpu-synchronization-domain", "n:host:gpu:synchronization", "n:host:gpu", "Host GPU Synchronization", "Own engine-level cross-consumer ownership, readiness, transitions, and completion state for shared GPU resources.", ["resource ownership state", "resource readiness", "consumer transitions", "completion state"], ["Runtime clocks", "backend barrier handles", "gameplay scheduling"]),
  gpuNode("host-gpu-recovery-domain", "n:host:gpu:recovery", "n:host:gpu", "Host GPU Recovery", "Own shared device-loss records, resource invalidation, and restoration coordination.", ["device-loss record", "resource invalidation", "restoration coordination"], ["Compute kernel recreation", "Render material recreation", "application reload policy"])
];

export const hostDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({
    id: "host-domain",
    domainPath: "n:host",
    label: "Host",
    responsibility: "Own host capability descriptors, fallback contracts, and shared physical execution-environment ownership while keeping backend handles provider-private.",
    owns: ["host capability descriptors", "host requirement contracts", "fallback selection contracts", "shared execution-environment identity"],
    forbiddenResponsibilities: ["application process lifecycle", "renderer implementation", "compute algorithms", "storage implementation", "raw platform handles in portable state"],
    provides: ["n:host", "host:capability-contract", "host:fallback-contract"],
    proofReferences: hostProof
  }),
  subdomains: gpuSubdomains,
  publicEntry: { subpath: "./domains/host", module: "./src/core-domains/host/index.js" },
  publicKits: [
    atomicKit({
      id: "host-capability-kit",
      responsibility: "Describe available host capabilities and select declarative fallback modes.",
      domainPath: "n:host",
      apiName: "host",
      provides: ["n:host", "host:capability-contract", "host:fallback-contract"],
      module: "./src/core-domains/host/kits/host-capability-kit/index.js",
      exportName: "createHostCapabilityKit",
      publicSubpath: "./domains/host/capabilities",
      proofReferences: hostProof
    })
  ],
  providers: []
}));

export default hostDomainManifest;
