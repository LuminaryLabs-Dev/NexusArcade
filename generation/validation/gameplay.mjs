export async function playToWin(page) {
  await page.keyboard.press("Enter");
  let steps = 0;
  const started = Date.now();
  while (Date.now() - started < 180000) {
    const s = await page.evaluate(() => window.__NEXUS_TEST_STATE__());
    if (s.phase === "WIN")
      return {
        pass: true,
        steps,
        inputCount: s.inputCount,
        interactions: s.interactions,
        seconds: (Date.now() - started) / 1000,
      };
    if (s.phase === "FAIL") throw Error("Game failed during input play");
    const target =
      s.mode === "deliver" && !s.carrying
        ? { x: 0, z: 0 }
        : s.targets.find((t) => !t.done);
    if (!target) continue;
    const dx = target.x - s.player.x,
      dz = target.z - s.player.z;
    const held = [];
    if (Math.abs(dx) > 0.35) held.push(dx > 0 ? "KeyD" : "KeyA");
    if (Math.abs(dz) > 0.35) held.push(dz > 0 ? "KeyS" : "KeyW");
    if (Math.hypot(dx, dz) < 1.1) held.push("Space");
    for (const k of held) await page.keyboard.down(k);
    await page.waitForTimeout(100);
    for (const k of held) await page.keyboard.up(k);
    steps++;
  }
  throw Error("Gameplay timeout");
}
