import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: ['dist/', 'node_modules/'],
  categories: {
    correctness: 'warn',
  },
  rules: {
    'eslint/no-console': 'warn',
    'eslint/prefer-const': 'warn',

    'eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
});
