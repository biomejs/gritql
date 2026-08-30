import {defineConfig} from 'eslint/config';
import next from 'eslint-config-next';
import markdownlint from 'eslint-plugin-markdownlint';
import markdownlintParser from 'eslint-plugin-markdownlint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import {readdirSync} from 'node:fs';
import tseslint from 'typescript-eslint';

const directories = readdirSync('src', {withFileTypes: true})
  .filter((dir) => dir.isDirectory())
  .map((dir) => dir.name)
  .join('|');

export default defineConfig([
  next,
  tseslint.configs.base,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: '19',
      },
      next: {
        rootDir: 'src',
      },
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // React always comes first, if present.
            ['^react$'],
            // NPM packages
            [`^@?(?!getgrit|${directories})\\w`],
            // Absolute imports.
            ['^'],
            // Relative imports.
            ['^\\.'],
            // CSS imports.
            ['\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      complexity: ['error', 10],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^(_|unused)',
          varsIgnorePattern: '^(_|unused|React)',
        },
      ],
    }
  },
  {
    files: ['*.mdoc', '*.mdx', '*.md'],
    plugins: {
      markdownlint,
    },
    languageOptions: {
      parser: markdownlintParser,
    },
    rules: {},
  },
]);
