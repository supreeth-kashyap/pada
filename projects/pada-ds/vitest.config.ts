import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Component tests (jsdom). Script tests under scripts/ run with `node --test`.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
  },
});
