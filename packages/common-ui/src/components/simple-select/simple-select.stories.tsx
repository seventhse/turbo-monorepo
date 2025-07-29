import type { Meta, StoryObj } from '@storybook/react-vite'

import { SimpleSelect } from './simple-select'

const meta = {
  component: SimpleSelect,
} satisfies Meta<typeof SimpleSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
  },
}
