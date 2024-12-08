#!/usr/bin/env node

'use strict';

import { debug, log, logError, logSuccess } from './lib/utils.mjs';
import * as buildScript from './lib/build.mjs';

const scripts = {
  build: buildScript,
};

const argv = process.argv.slice(2);
const scriptNameIndex = argv.findIndex((arg) => !arg.startsWith('-'));
const scriptName = argv[scriptNameIndex];
const runOptions = argv.filter((arg, index) => arg.startsWith('-') && index < scriptNameIndex);
const scriptOptions = argv.filter((arg, index) => arg.startsWith('-') && index > scriptNameIndex);

const docsStr = `
Usage: pnpm script [run-options] [script-name] [script-options]

Run options:
  --help  Show the script's documentation
  --list  List all available scripts
  --debug  Enable debug mode

`;

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
  const script = scripts[scriptName];
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
    log('Running cleanup...');
    console.group('Cleanup output:');
    try {
      await cleanup(scriptOptions);
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
  logSuccess(`Completed in ${(Date.now() - startTime) / 1000}s.`);
}

main();
