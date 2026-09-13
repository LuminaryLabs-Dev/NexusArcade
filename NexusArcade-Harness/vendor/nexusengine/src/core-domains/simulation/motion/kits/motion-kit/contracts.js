const clone = (value) => value === undefined ? undefined : structuredClone(value);
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

function text(value, fallback, label) {
  const next = String(value ?? fallback ?? "").trim();
  if (!next) throw new TypeError(`${label} requires a non-empty value.`);
  return next;
}

export function motionVector3(value = {}, fallback = {}) {
  const source = Array.isArray(value)
    ? { x: value[0], y: value[1], z: value[2] }
    : value ?? {};
  return {
    x: finite(source.x, finite(fallback.x, 0)),
    y: finite(source.y, finite(fallback.y, 0)),
    z: finite(source.z, finite(fallback.z, 0))
  };
}

export function motionQuaternion(value = {}, fallback = {}) {
  const source = Array.isArray(value)
    ? { x: value[0], y: value[1], z: value[2], w: value[3] }
    : value ?? {};
  const quaternion = {
    x: finite(source.x, finite(fallback.x, 0)),
    y: finite(source.y, finite(fallback.y, 0)),
    z: finite(source.z, finite(fallback.z, 0)),
    w: finite(source.w, finite(fallback.w, 1))
  };
  const length = Math.hypot(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  if (length <= 1e-8) return { x: 0, y: 0, z: 0, w: 1 };
  return {
    x: quaternion.x / length,
    y: quaternion.y / length,
    z: quaternion.z / length,
    w: quaternion.w / length
  };
}

export function createMovementModeDescriptor(input = {}) {
  return {
    schema: "nexus-movement-mode/1",
    id: text(input.id ?? input.mode, "idle", "Movement mode id"),
    maximumSpeed: Math.max(0, finite(input.maximumSpeed, 0)),
    acceleration: Math.max(0, finite(input.acceleration, 0)),
    deceleration: Math.max(0, finite(input.deceleration, 0)),
    allowsVerticalMotion: input.allowsVerticalMotion === true,
    metadata: clone(input.metadata ?? {})
  };
}

export function createMotionIntentDescriptor(input = {}) {
  return {
    schema: "nexus-motion-intent/1",
    id: text(input.id, `${input.actorId ?? "actor"}:motion`, "Motion intent id"),
    actorId: text(input.actorId ?? input.bodyId, null, "Motion intent actorId"),
    mode: text(input.mode, "idle", "Motion intent mode"),
    desiredVelocity: motionVector3(input.desiredVelocity ?? input.velocity),
    desiredFacing: motionVector3(input.desiredFacing ?? input.facing, { x: 0, y: 0, z: 1 }),
    acceleration: Math.max(0, finite(input.acceleration, 0)),
    deceleration: Math.max(0, finite(input.deceleration, 0)),
    grounded: input.grounded === true,
    sequence: Math.max(0, Math.floor(finite(input.sequence, 0))),
    metadata: clone(input.metadata ?? {})
  };
}

export function createTrajectoryDescriptor(input = {}) {
  const actorId = text(input.actorId ?? input.bodyId, null, "Trajectory actorId");
  return {
    schema: "nexus-motion-trajectory/1",
    id: text(input.id, `${actorId}:trajectory`, "Trajectory id"),
    actorId,
    loop: input.loop === true,
    points: (Array.isArray(input.points) ? input.points : []).map((point, index) => ({
      id: String(point?.id ?? `${actorId}:point:${index}`),
      time: Math.max(0, finite(point?.time, index)),
      position: motionVector3(point?.position ?? point)
    })),
    metadata: clone(input.metadata ?? {})
  };
}

export function createRootMotionRequest(input = {}) {
  return {
    schema: "nexus-root-motion-request/1",
    id: text(input.id, `${input.bodyId ?? input.actorId ?? "body"}:root-motion`, "Root motion request id"),
    bodyId: text(input.bodyId ?? input.actorId, null, "Root motion bodyId"),
    position: input.position == null ? null : motionVector3(input.position),
    rotation: input.rotation == null ? null : motionQuaternion(input.rotation),
    linearVelocity: input.linearVelocity == null && input.velocity == null
      ? null
      : motionVector3(input.linearVelocity ?? input.velocity),
    angularVelocity: input.angularVelocity == null ? null : motionVector3(input.angularVelocity),
    metadata: clone(input.metadata ?? {})
  };
}

export function createMotionFrameDescriptor(input = {}) {
  const tickId = text(input.tickId ?? input.stepId, "motion-frame", "Motion frame tickId");
  return {
    schema: "nexus-motion-frame/1",
    id: text(input.id, tickId, "Motion frame id"),
    tickId,
    frame: Math.max(0, Math.floor(finite(input.frame, 0))),
    intents: clone(input.intents ?? []),
    trajectories: clone(input.trajectories ?? []),
    requests: (Array.isArray(input.requests) ? input.requests : []).map(createRootMotionRequest),
    results: clone(input.results ?? []),
    metadata: clone(input.metadata ?? {})
  };
}

export function validateMotionIntentDescriptor(value) {
  const issues = [];
  if (value?.schema !== "nexus-motion-intent/1") issues.push("schema must be nexus-motion-intent/1");
  if (!value?.id) issues.push("id is required");
  if (!value?.actorId) issues.push("actorId is required");
  if (!value?.mode) issues.push("mode is required");
  return { valid: issues.length === 0, issues };
}

export function validateMotionFrameDescriptor(value) {
  const issues = [];
  if (value?.schema !== "nexus-motion-frame/1") issues.push("schema must be nexus-motion-frame/1");
  if (!value?.id) issues.push("id is required");
  if (!value?.tickId) issues.push("tickId is required");
  return { valid: issues.length === 0, issues };
}
