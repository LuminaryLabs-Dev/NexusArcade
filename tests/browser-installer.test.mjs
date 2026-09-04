import test from "node:test";
import assert from "node:assert/strict";
import { BrowserInstaller } from "../src/browser/browser-installer.mjs";

test("browser installations are temporary by default", () => {
  const storage = { isInstalled: () => false };
  const installer = new BrowserInstaller({ storage });
  assert.equal(installer.requestPersistence, false);
});
