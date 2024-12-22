import child_process from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';
import path from 'path';
import { debug, log, logError, logSuccess } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '../../..');

const basicOutputConfig = {
  name: 'material-me',
  sourcemap: true,
};

const basicPlugins = [
  string({
    include: ['**/*.css', '**/*.html'],
  }),
];
const minifiedBundlePlugins = [
  babel({
    babelHelpers: 'bundled',
    configFile: path.resolve(root, 'babel.config.json'),
  }),
  terser(),
];

export async function main(options) {
  log('starting bundle...');
  log('copying files...');
  await fs.promises.cp(
    path.join(root, 'src'),
    path.join(root, '.__compile_cache__'),
    {
      recursive: true,
    },
  );
  log('compiling TypeScript...');
  // This may not seem like standard usage, but it can at least reduce the waiting time by 3s
  child_process.spawnSync(
    'node',
    [path.join(root, 'node_modules', 'typescript', 'lib', 'tsc.js')],
    { cwd: root },
  );
  logSuccess('success compiled TypeScript');
  log('generating bundles...');
  const globedFiles = fs.globSync(
    path.resolve(root, '.__compile_cache__', '**', '*.js'),
  );
  debug({ globedFiles });
  const generateBundlesResult = await rollup({
    // input: path.resolve(__dirname, 'exports__compile_cache.js'),
    input: globedFiles,
    plugins: [...basicPlugins],
  });
  const generateBundlesOutput = await generateBundlesResult.write({
    dir: path.resolve(root, 'dist'),
    format: 'esm',
    preserveModules: true,
    ...basicOutputConfig,
  });
  debug({ generateBundlesResult, generateBundlesOutput });
  logSuccess('success generated bundles');
  log('cleaning up temp dir...');
  await fs.promises.rm(path.join(root, '.__compile_cache__'), {
    recursive: true,
  });
  if (!options.includes('--no-min-bundle')) {
    log('generating minified bundle...');
    const generateMinifiedBundleResult = await rollup({
      input: path.resolve(root, 'exports.js'),
      plugins: [...basicPlugins, ...minifiedBundlePlugins],
    });
    const generateMinifiedBundleOutput =
      await generateMinifiedBundleResult.write({
        file: path.resolve(root, 'dist', 'material-me.min.js'),
        format: 'umd',
        ...basicOutputConfig,
      });
    debug({ generateMinifiedBundleResult, generateMinifiedBundleOutput });
  }
  logSuccess('success generated minified bundle');
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
  if (
    fs.existsSync(path.join(root, '.__compile_cache__')) &&
    !options.includes('--no-finally-clean')
  ) {
    log('cleaning up temp dir...');
    await fs.promises.rm(path.join(root, '.__compile_cache__'), {
      recursive: true,
    });
  }
}

export const docs = `
Usage: build [options]

Options:
  --no-finally-clean  Do not clean up temp directory after build
  --no-min-bundle     Do not generate minified bundle

Examples:
  $ pnpm scripts build`;
