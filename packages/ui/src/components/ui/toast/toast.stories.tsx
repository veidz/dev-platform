import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'

import { toast, Toaster, useToast } from './index'

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

function ToastDemo(): React.JSX.Element {
  const { toast: showToast } = useToast()

  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          showToast({
            title: 'Scheduled: Catch up',
            description: 'Friday, February 10, 2023 at 5:57 PM',
          })
        }}
      >
        Show Toast
      </Button>
      <Toaster />
    </div>
  )
}

export const Default: Story = {
  render: () => <ToastDemo />,
}

function ToastWithAction(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
          })
        }}
      >
        Show Toast with Action
      </Button>
      <Toaster />
    </div>
  )
}

export const WithAction: Story = {
  render: () => <ToastWithAction />,
}

function DestructiveToast(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
          })
        }}
      >
        Show Destructive Toast
      </Button>
      <Toaster />
    </div>
  )
}

export const Destructive: Story = {
  render: () => <DestructiveToast />,
}

function SuccessToast(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          toast({
            variant: 'success',
            title: 'Success!',
            description: 'Your changes have been saved successfully.',
          })
        }}
      >
        Show Success Toast
      </Button>
      <Toaster />
    </div>
  )
}

export const Success: Story = {
  render: () => <SuccessToast />,
}

function InfoToast(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <Button
        variant="secondary"
        onClick={() => {
          toast({
            variant: 'info',
            title: 'Information',
            description: 'New updates are available for download.',
          })
        }}
      >
        Show Info Toast
      </Button>
      <Toaster />
    </div>
  )
}

export const Info: Story = {
  render: () => <InfoToast />,
}

function MultipleToasts(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            toast({
              variant: 'success',
              title: 'Success!',
              description: 'Your changes have been saved.',
            })
          }}
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            toast({
              variant: 'info',
              title: 'Info',
              description: 'New updates are available.',
            })
          }}
        >
          Info
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to save your changes.',
            })
          }}
        >
          Error
        </Button>
      </div>
      <Toaster />
    </div>
  )
}

export const Multiple: Story = {
  render: () => <MultipleToasts />,
}
