import type { Preview } from '@storybook/react-vite'
// eslint-disable-next-line antfu/no-import-dist
import '../dist/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
