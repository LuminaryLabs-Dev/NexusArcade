import { defineDomainServiceKit as defineGenericDomainServiceKit } from "../domain-service-kit.js";
import { applyManifestKitContract } from "./manifest-kit-contract.js";

export function defineDomainServiceKit(config = {}) {
  return defineGenericDomainServiceKit(applyManifestKitContract(config));
}
