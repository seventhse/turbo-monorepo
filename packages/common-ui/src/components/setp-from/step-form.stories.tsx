import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepForm } from '.'

const meta = {
  component: StepForm,
} satisfies Meta<typeof StepForm>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
  },
}
