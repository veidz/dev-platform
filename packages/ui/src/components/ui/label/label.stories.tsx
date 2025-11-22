import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '../input'

import { Label } from './label'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Label>Label Text</Label>,
}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="email@example.com" />
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email-form">Email</Label>
        <Input id="email-form" type="email" placeholder="email@example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      <Label htmlFor="disabled-input" className="peer-disabled:opacity-70">
        Disabled Field
      </Label>
      <Input id="disabled-input" disabled placeholder="This is disabled" />
    </div>
  ),
}
