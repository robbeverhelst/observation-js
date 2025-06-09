import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      'examples',
      'tests',
      'bun.lockb',
      '.github',
      '.releaserc.json',
      'CHANGELOG.md',
      'README.md',
      'typedoc.json',
      'tsconfig.json',
      'package.json',
      'prettierrc.cjs'
    ],
  }
); 