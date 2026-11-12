// Local static evidence harness. No execution endpoint, request logging or uploads.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("./", import.meta.url));
const assets = new Set(["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"]);
http.createServer(async (req, res) => {
  const path = new URL(req.url, "http://localhost").pathname;
  const asset = path.startsWith("/runtime/") && assets.has(path.slice(9));
  const file = asset ? `.runtime/${path.slice(9)}` : ({"/": "index.html", "/host.mjs": "host.mjs", "/frame.html": "frame.html", "/worker.mjs": "worker.mjs"})[path];
  if (req.method !== "GET" || !file) { res.writeHead(404); res.end(); return; }
  try {
    const data = await readFile(root + file + (asset ? '.bin' : ''));
    res.setHeader("Content-Type", file.endsWith("mjs") ? "text/javascript" : file.endsWith("wasm") ? "application/wasm" : file.endsWith("html") ? "text/html" : "application/octet-stream");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", asset ? "public, max-age=31536000, immutable" : "no-store");
    // Assets are read by the trusted same-origin host. No opaque-origin HTTP access.
    res.setHeader("Content-Security-Policy", file === "frame.html" ? "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob: data:; connect-src blob:; worker-src blob: data:; frame-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'" : "default-src 'none'; script-src 'self'; connect-src 'self'; frame-src 'self'; base-uri 'none'; object-src 'none'");
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
}).listen(3190, "127.0.0.1", () => console.log("Spike http://127.0.0.1:3190 (local only)"));
