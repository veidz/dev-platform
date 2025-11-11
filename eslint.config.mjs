// @ts-check
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import storybook from 'eslint-plugin-storybook'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['node_modules', 'dist', '.turbo', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-console': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'simple-import-sort/imports': 'off',
      'simple-import-sort/exports': 'off',
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/tests/**/*.ts',
      '**/tests/**/*.tsx',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
]
