import path from 'node:path';
import child_process from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import html from 'rollup-plugin-html';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runTypescriptCompiler() {
  return {
    name: 'run-typescript-compiler',
    async buildStart() {
      console.log('\x1b[0;96m' + 'compiling \x1b[1;96mTypeScript\x1b[0;94m → \x1b[1;96mJavaScript\x1b[0;96m...\x1b[0m');
      child_process.execSync('npx tsc');
      console.log('\x1b[0;32m' + 'compiled \x1b[1;92mTypeScript\x1b[0;32m → \x1b[1;92mJavaScript\x1b[0m');
    },
  };
}

export default defineConfig({
  input: path.resolve(__dirname, 'exports.js'),
  output: {
    file: path.resolve(__dirname, 'dist', 'material-me.min.js'),
    name: 'material-me',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    runTypescriptCompiler(),
    string({
      include: '**/*.css',
    }),
    html({
      include: '**/*.html',
      htmlMinifierOptions: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    babel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, 'babel.config.json'),
    }),
    terser(),
  ],
});
