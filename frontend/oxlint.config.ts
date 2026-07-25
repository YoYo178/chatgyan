import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: ['dist'],

  env: {
    browser: true,
  },

  plugins: ['typescript', 'react'],

  rules: {
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
});
