#!/usr/bin/env node

'use strict';

import { debug, log, logError, logSuccess } from './lib/utils.mjs';
import * as buildScript from './lib/build.mjs';
import * as watchScript from './lib/watch.mjs';
import * as serverScript from './lib/server.mjs';

const scripts = {
  build: buildScript,
  watch: watchScript,
  server: serverScript,
};

const argv = process.argv.slice(2);
const scriptNameIndex = argv.findIndex((arg) => !arg.startsWith('-'));
const scriptName = argv[scriptNameIndex];
const runOptions = argv.filter(
  (arg, index) => arg.startsWith('-') && index < scriptNameIndex,
);
const scriptOptions = argv.filter(
  (arg, index) => arg.startsWith('-') && index > scriptNameIndex,
);

const docsStr = `
Usage: pnpm script [run-options] [script-name] [script-options]

Run options:
  --help  Show the script's documentation
  --list  List all available scripts
  --debug  Enable debug mode

`;

let script;

process.on('SIGINT', async () => {
  if (cleanupFunc) {
    await cleanupFunc();
  }
  log('Script execution stopped by user.');
  process.exit(0);
});

async function main() {
  const startTime = Date.now();
  log('Material-Me Script Executor');
  if (!scriptName) {
    console.log(docsStr);
    return;
  }
  log(`Running script: ${scriptName}`);
  log(`With Options: ${runOptions.join(' ')}`);
  if (!scripts[scriptName]) {
    logError(`Invalid script name: ${scriptName}`);
    logError('Hint: use --list option to list all scripts');
    process.exitCode = 2;
    return;
  }
  script = scripts[scriptName];
  const { execute, cleanup, docs } = script;
  if (runOptions.includes('--help')) {
    log(`Docs of script ${scriptName}:`);
    console.log(docs);
    process.exitCode = 0;
    return;
  }
  console.group('Script Output:');
  try {
    await execute(scriptOptions);
    console.groupEnd();
    logSuccess(`Script completed in ${(Date.now() - startTime) / 1000}s.`);
  } catch (error) {
    console.groupEnd();
    logError(`Error running script ${scriptName}:`);
    console.error(error);
    process.exitCode = 1;
    return;
  }
  if (cleanup) {
    await cleanupFunc();
  }
  logSuccess(`Completed in ${(Date.now() - startTime) / 1000}s.`);
}

async function cleanupFunc() {
  log('Running cleanup...');
  console.group('Cleanup output:');
  try {
    await script.cleanup(scriptOptions);
    console.groupEnd();
    logSuccess('Cleanup complete.');
  } catch (error) {
    console.groupEnd();
    logError(`Error running cleanup for script ${scriptName}:`);
    console.error(error);
    process.exitCode = 1;
    return;
  }
}

main();
