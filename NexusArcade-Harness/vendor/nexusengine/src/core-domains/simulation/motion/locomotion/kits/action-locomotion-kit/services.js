import { advanceActionLocomotion } from "./contracts.js";

export function createActionLocomotionServices(baseApi, config) {
  return {
    step(command = {}) {
      return baseApi.applyCommand(command, (state, request) => {
        const frame = advanceActionLocomotion(state, request, config);
        return {
          patch: {
            position: frame.position,
            velocity: frame.velocity,
            facing: frame.facing,
            grounded: frame.grounded,
            jumping: frame.jumping,
            dashing: frame.dashing,
            gliding: frame.gliding,
            sequence: frame.sequence,
            recoveryRequired: frame.recoveryRequired,
            lastIntent: frame.intent,
            lastFrame: frame,
            transitions: [...(state.transitions ?? []), ...frame.transitions].slice(-128)
          },
          result: frame,
          events: frame.transitions.map((transition) => ({ name: transition.replaceAll("-", ""), payload: { frame } }))
        };
      });
    },
    getIntent: () => baseApi.getState().lastIntent,
    getFrame: () => baseApi.getState().lastFrame
  };
}
