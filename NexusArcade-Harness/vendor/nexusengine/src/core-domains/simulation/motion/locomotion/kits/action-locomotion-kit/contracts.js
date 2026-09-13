import { cloneSerializableState } from "../../../../../../foundation/serializable-state.js";

function finite(value, label, fallback) {
  if (value === undefined && fallback !== undefined) return fallback;
  const next = Number(value);
  if (!Number.isFinite(next)) throw new TypeError(`${label} must be finite.`);
  return next;
}

function nonnegative(value, label, fallback) {
  const next = finite(value, label, fallback);
  if (next < 0) throw new RangeError(`${label} cannot be negative.`);
  return next;
}

function vector3(value = {}, label = "vector") {
  return {
    x: finite(value.x, `${label}.x`, 0),
    y: finite(value.y, `${label}.y`, 0),
    z: finite(value.z, `${label}.z`, 0)
  };
}

function normalizePlanar(value = {}) {
  const x = finite(value.x ?? value.moveX, "input.x", 0);
  const z = finite(value.z ?? value.moveZ, "input.z", 0);
  const length = Math.hypot(x, z);
  return length > 1 ? { x: x / length, z: z / length } : { x, z };
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const approach = (current, target, amount) => current + (target - current) * clamp(amount, 0, 1);

export function normalizeActionLocomotionConfig(config = {}) {
  const actorId = String(config.actorId ?? "actor").trim();
  if (!actorId) throw new TypeError("Action Locomotion actorId is required.");
  return {
    actorId,
    speed: nonnegative(config.speed, "speed", 12),
    sprintSpeed: nonnegative(config.sprintSpeed, "sprintSpeed", 18),
    dashSpeed: nonnegative(config.dashSpeed, "dashSpeed", 32),
    groundAcceleration: nonnegative(config.groundAcceleration, "groundAcceleration", 56),
    airAcceleration: nonnegative(config.airAcceleration, "airAcceleration", 20),
    groundDrag: nonnegative(config.groundDrag, "groundDrag", 18),
    airDrag: nonnegative(config.airDrag, "airDrag", 4),
    gravity: nonnegative(config.gravity, "gravity", 28),
    jumpSpeed: nonnegative(config.jumpSpeed, "jumpSpeed", 12),
    glideFallSpeed: nonnegative(config.glideFallSpeed, "glideFallSpeed", 6),
    jumpCooldown: nonnegative(config.jumpCooldown, "jumpCooldown", 0.18),
    dashCooldown: nonnegative(config.dashCooldown, "dashCooldown", 0.6),
    killY: finite(config.killY, "killY", -26),
    start: vector3(config.start, "start"),
    grounded: config.grounded !== false
  };
}

export function createActionLocomotionState(config = {}) {
  const normalized = normalizeActionLocomotionConfig(config);
  return {
    actorId: normalized.actorId,
    position: normalized.start,
    velocity: { x: 0, y: 0, z: 0 },
    facing: { x: 0, y: 0, z: 1 },
    grounded: normalized.grounded,
    jumping: false,
    dashing: false,
    gliding: false,
    jumpCooldownRemaining: 0,
    dashCooldownRemaining: 0,
    sequence: 0,
    recoveryRequired: null,
    lastIntent: null,
    lastFrame: null,
    transitions: []
  };
}

export function advanceActionLocomotion(state = {}, command = {}, rawConfig = {}) {
  const config = normalizeActionLocomotionConfig(rawConfig);
  const delta = nonnegative(command.delta, "delta", 1 / 60);
  const input = command.input ?? command;
  const move = normalizePlanar(input);
  const hasMovement = Math.hypot(move.x, move.z) > 1e-6;
  const wasGliding = state.gliding === true;
  const wasGrounded = state.grounded === true;
  const wantsJump = input.jump === true;
  const wantsDash = input.dash === true;
  const wantsGlide = input.glide === true;
  const speed = wantsDash ? config.dashSpeed : input.sprint === true ? config.sprintSpeed : config.speed;
  const acceleration = wasGrounded ? config.groundAcceleration : config.airAcceleration;
  const drag = wasGrounded ? config.groundDrag : config.airDrag;
  const targetX = move.x * speed;
  const targetZ = move.z * speed;
  const velocity = vector3(state.velocity, "state.velocity");
  velocity.x = approach(velocity.x, targetX, acceleration * delta);
  velocity.z = approach(velocity.z, targetZ, acceleration * delta);
  velocity.x *= Math.max(0, 1 - drag * delta);
  velocity.z *= Math.max(0, 1 - drag * delta);

  let grounded = wasGrounded;
  let jumping = state.jumping === true;
  let jumpCooldownRemaining = Math.max(0, finite(state.jumpCooldownRemaining, "state.jumpCooldownRemaining", 0) - delta);
  let dashCooldownRemaining = Math.max(0, finite(state.dashCooldownRemaining, "state.dashCooldownRemaining", 0) - delta);
  const transitions = [];

  if (wantsJump && grounded && jumpCooldownRemaining === 0) {
    velocity.y = config.jumpSpeed;
    grounded = false;
    jumping = true;
    jumpCooldownRemaining = config.jumpCooldown;
    transitions.push("jump-started");
  }
  if (wantsDash && dashCooldownRemaining === 0) {
    dashCooldownRemaining = config.dashCooldown;
    transitions.push("dash-started");
  }

  velocity.y -= config.gravity * delta;
  const gliding = wantsGlide && !grounded;
  if (gliding && velocity.y < -config.glideFallSpeed) velocity.y = -config.glideFallSpeed;
  if (gliding && !wasGliding) transitions.push("glide-started");
  if (!gliding && wasGliding) transitions.push("glide-ended");

  const position = vector3(state.position, "state.position");
  position.x += velocity.x * delta;
  position.y += velocity.y * delta;
  position.z += velocity.z * delta;

  // Recovery is decided before any ground correction so killY cannot be masked.
  const recoveryRequired = position.y < config.killY
    ? { reason: "fall", position: cloneSerializableState(position) }
    : null;
  const groundHeight = finite(command.contact?.groundHeight, "contact.groundHeight", 0);
  if (!recoveryRequired && command.contact?.grounded === true && position.y <= groundHeight) {
    if (!grounded && velocity.y <= 0) transitions.push("landed");
    position.y = groundHeight;
    velocity.y = 0;
    grounded = true;
    jumping = false;
  } else if (!recoveryRequired && command.contact?.grounded === false) {
    grounded = false;
  } else if (recoveryRequired) {
    grounded = false;
  }

  const facing = hasMovement ? { x: move.x, y: 0, z: move.z } : vector3(state.facing, "state.facing");
  const mode = grounded ? (hasMovement ? "move" : "idle") : gliding ? "glide" : "air";
  const sequence = Math.max(0, Math.floor(finite(state.sequence, "state.sequence", 0))) + 1;
  const intent = {
    schema: "nexus-motion-intent/1",
    id: `${config.actorId}:action-locomotion`,
    actorId: config.actorId,
    mode,
    desiredVelocity: cloneSerializableState(velocity),
    desiredFacing: facing,
    acceleration,
    deceleration: drag,
    grounded,
    sequence,
    metadata: { source: "action-locomotion-kit", jumping, dashing: wantsDash, gliding }
  };
  const frame = {
    schema: "nexus-action-locomotion-frame/1",
    actorId: config.actorId,
    sequence,
    position,
    velocity,
    facing,
    grounded,
    jumping,
    dashing: wantsDash,
    gliding,
    recoveryRequired,
    transitions,
    intent
  };
  return cloneSerializableState(frame);
}
