/**
 * Post-build patch for Vercel Serverless deployment:
 * 1. Forces Nitro serverless function runtime to nodejs22.x
 * 2. Bridges Nitro's Web Fetch handler { fetch(req) } to Vercel's Node.js (req, res) handler.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const funcDir = join(".vercel", "output", "functions", "__server.func");
const vcConfigPath = join(funcDir, ".vc-config.json");
const indexMjsPath = join(funcDir, "index.mjs");

// 1. Patch .vc-config.json runtime to nodejs22.x
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
  console.warn("⚠️ Could not patch .vc-config.json:", e.message);
}

// 2. Patch index.mjs to convert Web Fetch handler to Node (req, res) handler
try {
  let content = readFileSync(indexMjsPath, "utf8");
  if (!content.includes("nodeHandlerAdapter")) {
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

    const body = (req.method === "GET" || req.method === "HEAD") ? null : req;
    const webReq = new Request(url, {
      method: req.method,
      headers,
      body,
      duplex: "half",
    });

    const webRes = await vercel_web_default.fetch(webReq, {});

    res.statusCode = webRes.status;
    webRes.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    if (webRes.body) {
      const reader = webRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
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
    console.log("✅ Patched index.mjs: Node.js (req, res) adapter attached to vercel_web_default.");
  } else {
    console.log("✅ index.mjs already contains nodeHandlerAdapter.");
  }
} catch (e) {
  console.warn("⚠️ Could not patch index.mjs:", e.message);
}
