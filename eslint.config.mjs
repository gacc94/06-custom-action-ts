import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist/**', 'node_modules/**', 'coverage/**', 'docs/**', '*.log', 'pnpm-lock.yaml']),
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
    {
        name: 'Import Sorting',
        files: ['**/*.{js,mjs,cjs,ts,mts}'],
        plugins: {
            'simple-import-sort': simpleImportSort
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error'
        }
    },
    {
        files: ['**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/no-explicit-any': 'warn'
        }
    },
    {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        plugins: { vitest },
        rules: {
            ...vitest.configs.recommended.rules,
            'vitest/expect-expect': 'error',
            'vitest/no-disabled-tests': 'warn',
            'vitest/no-focused-tests': 'error'
        }
    }
]);
