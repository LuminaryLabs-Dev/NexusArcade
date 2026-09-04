import * as THREE from "./vendor/three/three.module.js";
import { createSeededRandom } from "./vendor/nexusengine/seeded-random.js";
import { createResourceMeter } from "./vendor/nexusengine/resources.js";
import { createPressureChannel } from "./vendor/nexusengine/pressure.js";
const spec = await (await fetch("./game.json")).json();
const $ = (id) => document.getElementById(id);
$("title").textContent = spec.title;
document.title = spec.title;
$("mission").textContent = spec.premise;
document.body.dataset.palette = spec.palette;
$("target-label").textContent = spec.objectiveLabel.toUpperCase();
const instructions = {
  hold: "Approach each station and hold SPACE to restore it. Avoid the moving sentries.",
  deliver:
    "Collect a supply from the glowing central depot. Carry it to a station and press SPACE.",
  sequence:
    "Visit the numbered stations in order. Hold SPACE to activate the next station.",
};
$("instructions").textContent =
  instructions[spec.mode] +
  " Complete all three shifts. WASD or arrows to move. R restarts. Escape pauses.";
$("hint").textContent =
  "WASD / ARROWS   Move     SPACE   Interact     R   Restart     ESC   Pause";
const palettes = {
  jade: {
    floor: 0x365a51,
    edge: 0x153a38,
    accent: 0xc4e89b,
    light: 0xf1dd9d,
    background: 0x152b32,
  },
  amber: {
    floor: 0x625047,
    edge: 0x3e3033,
    accent: 0xffcd72,
    light: 0xffe4be,
    background: 0x251e30,
  },
  indigo: {
    floor: 0x3f4867,
    edge: 0x262e4e,
    accent: 0xc6b2ff,
    light: 0xd4deff,
    background: 0x19243c,
  },
};
const colors = palettes[spec.palette];
const renderer = new THREE.WebGLRenderer({
  canvas: $("view"),
  antialias: true,
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(colors.background);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(colors.background, 28, sixty());
function sixty() {
  return 65;
}
const camera = new THREE.PerspectiveCamera(
  forty(),
  innerWidth / innerHeight,
  0.1,
  100,
);
function forty() {
  return 40;
}
camera.position.set(0, 24, 24);
camera.lookAt(0, 0, 0);
scene.add(new THREE.HemisphereLight(0xe4f5ff, 0x303a30, 2.3));
const sun = new THREE.DirectionalLight(colors.light, 3);
sun.position.set(-8, 20, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, {
  left: -14,
  right: 14,
  top: 14,
  bottom: -14,
});
scene.add(sun);
const group = new THREE.Group();
scene.add(group);
const mat = (c, rough = 0.7) =>
  new THREE.MeshStandardMaterial({
    color: c,
    roughness: rough,
    metalness: 0.22,
  });
function mesh(geo, c, x, y, z, parent = group) {
  const m = new THREE.Mesh(geo, mat(c));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function box(w, h, d, c, x, y, z, parent) {
  return mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z, parent);
}
function cylinder(r, h, c, x, y, z, parent) {
  return mesh(new THREE.CylinderGeometry(r, r, h, 12), c, x, y, z, parent);
}
box(20, 0.7, 18, colors.edge, 0, -0.55, 0);
box(19.5, 0.12, 17.5, colors.floor, 0, -0.15, 0);
for (let x = -9; x <= 9; x += 1.5)
  for (let z = -8; z <= 8; z += 1.5) {
    const tile = box(1.43, 0.04, 1.43, colors.floor, x, -0.04, z);
    tile.material.color.multiplyScalar((x + z) % 3 ? 1.07 : 0.93);
  }
for (const z of [-9, 9]) box(20, 0.6, 0.35, colors.edge, 0, 0.15, z);
for (const x of [-10, 10]) box(0.35, 0.6, 18, colors.edge, x, 0.15, 0);
const rng = createSeededRandom(spec.seed);
for (let i = 0; i < 24; i++) {
  const x = i < 12 ? -9 : 9;
  const z = -8 + (i % 12) * 1.4;
  box(0.5, 0.2, 0.7, colors.accent, x, 0.16, z);
  if (i % 3 === 0) {
    const h = 1 + rng.next();
    cylinder(0.24, h, colors.edge, x, h / 2, z);
    mesh(new THREE.SphereGeometry(0.24, 10, 8), colors.accent, x, h, z);
  }
}
// Decorative silhouettes stay outside the playable floor.
for (let i = 0; i < 10; i++) {
  const x = -14 + rng.next() * 28,
    z = -12 - rng.next() * 6,
    h = 1 + rng.next() * 4;
  if (spec.setting === "greenhouse") {
    cylinder(0.22, h, 0x4e806b, x, h / 2, z);
    const crown = mesh(
      new THREE.IcosahedronGeometry(1.2, 0),
      colors.floor,
      x,
      h + 0.3,
      z,
    );
    crown.scale.set(1, 1.7, 1);
  } else if (spec.setting === "harbor") {
    box(1.4, h, 1.4, colors.edge, x, h / 2, z);
    box(1.5, 0.2, 1.5, colors.accent, x, h, z);
  } else {
    const orb = mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      colors.accent,
      x,
      h,
      z,
    );
    const ring = mesh(
      new THREE.TorusGeometry(1.4, 0.06, 8, 32),
      colors.light,
      x,
      h,
      z,
    );
    ring.rotation.x = 1.2;
    orb.material.metalness = 0.8;
  }
}
const depot = new THREE.Group();
group.add(depot);
cylinder(1.1, 0.15, colors.edge, 0, 0.03, 0, depot);
const depotRing = mesh(
  new THREE.TorusGeometry(0.85, 0.08, 8, 40),
  colors.accent,
  0,
  0.2,
  0,
  depot,
);
depotRing.rotation.x = Math.PI / 2;
const crate = box(0.6, 0.7, 0.6, colors.accent, 0, 0.55, 0, depot);
depot.visible = spec.mode === "deliver";
const player = new THREE.Group();
group.add(player);
cylinder(0.3, 0.65, 0xf1efdb, 0, 0.55, 0, player);
const head = mesh(
  new THREE.SphereGeometry(0.28, 16, 12),
  colors.accent,
  0,
  1.02,
  0,
  player,
);
box(0.36, 0.13, 0.1, 0x183a40, 0, 1.06, 0.25, player);
const backpack = box(0.35, 0.45, 0.25, colors.edge, 0, 0.6, -0.32, player);
const carried = box(0.4, 0.4, 0.4, colors.accent, 0, 1.55, 0, player);
const stations = [];
for (let i = 0; i < spec.targetCount; i++) {
  const a = -Math.PI / 2 + (i * Math.PI * 2) / spec.targetCount;
  const g = new THREE.Group();
  g.position.set(Math.sin(a) * 6.2, 0, Math.cos(a) * 5.8);
  group.add(g);
  cylinder(0.8, 0.4, colors.edge, 0, 0.1, 0, g);
  cylinder(0.48, 0.65, colors.accent, 0, 0.55, 0, g);
  const ring = mesh(
    new THREE.TorusGeometry(0.9, 0.06, 8, 40),
    colors.accent,
    0,
    1,
    0,
    g,
  );
  ring.rotation.x = Math.PI / 2;
  const crystal = mesh(
    new THREE.OctahedronGeometry(0.36),
    colors.light,
    0,
    1.35,
    0,
    g,
  );
  const label = document.createElement("canvas");
  label.width = 128;
  label.height = 128;
  const c = label.getContext("2d");
  c.fillStyle = "#eaf5db";
  c.font = "bold 72px sans-serif";
  c.textAlign = "center";
  c.fillText(String(i + 1), 64, 88);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(label),
      depthTest: false,
    }),
  );
  sprite.position.y = 2.5;
  sprite.scale.set(0.65, 0.65, 1);
  g.add(sprite);
  stations.push({
    index: i,
    x: g.position.x,
    z: g.position.z,
    group: g,
    ring,
    crystal,
    progress: 0,
    done: false,
  });
}
const hazards = [];
for (let i = 0; i < spec.hazardCount; i++) {
  const g = new THREE.Group();
  group.add(g);
  const body = mesh(
    new THREE.IcosahedronGeometry(0.44),
    0xf29a82,
    0,
    0.65,
    0,
    g,
  );
  const r = mesh(
    new THREE.TorusGeometry(0.65, 0.045, 6, 24),
    0xffc6ad,
    0,
    0.65,
    0,
    g,
  );
  r.rotation.x = Math.PI / 2;
  hazards.push({ group: g, body, x: 0, z: 0 });
}
let health = createResourceMeter(),
  pressure = createPressureChannel();
let state = "READY",
  stage = 1,
  time = 0,
  total = 0,
  inputCount = 0,
  interactions = 0,
  carrying = false,
  completed = 0,
  damageCooldown = 0;
const keys = new Set();
let audio;
function sound(freq) {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.connect(g);
    g.connect(audio.destination);
    o.frequency.setValueAtTime(freq, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      freq * 1.4,
      audio.currentTime + 0.09,
    );
    g.gain.setValueAtTime(0.05, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.16);
    o.start();
    o.stop(audio.currentTime + 0.17);
  } catch {}
}
function reset() {
  stage = 1;
  total = 0;
  inputCount = 0;
  interactions = 0;
  health = createResourceMeter();
  pressure = createPressureChannel();
  resetStage();
  state = "READY";
  overlay("Ready for your shift?", "Begin expedition");
}
function resetStage() {
  time = 0;
  completed = 0;
  carrying = false;
  damageCooldown = 0;
  player.position.set(0, 0, 6.7);
  for (const s of stations) {
    s.progress = 0;
    s.done = false;
    s.group.visible = true;
  }
}
function overlay(title, button) {
  $("overlay-title").textContent = title;
  $("start").textContent = button;
  $("overlay").hidden = false;
}
function start() {
  if (["WIN", "FAIL"].includes(state)) reset();
  state = "PLAYING";
  $("overlay").hidden = true;
  sound(330);
}
$("start").onclick = start;
addEventListener("keydown", (e) => {
  if (
    ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
      e.code,
    )
  )
    e.preventDefault();
  if (e.repeat) return;
  keys.add(e.code);
  inputCount++;
  if (e.code === "Enter" && state !== "PLAYING") start();
  if (e.code === "KeyR") reset();
  if (e.code === "Escape") {
    if (state === "PLAYING") {
      state = "PAUSED";
      overlay("Take a breath", "Resume expedition");
    } else if (state === "PAUSED") start();
  }
});
addEventListener("keyup", (e) => keys.delete(e.code));
addEventListener("blur", () => {
  keys.clear();
  if (state === "PLAYING") {
    state = "PAUSED";
    overlay("Paused", "Resume expedition");
  }
});
function step(dt, simulation = false) {
  if (state !== "PLAYING") return;
  time += dt;
  total += dt;
  damageCooldown = Math.max(0, damageCooldown - dt);
  pressure.adjust((dt * 100) / spec.duration, "shift");
  health.spend(dt * 0.16, "wear");
  const pad = navigator.getGamepads?.()[0];
  const axis = (n) => (Math.abs(pad?.axes[n] ?? 0) > 0.2 ? pad.axes[n] : 0);
  let dx =
    (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) -
    (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0) +
    axis(0);
  let dz =
    (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) -
    (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) +
    axis(1);
  const mag = Math.hypot(dx, dz);
  if (mag) {
    player.position.x = THREE.MathUtils.clamp(
      player.position.x + (dx / Math.max(1, mag)) * spec.speed * dt,
      -9,
      9,
    );
    player.position.z = THREE.MathUtils.clamp(
      player.position.z + (dz / Math.max(1, mag)) * spec.speed * dt,
      -8,
      8,
    );
    player.rotation.y = Math.atan2(dx, dz);
  }
  const interact =
    keys.has("Space") || keys.has("KeyE") || pad?.buttons[0]?.pressed;
  if (
    interact &&
    spec.mode === "deliver" &&
    !carrying &&
    Math.hypot(player.position.x, player.position.z) < 1.35
  ) {
    carrying = true;
    interactions++;
    sound(420);
  }
  for (const s of stations) {
    const near =
      Math.hypot(player.position.x - s.x, player.position.z - s.z) < 1.25;
    const eligible = spec.mode !== "sequence" || s.index === completed;
    if (
      !s.done &&
      near &&
      interact &&
      eligible &&
      (spec.mode !== "deliver" || carrying)
    ) {
      s.progress += dt;
      if (s.progress >= spec.interactionSeconds) {
        s.done = true;
        completed++;
        interactions++;
        carrying = false;
        health.restore(5);
        sound(520 + s.index * 90);
      }
    }
    s.ring.rotation.z += dt;
    s.ring.material.color.setHex(
      s.done ? 0x75f0b3 : eligible ? colors.accent : colors.edge,
    );
    s.crystal.position.y = 1.35 + Math.sin(total * 2 + s.index) * 0.14;
    s.crystal.rotation.y += dt;
  }
  hazards.forEach((h, i) => {
    const a =
      total * (0.32 + stage * 0.05) + (i * Math.PI * 2) / hazards.length;
    h.x = Math.sin(a) * (3.2 + i * 0.45);
    h.z = Math.cos(a) * (2.8 + i * 0.5);
    h.group.position.set(h.x, 0, h.z);
    h.body.rotation.y += dt;
    if (
      Math.hypot(player.position.x - h.x, player.position.z - h.z) < 0.8 &&
      !damageCooldown
    ) {
      health.spend(12, "collision");
      damageCooldown = 1.4;
      sound(120);
    }
  });
  if (completed === stations.length) {
    if (stage === spec.stages) {
      state = "WIN";
      overlay("Expedition complete", "Play again");
    } else {
      stage++;
      pressure = createPressureChannel();
      health.restore(15);
      resetStage();
      sound(880);
    }
  }
  if (health.snapshot().empty || time >= spec.duration) {
    state = "FAIL";
    overlay("Shift lost — try again", "Restart expedition");
  }
}
function snapshot() {
  return {
    phase: state,
    stage,
    time,
    total,
    inputCount,
    interactions,
    completed,
    carrying,
    health: health.snapshot().value,
    pressure: pressure.snapshot().value,
    mode: spec.mode,
    player: { x: player.position.x, z: player.position.z },
    targets: stations.map((s) => ({
      index: s.index,
      x: s.x,
      z: s.z,
      done: s.done,
    })),
    renderer: renderer
      .getContext()
      .getParameter(renderer.getContext().RENDERER),
  };
}
window.__NEXUS_TEST_STATE__ = snapshot;
window.__NEXUS_SIMTIME__ = {
  advance(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0 || seconds > 600)
      throw Error("Invalid simulated interval");
    for (let t = 0; t < seconds; t += 1 / 60) step(1 / 60, true);
    return snapshot();
  },
};
let last = performance.now(),
  acc = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  acc += dt;
  while (acc >= 1 / 60) {
    step(1 / 60);
    acc -= 1 / 60;
  }
  carried.visible = carrying;
  crate.rotation.y += dt;
  player.position.y = Math.sin(now * 0.005) * 0.025;
  head.material.emissive.setHex(damageCooldown ? 0x883322 : 0);
  $("stage").textContent = `0${stage} / 03`;
  $("time").textContent = Math.max(0, Math.ceil(spec.duration - time)) + " s";
  $("score").textContent = completed + " / " + spec.targetCount;
  $("health").value = health.snapshot().value;
  $("pressure").value = pressure.snapshot().value;
  $("cargo").textContent =
    spec.mode === "deliver" ? (carrying ? "LOADED" : "EMPTY") : "";
  $("phase").textContent =
    state === "PLAYING"
      ? spec.mode === "sequence"
        ? `Activate station ${completed + 1}`
        : spec.mode === "deliver"
          ? carrying
            ? "Deliver your supply"
            : "Collect from the central depot"
          : "Restore the field stations"
      : "";
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
