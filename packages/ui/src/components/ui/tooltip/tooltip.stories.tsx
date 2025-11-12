import type { Meta, StoryObj } from '@storybook/react-vite'
import { Info, Plus, Settings, Trash2 } from 'lucide-react'

import { Button } from '../button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

const meta = {
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'UI/Tooltip',
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Positions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4 flex-col items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Top (default)</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip on top</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tooltip on bottom</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add new item</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Information</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete item</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const CustomDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={0}>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">No delay</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Instant tooltip</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const LongDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={1000}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for 1 second</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a 1 second delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const MultipleTooltips: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4 flex-wrap">
        {Array.from({ length: 6 }, (_, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Button variant="outline">Button {i + 1}</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tooltip for button {i + 1}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}

export const RichContent: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for details</Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">User Information</p>
            <p className="text-xs">
              Name: John Doe
              <br />
              Email: john@example.com
              <br />
              Role: Administrator
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const DisabledButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button variant="outline" disabled>
              Disabled button
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>This button is disabled</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const OnText: Story = {
  render: () => (
    <TooltipProvider>
      <p className="text-sm">
        Hover over{' '}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="underline decoration-dotted cursor-help">
              this text
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Additional information about this term</p>
          </TooltipContent>
        </Tooltip>{' '}
        to see more information.
      </p>
    </TooltipProvider>
  ),
}

export const CustomOffset: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Default offset</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>sideOffset = 4 (default)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Large offset</Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={20}>
            <p>sideOffset = 20</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
}
