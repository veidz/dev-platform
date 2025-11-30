import type { Meta, StoryObj } from '@storybook/react-vite'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.com/image.png" alt="@user" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/vercel.png" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/nextjs.png" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+3</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="Small" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Medium" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="Large" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-24 w-24">
        <AvatarImage src="https://github.com/shadcn.png" alt="Extra Large" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const StatusIndicator: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Online" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/vercel.png" alt="Away" />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/nextjs.png" alt="Busy" />
          <AvatarFallback>BS</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
      </div>
      <div className="relative">
        <Avatar>
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-500 ring-2 ring-background" />
      </div>
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => (
    <div className="flex gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Verified" />
          <AvatarFallback>VF</AvatarFallback>
        </Avatar>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
          ✓
        </span>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/vercel.png" alt="Premium" />
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
          ★
        </span>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://github.com/nextjs.png" alt="Admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
          A
        </span>
      </div>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback className="animate-pulse">
        <div className="h-full w-full bg-muted-foreground/20" />
      </AvatarFallback>
    </Avatar>
  ),
}

export const Broken: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="" alt="Empty src" />
        <AvatarFallback>ES</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://broken-url.invalid/image.png" alt="Broken" />
        <AvatarFallback>BR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>NO</AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const CustomColors: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">RD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">GN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">BL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">PP</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-linear-to-br from-pink-500 to-purple-500 text-white">
          GR
        </AvatarFallback>
      </Avatar>
    </div>
  ),
}

export const InProfile: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-lg border p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">John Doe</h3>
          <p className="text-sm text-muted-foreground">john.doe@example.com</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium">Software Engineer</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Team</span>
          <span className="font-medium">Engineering</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Location</span>
          <span className="font-medium">San Francisco, CA</span>
        </div>
      </div>
    </div>
  ),
}
