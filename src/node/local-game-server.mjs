import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { assertGameId, assertSafeRelativePath, assertVersion } from "../core/paths.mjs";

const TYPES = { html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8", mjs: "text/javascript; charset=utf-8", json: "application/json; charset=utf-8", png: "image/png", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml", wasm: "application/wasm", mp3: "audio/mpeg", wav: "audio/wav" };

function send(response, status, body, type = "text/plain; charset=utf-8") {
  response.writeHead(status, { "Content-Type": type, "Content-Length": Buffer.byteLength(body), "Cache-Control": "no-store" });
  response.end(body);
}

export async function createLocalGameServer({ root, host = "127.0.0.1", port = 0 } = {}) {
  if (!root) throw new TypeError("An installation root is required");
  const gamesRoot = path.resolve(root, "games");
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const segments = url.pathname.split("/").filter(Boolean);
      if (request.method !== "GET" || segments[0] !== "games" || segments.length < 3) return send(response, 404, "Not found");
      const id = assertGameId(segments[1]);
      let version = segments[2];
      let fileSegments = segments.slice(3);
      if (version === "current") {
        version = (await readFile(path.join(gamesRoot, id, "current"), "utf8")).trim();
      }
      assertVersion(version);
      const relative = assertSafeRelativePath(fileSegments.join("/") || "index.html");
      const versionRoot = path.resolve(gamesRoot, id, version);
      const target = path.resolve(versionRoot, relative);
      if (!target.startsWith(`${versionRoot}${path.sep}`)) return send(response, 400, "Invalid path");
      const info = await stat(target);
      if (!info.isFile()) return send(response, 404, "Not found");
      const body = await readFile(target);
      const extension = path.extname(target).slice(1).toLowerCase();
      response.writeHead(200, { "Content-Type": TYPES[extension] || "application/octet-stream", "Content-Length": body.byteLength, "Cache-Control": "no-store" });
      response.end(body);
    } catch (error) {
      send(response, error.code === "ENOENT" ? 404 : 400, error.code === "ENOENT" ? "Not found" : "Invalid request");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });
  const address = server.address();
  return { server, url: `http://${host}:${address.port}`, close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
}
