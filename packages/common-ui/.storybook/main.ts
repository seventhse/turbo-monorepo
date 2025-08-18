import type { StorybookConfig } from '@storybook/react-vite'

import { dirname, join, resolve } from 'node:path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../docs/**/*.@(mdx|tsx)',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    {
      directory: '../src/components',
      titlePrefix: 'Components',
    },
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...(config.resolve || {}),
        alias: {
          ...(config?.resolve?.alias || {}),
          '~': resolve(__dirname, '../src'),
        },
      },
      plugins: [...(config.plugins || [])],
    }
  },
}
export default config
