import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
      ],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
}

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
}

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const WithDifferentContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Simple</Badge>
      <Badge>
        <span className="mr-1">🎉</span>
        With Emoji
      </Badge>
      <Badge>
        <span className="mr-1">●</span>
        Online
      </Badge>
      <Badge variant="destructive">
        <span className="mr-1">✕</span>
        Error
      </Badge>
      <Badge variant="success">
        <span className="mr-1">✓</span>
        Verified
      </Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="text-[10px] px-1.5 py-0">Tiny</Badge>
      <Badge className="text-xs">Small</Badge>
      <Badge className="text-sm px-3 py-1">Medium</Badge>
      <Badge className="text-base px-4 py-1.5">Large</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">User Status:</span>
        <Badge variant="success">Active</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Payment:</span>
        <Badge variant="warning">Pending</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Subscription:</span>
        <Badge variant="destructive">Expired</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Account:</span>
        <Badge variant="info">Trial</Badge>
      </div>
    </div>
  ),
}
