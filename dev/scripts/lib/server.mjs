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

const port = process.env.PORT ?? 8514;
let server;

export async function main(options) {
  log('starting server...');
  server = http.createServer(async (req, res) => {
    const reqUrl = new URL(
      `http://${process.env.HOST ?? 'localhost'}${req.url}`,
    ).pathname;
    debug(`Got request: ${req.method} '${reqUrl}'`);

    const getFileStat = async (filePath) => {
      if (!fs.existsSync(filePath)) {
        return 'NOT_FOUND';
      }
      if (!(await fs.promises.lstat(filePath)).isFile()) {
        return 'NOT_A_FILE';
      }
      return 'EXISTS';
    };
    const sendFile = async (res, filePath) => {
      const extension = path.extname(filePath).slice(1);
      const mimeType = MIMETypes[extension] || 'text/plain';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('X-Real-File-Path', filePath);
      fs.createReadStream(filePath).pipe(res);
    };
    const resolveAndSendFile = async (reqUrl) => {
      const filePath = path.join(root, reqUrl);
      if (reqUrl === '/') {
        res.writeHead(302, { Location: '/demos/index.html' });
        res.end();
        return;
      }
      const stat = await getFileStat(filePath);
      if (stat !== 'EXISTS') {
        // try to resolve the file as .js
        if (path.extname(filePath) !== '.js') {
          const jsFilePath = `${filePath}.js`;
          const jsStat = await getFileStat(jsFilePath);
          if (jsStat === 'EXISTS') {
            sendFile(res, jsFilePath);
            return;
          }
        }

        if (stat === 'NOT_FOUND') {
          res.writeHead(404);
          res.end(`Cannot ${req.method} ${reqUrl}: Not Found`);
          return;
        }
        if (stat === 'NOT_A_FILE') {
          res.writeHead(404);
          res.end(`Cannot ${req.method} ${reqUrl}: Is not a file`);
          return;
        }
      } else {
        sendFile(res, filePath);
      }
    };

    if (req.method === 'GET') {
      resolveAndSendFile(reqUrl);
      return;
    } else {
      res.writeHead(405);
      res.end(`Cannot ${req.method} ${reqUrl}: Method Not Allowed`);
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
