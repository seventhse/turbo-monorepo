import config from '@vi-space/eslint-config/library'

/** @type {import("eslint").Linter.Config} */
export default config.append([
  {
    files: './src/index.ts',
    rules: {
      'style/eol-last': 'off',
    },
  },
])
