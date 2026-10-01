import { spawn } from "node:child_process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { resolveEnvironment } from "../src/config/environment.mjs";
import { runSetup } from "../src/config/setup.mjs";

function launch() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--watch", "src/index.mjs"], { stdio: "inherit", env: process.env });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 0));
  });
}

try {
  resolveEnvironment();
  process.exitCode = await launch();
} catch (error) {
  if (error.code !== "NAB_CONFIG_MISSING") throw error;
  console.log("BuilderBot is not configured.");
  const rl = readline.createInterface({ input, output });
  const choice = (await rl.question("[1] Persistent setup  [2] Temporary setup  [3] Exit: ")).trim();
  rl.close();
  try {
    if (choice === "1") {
      await runSetup({ forceStorage: "persistent", watch: true });
    } else if (choice === "2") {
      await runSetup({ forceStorage: "temporary", watch: true });
    } else {
      console.log("No changes made.");
    }
  } catch (setupError) {
    if (setupError.code === "NAB_SETUP_CANCELLED") console.log(setupError.message);
    else throw setupError;
  }
}
