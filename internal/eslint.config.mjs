import config from '@vi-space/eslint-config/library'

/** @type {import("eslint").Linter.Config} */
export default config.overrideRules({
  'ts/explicit-function-return-type': 'off',
})
