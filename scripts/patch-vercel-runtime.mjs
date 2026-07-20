/**
 * Post-build patch for Vercel Serverless deployment:
 * Dynamically scans all .func directories inside .vercel/output/functions/ and:
 * 1. Forces Nitro serverless function runtime to nodejs22.x
 * 2. Bridges Nitro's Web Fetch handler { fetch(req) } to Vercel's Node.js (req, res) handler.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const functionsDir = join(".vercel", "output", "functions");

if (!existsSync(functionsDir)) {
  console.warn("⚠️  .vercel/output/functions directory does not exist.");
} else {
  const funcDirs = readdirSync(functionsDir).filter((d) => d.endsWith(".func"));
  console.log(`🔍 Found ${funcDirs.length} serverless function(s) to patch: ${funcDirs.join(", ")}`);

  for (const funcName of funcDirs) {
    const funcDir = join(functionsDir, funcName);
    const vcConfigPath = join(funcDir, ".vc-config.json");
    const indexMjsPath = join(funcDir, "index.mjs");

    // 1. Patch .vc-config.json runtime to nodejs22.x
    if (existsSync(vcConfigPath)) {
      try {
        const config = JSON.parse(readFileSync(vcConfigPath, "utf8"));
        if (config.runtime !== "nodejs22.x") {
          config.runtime = "nodejs22.x";
          writeFileSync(vcConfigPath, JSON.stringify(config, null, 2));
          console.log(`✅ Patched ${funcName}/.vc-config.json: runtime set to nodejs22.x`);
        } else {
          console.log(`✅ ${funcName}/.vc-config.json already uses nodejs22.x`);
        }
      } catch (e) {
        console.warn(`⚠️ Could not patch ${funcName}/.vc-config.json:`, e.message);
      }
    }

    // 2. Patch index.mjs to convert Web Fetch handler to Node (req, res) handler
    if (existsSync(indexMjsPath)) {
      try {
        let content = readFileSync(indexMjsPath, "utf8");
        // Remove previous adapter if present to apply fresh clean adapter
        if (content.includes("// --- Vercel Node.js Serverless Function Adapter ---")) {
          const splitPoint = content.indexOf("// --- Vercel Node.js Serverless Function Adapter ---");
          content = content.slice(0, splitPoint);
        }

        const bridgeCode = `
// --- Vercel Node.js Serverless Function Adapter ---
async function nodeHandlerAdapter(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = new URL(req.url, \`\${protocol}://\${host}\`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }
    }

    const init = {
      method: req.method,
      headers,
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = req;
      init.duplex = "half";
    }

    const webReq = new Request(url, init);
    const webRes = await vercel_web_default.fetch(webReq, {});

    res.statusCode = webRes.status;
    webRes.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const arrayBuffer = await webRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.end(buffer);
  } catch (err) {
    console.error("Vercel Serverless Function Error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

export default nodeHandlerAdapter;
`;

        if (content.includes("export { vercel_web_default as default };")) {
          content = content.replace("export { vercel_web_default as default };", bridgeCode);
        } else {
          content += bridgeCode;
        }

        writeFileSync(indexMjsPath, content);
        console.log(`✅ Patched ${funcName}/index.mjs: Bulletproof Node.js (req, res) adapter attached.`);
      } catch (e) {
        console.warn(`⚠️ Could not patch ${funcName}/index.mjs:`, e.message);
      }
    }
  }
}
