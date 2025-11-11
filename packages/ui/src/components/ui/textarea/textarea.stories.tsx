import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'This is a default value in the textarea.',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
}

export const WithError: Story = {
  args: {
    placeholder: 'This field has an error',
    error: true,
    defaultValue: 'Invalid content',
  },
}

export const WithRows: Story = {
  args: {
    placeholder: 'Textarea with custom rows',
    rows: 10,
  },
}

export const WithMaxLength: Story = {
  render: () => {
    const maxLength = 200
    const [value, setValue] = useState('')

    return (
      <div className="space-y-2">
        <Textarea
          placeholder="Type your message here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
        />
        <p className="text-sm text-muted-foreground text-right">
          {value.length}/{maxLength}
        </p>
      </div>
    )
  },
}

export const ReadOnly: Story = {
  args: {
    value: 'This textarea is read-only and cannot be edited.',
    readOnly: true,
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="message" className="text-sm font-medium">
        Your message
      </label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="bio" className="text-sm font-medium">
        Bio
      </label>
      <Textarea id="bio" placeholder="Tell us about yourself..." rows={5} />
      <p className="text-sm text-muted-foreground">
        Write a short bio about yourself. This will be visible on your profile.
      </p>
    </div>
  ),
}

export const WithErrorMessage: Story = {
  render: () => (
    <div className="space-y-2">
      <label htmlFor="description" className="text-sm font-medium">
        Description
      </label>
      <Textarea
        id="description"
        placeholder="Enter description..."
        error
        defaultValue="Too short"
      />
      <p className="text-sm text-destructive">
        Description must be at least 10 characters long.
      </p>
    </div>
  ),
}

export const InForm: Story = {
  render: () => (
    <form className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="john@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          rows={5}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Submit
      </button>
    </form>
  ),
}
