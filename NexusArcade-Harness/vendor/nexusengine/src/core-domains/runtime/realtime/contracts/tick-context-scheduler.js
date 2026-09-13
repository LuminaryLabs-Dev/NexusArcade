function callHook(hook, ...args) {
  if (typeof hook === "function") hook(...args);
}

export function createTickContextScheduler(baseScheduler) {
  if (!baseScheduler || typeof baseScheduler.addSystem !== "function" || typeof baseScheduler.run !== "function") {
    throw new TypeError("createTickContextScheduler expects a scheduler.");
  }

  if (baseScheduler.__nexusTickContextScheduler === true) return baseScheduler;

  let currentTickContext = null;
  let running = false;

  const scheduler = {
    __nexusTickContextScheduler: true,
    addPhase(name) {
      baseScheduler.addPhase(name);
      return scheduler;
    },
    addSystem(phaseName, system) {
      if (typeof system !== "function") {
        throw new TypeError("Scheduler systems must be functions.");
      }
      baseScheduler.addSystem(phaseName, (world) => system(world, currentTickContext));
      return scheduler;
    },
    run(world, hooks = {}, tickContext = null) {
      if (running) throw new Error("Tick-context scheduler cannot be re-entered.");
      running = true;
      currentTickContext = tickContext;
      try {
        return baseScheduler.run(world, {
          onPhaseStart(phaseName, nextWorld) {
            callHook(hooks.onPhaseStart, phaseName, nextWorld, tickContext);
          },
          onPhaseEnd(phaseName, nextWorld) {
            callHook(hooks.onPhaseEnd, phaseName, nextWorld, tickContext);
          },
          onDrain({ world: nextWorld, journal, phases }) {
            callHook(hooks.onDrain, { world: nextWorld, journal, phases, tickContext });
          }
        });
      } finally {
        currentTickContext = null;
        running = false;
      }
    },
    get phases() {
      return baseScheduler.phases;
    },
    get currentTickContext() {
      return currentTickContext;
    },
    get baseScheduler() {
      return baseScheduler;
    }
  };

  return scheduler;
}
