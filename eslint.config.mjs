// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

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
      'unused-imports/no-unused-imports': 'error',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/no-default-export': 'off'
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx']
  }
]
