export class RequestRepository {
  constructor(store) {
    this.store = store;
    this.sequence = Promise.resolve();
  }

  async nextId() {
    const run = this.sequence.then(async () => {
      const current = await this.store.readJson("indexes/request-counter.json", { value: 0 });
      const value = Number(current?.value || 0) + 1;
      await this.store.writeJson("indexes/request-counter.json", { value });
      return `NAB-${String(value).padStart(6, "0")}`;
    });
    this.sequence = run.then(() => undefined, () => undefined);
    return run;
  }

  async get(requestId) {
    return this.store.readJson(`requests/${requestId}.json`, null);
  }

  async update(requestId, change) {
    const run = this.sequence.then(async () => {
      const current = await this.get(requestId);
      if (!current) {
        const error = new Error(`${requestId} was not found`);
        error.code = "NAB_NOT_FOUND";
        throw error;
      }
      const next = await change(structuredClone(current));
      await this.store.writeJson(`requests/${requestId}.json`, next);
      return next;
    });
    this.sequence = run.then(() => undefined, () => undefined);
    return run;
  }

  async submit(session) {
    const id = await this.nextId();
    const request = {
      id,
      type: session.mode.startsWith("NEW_GAME") ? "NEW_GAME" : "UPDATE_GAME",
      collaborative: session.collaborative,
      gameId: session.gameId || session.profile?.identity?.gameId || null,
      profile: session.profile,
      source: {
        platform: "discord",
        ownerUserId: session.ownerUserId,
        participantIds: session.participantIds,
      },
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };
    await this.store.writeJson(`requests/${id}.json`, request);
    return request;
  }

  async complete(requestId, result) {
    return this.update(requestId, (request) => {
      if (request.status === "READY") {
        const stable = (value) => {
          if (!value) return value;
          const copy = structuredClone(value);
          if (copy.validation) delete copy.validation.checkedAt;
          return copy;
        };
        if (JSON.stringify(stable(request.result)) !== JSON.stringify(stable(result))) {
          const error = new Error(`${requestId} already has a different READY result`);
          error.code = "NAB_RESULT_CONFLICT";
          throw error;
        }
        return request;
      }
      const completedAt = new Date().toISOString();
      return {
        ...request,
        gameId: result.gameId,
        status: "READY",
        result,
        completedAt,
        updatedAt: completedAt,
        delivery: { state: "PENDING", recipients: [] },
      };
    });
  }

  async setDelivery(requestId, delivery) {
    return this.update(requestId, (request) => ({
      ...request,
      delivery: {
        ...delivery,
        updatedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    }));
  }
}
