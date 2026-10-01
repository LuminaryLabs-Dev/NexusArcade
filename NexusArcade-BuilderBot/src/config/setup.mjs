import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";
import { parseDotEnv, applyEnvironment } from "./environment.mjs";
import { writeEnvironmentFile } from "./credentials.mjs";
import { validateDiscordConfiguration } from "./validation.mjs";
import { registerCommands } from "../../scripts/register-commands.mjs";

function yes(value) {
  return ["y", "yes"].includes(String(value || "").trim().toLowerCase());
}

async function secureQuestion(prompt) {
  if (!input.isTTY || typeof input.setRawMode !== "function") throw new Error("Hidden token input requires an interactive terminal.");
  output.write(prompt);
  input.setRawMode(true);
  input.resume();
  input.setEncoding("utf8");
  let value = "";
  try {
    return await new Promise((resolve, reject) => {
      const onData = (chunk) => {
        for (const char of chunk) {
          if (char === "\u0003") {
            input.off("data", onData);
            reject(Object.assign(new Error("Setup cancelled."), { code: "NAB_SETUP_CANCELLED" }));
            return;
          }
          if (char === "\r" || char === "\n") {
            input.off("data", onData);
            output.write("\n");
            resolve(value);
            return;
          }
          if (char === "\u007f" || char === "\b") {
            value = value.slice(0, -1);
            continue;
          }
          if (char >= " ") value += char;
        }
      };
      input.on("data", onData);
    });
  } finally {
    input.setRawMode(false);
  }
}

async function ask(rl, prompt, fallback = "") {
  const suffix = fallback ? ` [${fallback}]` : "";
  const value = (await rl.question(`${prompt}${suffix}: `)).trim();
  return value || fallback;
}

function printChecks(result) {
  const labels = { token: "Bot token", clientId: "Application ID", guildId: "Guild", channelId: "Channel" };
  output.write("\nDiscord configuration validation\n");
  for (const [key, check] of Object.entries(result.checks)) {
    output.write(`  ${labels[key].padEnd(15)} ${check.skipped ? "–" : check.ok ? "✓" : "✗"} ${check.message}\n`);
  }
  output.write("\n");
}

async function existingEnvChoice(rl, envFile) {
  try {
    await fs.access(envFile);
  } catch {
    return "new";
  }
  output.write(`An existing ${path.basename(envFile)} was found. It will not be overwritten silently.\n`);
  const choice = (await rl.question("[1] Update it  [2] Replace BuilderBot values  [3] Cancel: ")).trim();
  if (choice === "1") return "update";
  if (choice === "2") return "replace";
  throw Object.assign(new Error("Setup cancelled; existing .env unchanged."), { code: "NAB_SETUP_CANCELLED" });
}

async function readExisting(envFile) {
  try { return parseDotEnv(await fs.readFile(envFile, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return {}; throw error; }
}

function spawnBot(config, { watch = false } = {}) {
  return new Promise((resolve, reject) => {
    const args = watch ? ["--watch", "src/index.mjs"] : ["src/index.mjs"];
    const child = spawn(process.execPath, args, {
      cwd: path.resolve("."),
      stdio: "inherit",
      env: {
        ...process.env,
        DISCORD_TOKEN: config.token,
        DISCORD_CLIENT_ID: config.clientId,
        DISCORD_GUILD_ID: config.guildId,
        NEXUS_ARCADE_BUILDER_CHANNEL_ID: config.channelId || "",
        NEXUS_ARCADE_DEBUG: String(config.debug),
        NEXUS_ARCADE_SESSION_TTL_HOURS: String(config.sessionTtlHours)
      }
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => resolve({ code, signal }));
  });
}

async function collectValidConfig(rl, existing, fetchImpl) {
  while (true) {
    const clientId = await ask(rl, "Discord Client ID", existing.DISCORD_CLIENT_ID || "");
    rl.pause();
    const token = await secureQuestion("Discord Bot Token: ");
    rl.resume();
    if (!token) throw new Error("Discord Bot Token is required.");
    const guildId = await ask(rl, "Discord Guild ID", existing.DISCORD_GUILD_ID || "");
    const restrict = yes(await ask(rl, "Restrict the bot to one Builder channel? (y/N)", existing.NEXUS_ARCADE_BUILDER_CHANNEL_ID ? "y" : "n"));
    const channelId = restrict ? await ask(rl, "Builder Channel ID", existing.NEXUS_ARCADE_BUILDER_CHANNEL_ID || "") : null;
    const debug = yes(await ask(rl, "Run in debug mode? (Y/n)", existing.NEXUS_ARCADE_DEBUG === "false" ? "n" : "y"));
    const config = { token, clientId, guildId, channelId, debug, sessionTtlHours: Number(existing.NEXUS_ARCADE_SESSION_TTL_HOURS || 24) };

    output.write("\nValidating with Discord...\n");
    const validation = await validateDiscordConfiguration(config, { fetchImpl });
    printChecks(validation);
    if (validation.ok) return config;

    const retry = yes(await ask(rl, "Validation failed. Try again? (Y/n)", "y"));
    if (!retry) {
      const error = new Error("Discord configuration is invalid. Nothing was saved.");
      error.code = "NAB_DISCORD_INVALID";
      error.validation = validation;
      throw error;
    }
  }
}

export async function runSetup({
  forceStorage = null,
  forceStart = false,
  watch = false,
  skipActionPrompts = false,
  envFile = path.resolve(".env"),
  fetchImpl = globalThis.fetch
} = {}) {
  const rl = readline.createInterface({ input, output });
  try {
    output.write("\nNEXUSARCADE BUILDERBOT SETUP\n\n");
    const existing = await readExisting(envFile);
    const config = await collectValidConfig(rl, existing, fetchImpl);

    let storage = forceStorage;
    if (!storage) {
      const answer = (await rl.question("[1] Save local .env  [2] Temporary for this session  [3] Cancel: ")).trim();
      if (answer === "1") storage = "persistent";
      else if (answer === "2") storage = "temporary";
      else throw Object.assign(new Error("Setup cancelled. Nothing was saved."), { code: "NAB_SETUP_CANCELLED" });
    }

    if (storage === "persistent") {
      const existingChoice = await existingEnvChoice(rl, envFile);
      await writeEnvironmentFile(envFile, config, { replace: existingChoice !== "new", preserveExisting: existingChoice === "update" });
      output.write(`Saved BuilderBot configuration to ${envFile}.\n`);
      applyEnvironment({
        DISCORD_TOKEN: config.token,
        DISCORD_CLIENT_ID: config.clientId,
        DISCORD_GUILD_ID: config.guildId,
        NEXUS_ARCADE_BUILDER_CHANNEL_ID: config.channelId || "",
        NEXUS_ARCADE_DEBUG: String(config.debug),
        NEXUS_ARCADE_SESSION_TTL_HOURS: String(config.sessionTtlHours)
      }, { overwrite: true });
    } else {
      output.write("Using temporary credentials only. No credential file was written.\n");
    }

    let shouldRegister = false;
    let shouldStart = forceStart;
    if (!skipActionPrompts) {
      shouldRegister = yes(await ask(rl, "Register/update the four Discord commands now? (Y/n)", "y"));
      shouldStart = yes(await ask(rl, "Start BuilderBot now? (Y/n)", "y"));
    }

    if (shouldRegister) {
      const count = await registerCommands(config);
      output.write(`Registered ${count} Discord commands.\n`);
    }
    if (shouldStart) {
      output.write("Starting NexusArcade BuilderBot...\n");
      await spawnBot(config, { watch });
    }
    return { config, storage, registered: shouldRegister, started: shouldStart };
  } finally {
    rl.close();
  }
}
