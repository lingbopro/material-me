import { babel } from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { customImport } from 'rollup-plugin-custom-import';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const customImports = [
  customImport({
    include: ['**/*.html'],
    content: (id, original) => {
      return `export default ${JSON.stringify(original)};`;
    },
  }),
  customImport({
    include: ['**/*.css'],
    content: (id, original) => {
      return `export default ${JSON.stringify(original)};`;
    },
  }),
];

export const mainConfig = defineConfig({
  input: './src/main.ts',
  treeshake: false,
  plugins: [
    nodeResolve(),
    ...customImports,
    typescript(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
});

export default defineConfig([
  {
    output: [
      {
        dir: './dist',
        format: 'es',
        sourcemap: true,
        preserveModules: true,
      },
    ],
    ...mainConfig,
    external: [...Object.keys(pkg.dependencies || {})],
  },
  {
    output: [
      {
        file: './dist/material-me.min.js',
        name: 'MaterialMe',
        format: 'umd',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    ...mainConfig,
    plugins: [...mainConfig.plugins],
  },
]);
