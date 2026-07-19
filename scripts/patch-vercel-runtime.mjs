/**
 * Post-build patch: forces the Nitro serverless function runtime to nodejs22.x
 * Nitro auto-detects your local Node.js version (currently 24.x) which Vercel
 * doesn't support. Vercel supports up to nodejs22.x.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const vcConfigPath = join(
  ".vercel",
  "output",
  "functions",
  "__server.func",
  ".vc-config.json",
);

try {
  const config = JSON.parse(readFileSync(vcConfigPath, "utf8"));
  if (config.runtime !== "nodejs22.x") {
    config.runtime = "nodejs22.x";
    writeFileSync(vcConfigPath, JSON.stringify(config, null, 2));
    console.log("✅ Patched .vc-config.json: runtime set to nodejs22.x");
  } else {
    console.log("✅ .vc-config.json already uses nodejs22.x — no patch needed.");
  }
} catch (e) {
  console.warn("⚠️  Could not patch .vc-config.json:", e.message);
}
