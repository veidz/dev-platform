import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup, RadioGroupItem } from './radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <label htmlFor="option-1" className="text-sm font-medium">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <label htmlFor="option-2" className="text-sm font-medium">
          Option 2
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <label htmlFor="option-3" className="text-sm font-medium">
          Option 3
        </label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="disabled-1" />
        <label htmlFor="disabled-1" className="text-sm font-medium">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="disabled-2" />
        <label htmlFor="disabled-2" className="text-sm font-medium">
          Option 2
        </label>
      </div>
    </RadioGroup>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="item-1" />
        <label htmlFor="item-1" className="text-sm font-medium">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="item-2" disabled />
        <label
          htmlFor="item-2"
          className="text-sm font-medium opacity-50 cursor-not-allowed"
        >
          Option 2 (Disabled)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="item-3" />
        <label htmlFor="item-3" className="text-sm font-medium">
          Option 3
        </label>
      </div>
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('option-1')

    return (
      <div className="space-y-2">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-1" id="controlled-1" />
            <label htmlFor="controlled-1" className="text-sm font-medium">
              Option 1
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-2" id="controlled-2" />
            <label htmlFor="controlled-2" className="text-sm font-medium">
              Option 2
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-3" id="controlled-3" />
            <label htmlFor="controlled-3" className="text-sm font-medium">
              Option 3
            </label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    )
  },
}

export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="comfortable" id="comfortable" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="comfortable"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Comfortable
          </label>
          <p className="text-sm text-muted-foreground">
            This is a comfortable spacing option.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="compact" id="compact" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="compact"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Compact
          </label>
          <p className="text-sm text-muted-foreground">
            This is a compact spacing option.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const HorizontalLayout: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="horizontal-1" />
        <label htmlFor="horizontal-1" className="text-sm font-medium">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="horizontal-2" />
        <label htmlFor="horizontal-2" className="text-sm font-medium">
          Option 2
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="horizontal-3" />
        <label htmlFor="horizontal-3" className="text-sm font-medium">
          Option 3
        </label>
      </div>
    </RadioGroup>
  ),
}

export const InForm: Story = {
  render: () => (
    <form className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <label className="text-sm font-medium">Notification Preferences</label>
        <RadioGroup defaultValue="all" name="notifications">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="notify-all" />
            <label htmlFor="notify-all" className="text-sm">
              All new messages
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mentions" id="notify-mentions" />
            <label htmlFor="notify-mentions" className="text-sm">
              Direct messages and mentions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="notify-none" />
            <label htmlFor="notify-none" className="text-sm">
              Nothing
            </label>
          </div>
        </RadioGroup>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Save preferences
      </button>
    </form>
  ),
}

export const WithCards: Story = {
  render: () => (
    <RadioGroup defaultValue="free" className="space-y-3">
      <div className="flex items-start space-x-3 rounded-lg border p-4">
        <RadioGroupItem value="free" id="plan-free" className="mt-1" />
        <div className="grid gap-1.5 leading-none flex-1">
          <label
            htmlFor="plan-free"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Free Plan
          </label>
          <p className="text-sm text-muted-foreground">
            Perfect for personal projects and testing
          </p>
          <p className="text-sm font-semibold mt-2">$0/month</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 rounded-lg border p-4">
        <RadioGroupItem value="pro" id="plan-pro" className="mt-1" />
        <div className="grid gap-1.5 leading-none flex-1">
          <label
            htmlFor="plan-pro"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Pro Plan
          </label>
          <p className="text-sm text-muted-foreground">
            For professionals and small teams
          </p>
          <p className="text-sm font-semibold mt-2">$29/month</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 rounded-lg border p-4">
        <RadioGroupItem
          value="enterprise"
          id="plan-enterprise"
          className="mt-1"
        />
        <div className="grid gap-1.5 leading-none flex-1">
          <label
            htmlFor="plan-enterprise"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enterprise Plan
          </label>
          <p className="text-sm text-muted-foreground">
            For large organizations with advanced needs
          </p>
          <p className="text-sm font-semibold mt-2">Custom pricing</p>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const Required: Story = {
  render: () => (
    <form className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Choose your size <span className="text-destructive">*</span>
        </label>
        <RadioGroup required name="size">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="size-small" />
            <label htmlFor="size-small" className="text-sm">
              Small
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="size-medium" />
            <label htmlFor="size-medium" className="text-sm">
              Medium
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="size-large" />
            <label htmlFor="size-large" className="text-sm">
              Large
            </label>
          </div>
        </RadioGroup>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Continue
      </button>
    </form>
  ),
}
