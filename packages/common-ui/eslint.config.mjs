// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import config from '@vi-space/eslint-config/react'

/** @type {import("eslint").Linter.Config} */
export default config.append([
  {
    files: ['./src/ui/**/*'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-dom/no-missing-button-type': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react/no-unstable-context-value': 'off',
    },
  },
  {
    plugins: [storybook]
  }
])
