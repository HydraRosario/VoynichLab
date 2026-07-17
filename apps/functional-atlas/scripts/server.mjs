import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const analysisPath = args.analysis ? path.resolve(args.analysis) : null;
const port = Number(args.port ?? 4317);

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
  if (url.pathname === "/analysis.json") {
    if (!analysisPath || !fs.existsSync(analysisPath)) return send(response, 404, "application/json", JSON.stringify({ error: "No analysis configured" }));
    return send(response, 200, "application/json", fs.readFileSync(analysisPath));
  }
  const relative = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const filePath = path.resolve(root, relative);
  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== path.join(root, "index.html")) return send(response, 403, "text/plain", "Forbidden");
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return send(response, 404, "text/plain", "Not found");
  send(response, 200, mime(filePath), fs.readFileSync(filePath));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Functional Atlas: http://127.0.0.1:${port}`);
  console.log(analysisPath ? `Analysis: ${analysisPath}` : "No analysis configured; use the file loader in the interface.");
});

function send(response, status, contentType, body) {
  response.writeHead(status, { "content-type": `${contentType}; charset=utf-8`, "cache-control": "no-store" });
  response.end(body);
}
function mime(filePath) {
  return { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" }[path.extname(filePath)] ?? "application/octet-stream";
}
function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2).replaceAll("-", "_");
    result[key] = argv[index + 1];
    index += 1;
  }
  return result;
}
