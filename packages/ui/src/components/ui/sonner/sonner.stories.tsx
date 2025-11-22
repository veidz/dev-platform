import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Button } from '../button/button'

import { Toaster } from './sonner'

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast('Event has been created', {
            description: 'Monday, January 3rd at 6:00pm',
          })
        }
      >
        Show Toast
      </Button>
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster />
      <Button onClick={() => toast('Default toast')}>Default</Button>
      <Button onClick={() => toast.success('Success toast')}>Success</Button>
      <Button onClick={() => toast.error('Error toast')}>Error</Button>
      <Button onClick={() => toast.warning('Warning toast')}>Warning</Button>
      <Button onClick={() => toast.info('Info toast')}>Info</Button>
      <Button onClick={() => toast.loading('Loading...')}>Loading</Button>
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast('Event has been created', {
            action: {
              label: 'Undo',
              onClick: () => toast('Undo clicked'),
            },
          })
        }
      >
        Show Toast with Action
      </Button>
    </div>
  ),
}

export const WithPromise: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() => {
          const promise = (): Promise<{ name: string }> =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: 'Sonner' }), 2000),
            )

          toast.promise(promise, {
            loading: 'Loading...',
            success: (data) => `${data.name} toast has been added`,
            error: 'Error',
          })
        }}
      >
        Show Promise Toast
      </Button>
    </div>
  ),
}

export const WithCancel: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast('Event has been created', {
            cancel: {
              label: 'Cancel',
              onClick: () => toast('Cancelled'),
            },
          })
        }
      >
        Show Toast with Cancel
      </Button>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster position="top-left" />
      <Button
        onClick={() => toast('Top Left', { position: 'top-left' })}
        variant="outline"
      >
        Top Left
      </Button>
      <Button
        onClick={() => toast('Top Center', { position: 'top-center' })}
        variant="outline"
      >
        Top Center
      </Button>
      <Button
        onClick={() => toast('Top Right', { position: 'top-right' })}
        variant="outline"
      >
        Top Right
      </Button>
      <Button
        onClick={() => toast('Bottom Left', { position: 'bottom-left' })}
        variant="outline"
      >
        Bottom Left
      </Button>
      <Button
        onClick={() => toast('Bottom Center', { position: 'bottom-center' })}
        variant="outline"
      >
        Bottom Center
      </Button>
      <Button
        onClick={() => toast('Bottom Right', { position: 'bottom-right' })}
        variant="outline"
      >
        Bottom Right
      </Button>
    </div>
  ),
}

export const Duration: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster />
      <Button
        onClick={() =>
          toast('This toast will close in 1 second', { duration: 1000 })
        }
      >
        1 Second
      </Button>
      <Button
        onClick={() =>
          toast('This toast will close in 5 seconds', { duration: 5000 })
        }
      >
        5 Seconds
      </Button>
      <Button
        onClick={() =>
          toast('This toast will stay forever', { duration: Infinity })
        }
      >
        Infinity
      </Button>
    </div>
  ),
}

export const RichContent: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast(
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Event Created</h3>
              <p className="text-sm">
                Your event has been scheduled successfully.
              </p>
              <div className="flex gap-2">
                <button className="text-xs underline">View Details</button>
                <button className="text-xs underline">Share</button>
              </div>
            </div>,
          )
        }
      >
        Show Rich Content
      </Button>
    </div>
  ),
}

export const Dismissible: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster />
      <Button onClick={() => toast('Can be dismissed', { dismissible: true })}>
        Dismissible (Default)
      </Button>
      <Button
        onClick={() => toast('Cannot be dismissed', { dismissible: false })}
      >
        Not Dismissible
      </Button>
    </div>
  ),
}

export const CustomStyling: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toaster />
      <Button
        onClick={() =>
          toast('Custom styled toast', {
            className: 'border-2 border-primary',
            style: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            },
          })
        }
      >
        Custom Border & Background
      </Button>
      <Button
        onClick={() =>
          toast.success('Large custom toast', {
            className: 'text-lg p-6',
          })
        }
      >
        Large Toast
      </Button>
    </div>
  ),
}
