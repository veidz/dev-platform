import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from './separator'

const meta = {
  args: {
    decorative: true,
    orientation: 'horizontal',
  },
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'UI/Separator',
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <p className="text-sm">Section 1</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm">Section 2</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm">Section 3</p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div className="text-sm">Item 1</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 2</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 3</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 4</div>
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences
        </p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control your privacy options
        </p>
      </div>
    </div>
  ),
}

export const InCard: Story = {
  render: () => (
    <div className="w-96 rounded-lg border p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <p className="text-sm text-muted-foreground">
          Add a new payment method to your account
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Credit Card</span>
          <span className="text-sm text-muted-foreground">•••• 4242</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm">PayPal</span>
          <span className="text-sm text-muted-foreground">
            user@example.com
          </span>
        </div>
      </div>
    </div>
  ),
}

export const Decorative: Story = {
  args: {
    decorative: true,
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <p className="text-sm">This is a decorative separator (not announced)</p>
      <Separator {...args} />
      <p className="text-sm">Content below separator</p>
    </div>
  ),
}

export const Semantic: Story = {
  args: {
    decorative: false,
  },
  render: (args) => (
    <div className="w-80 space-y-4">
      <p className="text-sm">This is a semantic separator (announced to AT)</p>
      <Separator {...args} />
      <p className="text-sm">Content in different section</p>
    </div>
  ),
}

export const CustomStyles: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div>
        <p className="mb-2 text-sm">Thick separator</p>
        <Separator className="h-1 bg-primary" />
      </div>
      <div>
        <p className="mb-2 text-sm">Dashed separator</p>
        <Separator className="border-t border-dashed border-border bg-transparent" />
      </div>
      <div>
        <p className="mb-2 text-sm">Gradient separator</p>
        <Separator className="h-0.5 bg-linear-to-r from-transparent via-primary to-transparent" />
      </div>
      <div>
        <p className="mb-2 text-sm">Custom color</p>
        <Separator className="bg-red-500" />
      </div>
    </div>
  ),
}

export const DifferentSpacing: Story = {
  render: () => (
    <div className="w-80 space-y-8">
      <div>
        <p className="text-sm">Tight spacing</p>
        <Separator className="my-2" />
        <p className="text-sm">Content</p>
      </div>
      <div>
        <p className="text-sm">Normal spacing</p>
        <Separator className="my-4" />
        <p className="text-sm">Content</p>
      </div>
      <div>
        <p className="text-sm">Wide spacing</p>
        <Separator className="my-8" />
        <p className="text-sm">Content</p>
      </div>
    </div>
  ),
}

export const InList: Story = {
  render: () => (
    <div className="w-80 rounded-lg border">
      <div className="p-4">
        <p className="text-sm font-medium">Item 1</p>
        <p className="text-xs text-muted-foreground">Description for item 1</p>
      </div>
      <Separator />
      <div className="p-4">
        <p className="text-sm font-medium">Item 2</p>
        <p className="text-xs text-muted-foreground">Description for item 2</p>
      </div>
      <Separator />
      <div className="p-4">
        <p className="text-sm font-medium">Item 3</p>
        <p className="text-xs text-muted-foreground">Description for item 3</p>
      </div>
    </div>
  ),
}
