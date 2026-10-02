import { createTicketExecution, normalizeHarnessCompletion } from "../../../NexusArcade-Harness/ticket-contract.mjs";

const REQUEST_ID_RE = /^NAB-[0-9]{6}$/;

function assertRequestId(value) {
  if (typeof value !== "string" || !REQUEST_ID_RE.test(value)) throw new TypeError("requestId must match NAB-000000");
  return value;
}

function completionExecution(request, result) {
  return createTicketExecution(request, { slug: result?.slug, gameId: result?.gameId || request.gameId || null });
}

export function createAgentTools({ requests, notify = async () => ({ state: "SKIPPED", recipients: [] }) } = {}) {
  if (!requests) throw new TypeError("RequestRepository is required");

  return {
    async get_request({ requestId } = {}) {
      const id = assertRequestId(requestId);
      const request = await requests.get(id);
      if (!request) {
        const error = new Error(`${id} was not found`);
        error.code = "NAB_NOT_FOUND";
        throw error;
      }
      return request;
    },

    async submit_result({ requestId, result } = {}) {
      const id = assertRequestId(requestId);
      const request = await requests.get(id);
      if (!request) {
        const error = new Error(`${id} was not found`);
        error.code = "NAB_NOT_FOUND";
        throw error;
      }
      const normalized = normalizeHarnessCompletion(completionExecution(request, result), result);
      const ready = await requests.complete(id, normalized);
      let delivery;
      try {
        delivery = await notify({ request: ready, result: normalized });
      } catch (error) {
        delivery = { state: "FAILED", recipients: [], failures: [{ message: error.message }] };
      }
      const updated = await requests.setDelivery(id, delivery);
      return { request: updated, result: normalized, delivery: updated.delivery };
    },
  };
}
