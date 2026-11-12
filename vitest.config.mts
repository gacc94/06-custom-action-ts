import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts'],
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'text-summary', 'html', 'lcov', 'json-summary', 'cobertura'],
            reportsDirectory: './coverage',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'dist/**', 'node_modules/**']
        }
    }
});
