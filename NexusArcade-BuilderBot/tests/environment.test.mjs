import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseDotEnv } from "../src/config/environment.mjs";
import { serializeEnvironment, writeEnvironmentFile } from "../src/config/credentials.mjs";

const config = {
  token: "super-secret-token",
  clientId: "123456789012345678",
  guildId: "223456789012345678",
  channelId: "323456789012345678",
  debug: true,
  sessionTtlHours: 24
};

test("parseDotEnv reads quoted and unquoted values", () => {
  assert.deepEqual(parseDotEnv('A=one\nB="two"\n# ignored\n'), { A: "one", B: "two" });
});

test("serializeEnvironment contains all managed values without logging behavior", () => {
  const text = serializeEnvironment(config);
  assert.match(text, /DISCORD_CLIENT_ID="123456789012345678"/);
  assert.match(text, /DISCORD_TOKEN="super-secret-token"/);
  assert.match(text, /NEXUS_ARCADE_DEBUG="true"/);
});

test("writeEnvironmentFile refuses to overwrite existing env by default", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "nab-env-"));
  const file = path.join(root, ".env");
  await fs.writeFile(file, 'KEEP="yes"\n');
  await assert.rejects(() => writeEnvironmentFile(file, config), { code: "NAB_ENV_EXISTS" });
  assert.equal(await fs.readFile(file, "utf8"), 'KEEP="yes"\n');
  await fs.rm(root, { recursive: true, force: true });
});

test("update mode preserves unrelated existing values", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "nab-env-"));
  const file = path.join(root, ".env");
  await fs.writeFile(file, 'KEEP="yes"\nDISCORD_CLIENT_ID="old"\n');
  await writeEnvironmentFile(file, config, { replace: true, preserveExisting: true });
  const saved = await fs.readFile(file, "utf8");
  assert.match(saved, /KEEP="yes"/);
  assert.match(saved, /DISCORD_CLIENT_ID="123456789012345678"/);
  await fs.rm(root, { recursive: true, force: true });
});

test("new env file is written with BuilderBot values", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "nab-env-"));
  const file = path.join(root, ".env");
  await writeEnvironmentFile(file, config);
  const saved = parseDotEnv(await fs.readFile(file, "utf8"));
  assert.equal(saved.DISCORD_GUILD_ID, config.guildId);
  assert.equal(saved.NEXUS_ARCADE_BUILDER_CHANNEL_ID, config.channelId);
  await fs.rm(root, { recursive: true, force: true });
});
