import assistanceTarget from "./assistance-target/subdomain.manifest.js";
import environmentalAffordance from "./environmental-affordance/subdomain.manifest.js";
import request from "./request/subdomain.manifest.js";
import requestQueue from "./request/queue/subdomain.manifest.js";
import requestFulfillment from "./request/fulfillment/subdomain.manifest.js";
import transferZone from "./transfer-zone/subdomain.manifest.js";
import assistanceTargetKit from "./assistance-target/kits/assistance-target-kit/kit.manifest.js";
import environmentalAffordanceKit from "./environmental-affordance/kits/environmental-affordance-kit/kit.manifest.js";
import requestQueueKit from "./request/queue/kits/request-queue-kit/kit.manifest.js";
import requestFulfillmentKit from "./request/fulfillment/kits/request-fulfillment-kit/kit.manifest.js";
import transferZoneKit from "./transfer-zone/kits/transfer-zone-kit/kit.manifest.js";
import occupantRequestAdapterKit from "./adapters/occupant-request-adapter-kit/kit.manifest.js";
import transportRequestAdapterKit from "./adapters/transport-request-adapter-kit/kit.manifest.js";
import requestEconomyAdapterKit from "./adapters/request-economy-adapter-kit/kit.manifest.js";

export const RESTORED_INTERACTION_SUBDOMAINS = Object.freeze([assistanceTarget, environmentalAffordance, request, requestQueue, requestFulfillment, transferZone]);
export const RESTORED_INTERACTION_KITS = Object.freeze([assistanceTargetKit, environmentalAffordanceKit, requestQueueKit, requestFulfillmentKit, transferZoneKit]);
export const RESTORED_INTERACTION_ADAPTER_KITS = Object.freeze([occupantRequestAdapterKit, transportRequestAdapterKit, requestEconomyAdapterKit]);
