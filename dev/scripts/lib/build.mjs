import child_process from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
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

const basicPlugins = [];
const minifiedBundlePlugins = [
  babel({
    babelHelpers: 'bundled',
    configFile: path.resolve(root, 'babel.config.json'),
  }),
  terser(),
];

export async function main(options) {
  log('starting bundle...');
  log('removing dist folder...');
  if (fs.existsSync(path.resolve(root, 'dist'))) {
    await fs.promises.rm(path.resolve(root, 'dist'), { recursive: true });
  }
  await fs.promises.mkdir(path.resolve(root, 'dist'), { recursive: true });
  log('compiling TypeScript & generating imports...');
  const compileTypescript = async () => {
    if (options.includes('--no-tsc')) {
      return;
    }
    /*
    // This may not seem like standard usage, but it can at least reduce the waiting time by 3s
    const tscProcess = child_process.spawn(
      'node',
      [path.resolve(root, 'node_modules', 'typescript', 'lib', 'tsc.js')],
      { cwd: root },
    );
    */
    // Well, the speed of standard usage (npx) is not bad...
    const tscProcess = child_process.exec('npx tsc', { cwd: root });
    await new Promise((resolve) => tscProcess.once('exit', resolve));
    logSuccess('success compiled TypeScript');
  };
  const generateImports = async () => {
    if (options.includes('--no-gen-imports')) {
      return;
    }
    let globedFiles = [];
    const globFiles = async (pattern) =>
      new Promise((resolve) =>
        fs.glob(path.resolve(pattern), (err, matches) => {
          if (err) throw err;
          globedFiles.push(...matches);
          resolve(matches);
        }),
      );
    // Glob all HTML & CSS files
    await Promise.all([
      globFiles(path.resolve(root, 'src', '**', '*.html')),
      globFiles(path.resolve(root, 'src', '**', '*.css')),
    ]);
    debug({ globedFiles });
    const writeTasks = [];
    for (const file of globedFiles) {
      const filePath = path.resolve(file);
      // Replace src -> dist
      const distFilePath =
        path.resolve(
          path.resolve(root, 'dist'),
          path.relative(path.resolve(root, 'src'), file),
        ) + '.js';
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const distFileContent = `export default ${JSON.stringify(fileContent)};`;
      // Ensure the directory exists before writing the file
      if (!fs.existsSync(path.dirname(distFilePath))) {
        await fs.promises.mkdir(path.dirname(distFilePath), {
          recursive: true,
        });
      }
      // Write the file
      writeTasks.push(
        fs.promises.writeFile(distFilePath, distFileContent, 'utf-8'),
      );
    }
    await Promise.all(writeTasks);
    logSuccess('success generated imports');
  };
  await Promise.all([compileTypescript(), generateImports()]);
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

export async function cleanup(options) {}

export const docs = `
Usage: build [options]

Options:
  --no-gen-imports    Do not generate imports (for HTML/CSS)
  --no-tsc            Do not compile TypeScript
  --no-min-bundle     Do not generate minified bundle

Examples:
  $ pnpm scripts build`;
