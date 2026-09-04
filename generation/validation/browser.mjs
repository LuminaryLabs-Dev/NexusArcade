import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { playToWin } from "./gameplay.mjs";
export async function serve(root) {
  const server = createServer(async (req, res) => {
    try {
      const u = new URL(req.url, "http://localhost");
      const rel =
        decodeURIComponent(u.pathname).replace(/^\//, "") || "index.html";
      if (rel.includes("..") || rel.includes("\\")) throw Error("path");
      const b = await readFile(path.join(root, rel));
      res.setHeader(
        "Content-Type",
        rel.endsWith(".js")
          ? "text/javascript"
          : rel.endsWith(".json")
            ? "application/json"
            : rel.endsWith(".html")
              ? "text/html"
              : "application/octet-stream",
      );
      res.end(b);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((r) => server.close(r)),
  };
}
export async function browserValidation(root, output, { record = true } = {}) {
  await mkdir(output, { recursive: true });
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    return {
      status: "BLOCKED",
      errors: [
        "Playwright missing. Install optional dependencies and run npx playwright install chromium.",
      ],
      network: [],
    };
  }
  const server = await serve(root);
  let browser, context;
  const errors = [],
    network = [];
  const result = {
    status: "FAIL",
    errors,
    network,
    sourceRoot: path.resolve(root),
    url: server.url,
    startedAt: new Date().toISOString(),
  };
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    });
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ...(record
        ? { recordVideo: { dir: output, size: { width: 1280, height: 720 } } }
        : {}),
    });
    await context.route("**/*", (route) => {
      const u = new URL(route.request().url());
      if (u.origin !== server.url) {
        network.push(u.origin);
        return route.abort();
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(server.url);
    await page.waitForFunction(() => window.__NEXUS_TEST_STATE__);
    await page.waitForTimeout(600);
    result.renderer = await page.evaluate(() => {
      const gl = document.querySelector("canvas").getContext("webgl2");
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      return {
        name: ext
          ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
      };
    });
    await page.screenshot({ path: path.join(output, "ready.png") });
    await page.keyboard.press("Enter");
    const before = await page.evaluate(() => window.__NEXUS_TEST_STATE__());
    await page.keyboard.down("KeyD");
    await page.waitForTimeout(350);
    await page.keyboard.up("KeyD");
    const after = await page.evaluate(() => window.__NEXUS_TEST_STATE__());
    if (after.player.x <= before.player.x + 0.3)
      throw Error("Movement did not change state");
    await page.screenshot({ path: path.join(output, "playing.png") });
    await page.keyboard.press("KeyR");
    result.playthrough = await playToWin(page);
    await page.screenshot({ path: path.join(output, "win.png") });
    await page.keyboard.press("KeyR");
    if (
      (await page.evaluate(() => window.__NEXUS_TEST_STATE__())).phase !==
      "READY"
    )
      throw Error("Restart failed");
    await page.keyboard.press("Enter");
    result.simulatedFailure = await page.evaluate(() =>
      window.__NEXUS_SIMTIME__.advance(190),
    );
    if (result.simulatedFailure.phase !== "FAIL")
      throw Error("Failure path missing");
    await page.keyboard.press("KeyR");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
    if (
      (await page.evaluate(() => window.__NEXUS_TEST_STATE__())).phase !==
      "PAUSED"
    )
      throw Error("Pause failed");
    result.status = errors.length || network.length ? "FAIL" : "PASS";
    if (record) {
      const video = page.video();
      await page.close();
      await context.close();
      context = null;
      await video.saveAs(path.join(output, "gameplay.webm"));
      result.video = path.join(output, "gameplay.webm");
    }
  } catch (e) {
    errors.push(e.message);
    if (
      /browserType.launch|Executable doesn't exist|Operation not permitted|Host system is missing/.test(
        e.message,
      )
    )
      result.status = "BLOCKED";
  } finally {
    await context?.close();
    await browser?.close();
    await server.close();
  }
  result.finishedAt = new Date().toISOString();
  return result;
}
