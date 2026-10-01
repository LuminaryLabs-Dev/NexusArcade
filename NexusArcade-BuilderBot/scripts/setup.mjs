import { runSetup } from "../src/config/setup.mjs";

const temporary = process.argv.includes("--temporary");
try {
  await runSetup({ forceStorage: temporary ? "temporary" : null });
} catch (error) {
  if (error.code === "NAB_SETUP_CANCELLED") {
    console.log(error.message);
    process.exit(0);
  }
  console.error(error.message);
  process.exit(1);
}
