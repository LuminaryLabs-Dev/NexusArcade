#!/usr/bin/env node
import process from "node:process";
import { NodeInstaller } from "../node/node-installer.mjs";
import { createLocalGameServer } from "../node/local-game-server.mjs";

function usage() {
  console.log("Usage: nexus-arcade <list|install|serve> [game-id] [--destination <path>] [--port <number>]");
}

function option(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const [, , command, id] = process.argv;
const destination = option("destination", process.env.NEXUS_ARCADE_HOME || "./nexus-arcade-data");

try {
  if (command === "list") {
    const installer = new NodeInstaller({ destination });
    for (const game of await installer.library.load()) console.log(`${game.id}\t${game.version}\t${game.title}`);
  } else if (command === "install") {
    if (!id) throw new Error("install requires a game ID");
    const installer = new NodeInstaller({ destination });
    const result = await installer.install(id, (progress) => console.log(`${progress.percent.toFixed(2)}%\t${progress.file}`));
    console.log(`Installed ${result.manifest.id} ${result.manifest.version} at ${result.directory}`);
  } else if (command === "serve") {
    const server = await createLocalGameServer({ root: destination, port: Number(option("port", "0")) });
    console.log(`Nexus Arcade server listening at ${server.url}`);
  } else {
    usage();
    process.exitCode = command ? 1 : 0;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
