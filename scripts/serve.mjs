import fs from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'path';
import http from 'http';
import { debug, log, logError, logSuccess, useCleanup } from './lib/utils.mjs';
import { MIMETypes } from './lib/consts.mjs';

/**
 * @typedef FileStat
 * @type {'NOT_FOUND' | 'NOT_A_FILE' | 'EXISTS'}
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '../..');

const port = process.env.PORT ?? 8514;
/** @type {http.Server} */
let server;

export async function main() {
  log('starting server...');
  server = http.createServer(async (req, res) => {
    const reqUrl = new URL(
      `http://${process.env.HOST ?? 'localhost'}${req.url}`,
    ).pathname;
    debug(`Got request: ${req.method} '${reqUrl}'`);

    /**
     * Get file stat
     * @param {string} filePath
     * @returns {Promise<FileStat>}
     */
    const getFileStat = async (filePath) => {
      if (!fs.existsSync(filePath)) {
        return 'NOT_FOUND';
      }
      if (!(await fs.promises.lstat(filePath)).isFile()) {
        return 'NOT_A_FILE';
      }
      return 'EXISTS';
    };

    /**
     * Send file
     * @param {http.ServerResponse} res
     * @param {string} filePath
     */
    const sendFile = async (res, filePath) => {
      const extension = path.extname(filePath).slice(1);
      const mimeType = MIMETypes[extension] || 'text/plain';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('X-Real-File-Path', filePath);
      fs.createReadStream(filePath).pipe(res);
    };

    /**
     * Resolve and send file based on request URL
     * @param {string} reqUrl
     * @returns
     */
    const resolveAndSendFile = async (reqUrl) => {
      const filePath = path.join(root, reqUrl);
      if (reqUrl === '/') {
        res.writeHead(302, { Location: '/demos/index.html' });
        res.end();
        return;
      }
      // 获取文件的状态信息
      const stat = await getFileStat(filePath);
      // 如果文件不存在
      if (stat !== 'EXISTS') {
        // 尝试将请求的文件路径添加.js扩展名
        if (path.extname(filePath) !== '.js') {
          const jsFilePath = `${filePath}.js`;
          const jsStat = await getFileStat(jsFilePath);
          if (jsStat === 'EXISTS') {
            sendFile(res, jsFilePath);
            return;
          }
        }

        // 如果文件未找到或不是一个文件，则返回404状态码和错误信息
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
        // 如果文件存在，则发送该文件
        sendFile(res, filePath);
      }
    };

    // 处理GET请求
    if (req.method === 'GET') {
      resolveAndSendFile(reqUrl);
      return;
    } else {
      // 如果不是GET请求，则返回405状态码和错误信息
      res.writeHead(405);
      res.end(`Cannot ${req.method} ${reqUrl}: Method Not Allowed`);
      return;
    }
  });

  server.listen(port);
  logSuccess(`server listening on port ${port}`);
  await new Promise((resolve) => {
    server.on('close', resolve);
  });
}
export async function execute() {
  const startTime = new Date();
  try {
    await main();
  } catch (error) {
    logError('an uncaught exception was encountered');
    logError('details:');
    console.error(error);
  }
  logSuccess(`done in ${(new Date() - startTime) / 1000}s`);
}
export async function cleanup() {
  server.close();
  logSuccess('server stopped');
}

useCleanup(cleanup);
execute();
