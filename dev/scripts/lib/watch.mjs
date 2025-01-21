import fs from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { debug, log, logError, logSuccess, isSubDir } from './utils.mjs';
import { main as build, cleanup as buildCleanup } from './build.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '../../..');

const ignoredPaths = [
  'node_modules',
  'test',
  'demos',
  'dist',
  'coverage',
  'dev',
  '.vscode',
  '.github',
  '.git',
];

const watcherAbortController = new AbortController();
const taskStack = [];
let taskProcessing = false;
let intervalId = -1;

export async function main(options) {
  log('Starting watch mode...');
  const checkPath = (parent, dir) => {
    return path.relative(parent, dir) === '' || isSubDir(parent, dir);
  };
  const watcher = fs.watch(
    root,
    {
      recursive: true,
      signal: watcherAbortController.signal,
    },
    async (eventType, filename) => {
      if (!filename) {
        return;
      }
      const normalizedPathname = path.resolve(root, filename);
      const isIgnored = ignoredPaths.some((ignoredPath) =>
        checkPath(path.join(root, ignoredPath), normalizedPathname),
      );
      if (isIgnored) {
        return;
      }
      debug(`File changes detected: ${filename} (type: ${eventType})`);
      taskStack.push({ eventType, filename });
    },
  );
  intervalId = setInterval(async () => {
    if (taskStack.length > 0 && !taskProcessing) {
      taskProcessing = true;
      taskStack.splice(0, taskStack.length);
      log(`Building...`);
      console.group('Build output:');
      await build(options);
      console.groupEnd();
      logSuccess('Build success. Waiting for changes...');
      taskProcessing = false;
    }
  }, 1000);
  logSuccess('Success started watching changes (Ctrl-C to exit)');
  await new Promise((resolve) => watcher.once('close', resolve));
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
  buildCleanup(options);
  log('Stopping watching...');
  watcherAbortController.abort();
  if (intervalId !== -1) {
    clearInterval(intervalId);
  }
  logSuccess('Stopped watching changes');
}

export const docs = `
Usage: watch [options]

Options:
  (the following options are being passed to 'build' script)
    --no-finally-clean  Do not clean up temp directory after build
    --no-min-bundle     Do not generate minified bundle

  Examples:
  $ pnpm scripts watch`;
