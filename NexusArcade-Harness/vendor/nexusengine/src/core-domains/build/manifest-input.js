import { atomicKit, domainNode } from "../manifest-input.js";

export function defineBuildSubdomainManifest(input) {
  return domainNode(input);
}

export function defineBuildAtomicKitManifest(input) {
  return atomicKit({
    version: "0.0.4",
    status: "stable-candidate",
    environments: ["node"],
    ...input
  });
}
