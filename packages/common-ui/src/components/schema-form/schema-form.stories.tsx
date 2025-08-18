import type { Meta, StoryObj } from '@storybook/react-vite'

import type { Schema } from '.'
import { SchemaForm } from '.'

const meta = {
  component: SchemaForm,
} satisfies Meta<typeof SchemaForm>

export default meta
type Story = StoryObj<typeof meta>

const basicSchema: Schema<{
  username: string
  password: string
  otherConfig: {
    demo: string
    name: string
  }
  demo: Array<{
    info: string
  }>
  test: {
    demo: string
  }
}> = {
  username: {
    control: 'input',
    label: 'Account',
    description: 'Your login account.',
  },
  password: {
    control: 'input',
    label: 'Password',
    description: 'Your login password.',
  },
  otherConfig: {
    type: 'object',
    children: {
      demo: {
        label: 'Object child',
        control: 'input',
      },
      name: {
        label: 'Object child2',
        control: 'input',
      },
    },
    create: {

    },
  },
  demo: {
    type: 'array',
    label: 'Demo array config',
    children: {
      info: {
        label: 'Info',
        control: 'input',
        edit: {
          label: 'Update Info',
        },
      },
    },
  },
  test: {
    type: 'object',
    children: {
      demo: {
        label: 'demo',
        control: 'input',
      },
    },
  },
}

export const Basic: Story = {
  args: {
    wrapperClass: 'w-[600px] mx-auto space-y-3',
    schema: basicSchema as Schema<any>,
  },
}
