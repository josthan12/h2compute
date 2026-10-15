// Serve only the generated package on loopback; no submission endpoint or logs.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const summaryName = process.env.SPIKE_PREVIEW_SUMMARY ?? 'preview-summary.json';
if (!['preview-summary.json', 'stdlib-preview-summary-20261015.json'].includes(summaryName)) throw new Error('Choose a reviewed local preview summary');
const summary = JSON.parse(await readFile(new URL('./' + summaryName, import.meta.url), 'utf8'));
const packageRoot = pathToFileURL(summary.directory + '/');
const manifest = JSON.parse(await readFile(new URL('package-manifest.json', packageRoot), 'utf8'));
const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  const file = path === '/' ? 'index.html' : path.slice(1);
  const record = manifest.files[file];
  if (req.method !== 'GET' || !record) { res.writeHead(404); res.end(); return; }
  try {
    const data = await readFile(new URL('public/' + file, packageRoot));
    res.writeHead(200, record.headers); res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
server.listen(3191, '127.0.0.1', () => console.log('Packaged preview http://127.0.0.1:3191 (local only, uncompressed)'));
process.on('SIGINT', () => server.close());
