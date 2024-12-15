import fs from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'path';
import http from 'http';
import { debug, log, logError, logSuccess, isSubDir } from './utils.mjs';
import { main as watch, cleanup as watchCleanup } from './watch.mjs';
import { MIMETypes } from './consts.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '../../..');

const port = 5114;
let server;

export async function main(options) {
  log('starting server...');
  server = http.createServer(async (req, res) => {
    debug(`Got request: ${req.method} '${req.url}'`);
    const url = '.' + req.url;
    const filePath = path.join(root, url);
    const extension = path.extname(filePath).slice(1);
    if (req.method === 'GET') {
      if (req.url === '/') {
        res.writeHead(302, { Location: '/demos/index.html' });
        res.end();
        return;
      }
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end(`Cannot ${req.method} ${req.url}: Not Found`);
        return;
      }
      if (!(await fs.promises.lstat(filePath)).isFile()) {
        res.writeHead(404);
        res.end(`Cannot ${req.method} ${req.url}: Is not a file`);
        return;
      }
      const mimeType = MIMETypes[extension] || 'text/plain';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('X-Real-File-Path', filePath);
      fs.createReadStream(filePath).pipe(res);
      return;
    } else {
      res.writeHead(405);
      res.end(`Cannot ${req.method} ${req.url}: Method Not Allowed`);
      return;
    }
  });
  server.listen(port);
  logSuccess(`server listening on port ${port}`);
  log('Starting watch...');
  await watch(options);
}
export async function execute(options) {
  const startTime = new Date();
  try {
    await main(options);
  } catch (error) {
    logError('an uncaught exception was encountered');
    logError('details:');
    console.error(error);
  }
  logSuccess(`done in ${(new Date() - startTime) / 1000}s`);
}
export async function cleanup(options) {
  server.close();
  logSuccess('server stopped');
  await watchCleanup(options);
}

export const docs = `
Usage: server [options]

Options:
  (the following options are being passed to 'watch' script)
    --no-finally-clean  Do not clean up temp directory after build
    --no-min-bundle     Do not generate minified bundle

  Examples:
  $ pnpm scripts server`;
