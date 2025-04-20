import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import { customImport } from 'rollup-plugin-custom-import';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

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

export default defineConfig({
  input: './src/main.ts',
  output: [
    {
      dir: './dist',
      format: 'es',
      sourcemap: true,
      preserveModules: true,
    },
    {
      file: './dist/material-me.min.js',
      name: 'MaterialMe',
      format: 'umd',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [...customImports, typescript(), babel()],
});
