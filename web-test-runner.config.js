import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  concurrency: 10,
  files: ['test/**/*.test.ts', 'test/**/*.test.js'],
  nodeResolve: true,
  preserveSymlinks: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
    playwrightLauncher({ product: 'firefox' }),
  ],
  plugins: [esbuildPlugin({ ts: true })],
};
