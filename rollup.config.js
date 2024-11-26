import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  input: path.resolve(__dirname, 'exports.js'),
  output: {
    file: path.resolve(__dirname, 'dist', 'material-me.min.js'),
    name: 'material-me',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    string({
      include: '**/*.css',
    }),
    babel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, 'babel.config.json'),
    }),
    terser(),
  ],
});
