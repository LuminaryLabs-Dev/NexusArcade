import { REST, Routes } from "discord.js";
import { pathToFileURL } from "node:url";
import { loadEnvironment } from "../src/config/environment.mjs";
import { commandJson } from "../src/discord/commands.mjs";

export async function registerCommands(config = loadEnvironment()) {
  const rest = new REST({ version: "10" }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commandJson });
  return commandJson.length;
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  const config = loadEnvironment();
  const count = await registerCommands(config);
  console.log(`Registered ${count} NexusArcade Builder commands in guild ${config.guildId}.`);
}
