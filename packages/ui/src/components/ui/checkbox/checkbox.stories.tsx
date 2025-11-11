import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => <Checkbox />,
}

export const Checked: Story = {
  render: () => <Checkbox defaultChecked />,
}

export const Disabled: Story = {
  render: () => <Checkbox disabled />,
}

export const DisabledChecked: Story = {
  render: () => <Checkbox disabled checked />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="marketing" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="marketing"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Marketing emails
        </label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={(value) => setChecked(!!value)}
          />
          <label
            htmlFor="controlled"
            className="text-sm font-medium leading-none"
          >
            Controlled checkbox
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          Checked: {checked ? 'Yes' : 'No'}
        </p>
      </div>
    )
  },
}

export const IndeterminateState: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = useState([true, false, false])

    const allChecked = checkedItems.every(Boolean)
    const isIndeterminate =
      checkedItems.some(Boolean) && !checkedItems.every(Boolean)

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all"
            checked={
              allChecked ? true : isIndeterminate ? 'indeterminate' : false
            }
            onCheckedChange={(checked) => {
              setCheckedItems([!!checked, !!checked, !!checked])
            }}
          />
          <label htmlFor="all" className="text-sm font-medium">
            Select all
          </label>
        </div>
        <div className="ml-6 space-y-2">
          {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={checkedItems[index]}
                onCheckedChange={(checked) => {
                  const newCheckedItems = [...checkedItems]
                  newCheckedItems[index] = !!checked
                  setCheckedItems(newCheckedItems)
                }}
              />
              <label htmlFor={item} className="text-sm">
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <p className="text-sm font-medium">Select your interests:</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-1" />
          <label htmlFor="interest-1" className="text-sm">
            Technology
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-2" />
          <label htmlFor="interest-2" className="text-sm">
            Design
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-3" />
          <label htmlFor="interest-3" className="text-sm">
            Marketing
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="interest-4" />
          <label htmlFor="interest-4" className="text-sm">
            Business
          </label>
        </div>
      </div>
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
        <div className="flex items-center space-x-2">
          <Checkbox id="newsletter" />
          <label htmlFor="newsletter" className="text-sm">
            Subscribe to newsletter
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms-form" />
          <label htmlFor="terms-form" className="text-sm">
            I agree to the terms and conditions
          </label>
        </div>
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

export const WithCard: Story = {
  render: () => (
    <div className="space-y-3">
      {['Option 1', 'Option 2', 'Option 3'].map((option) => (
        <div
          key={option}
          className="flex items-start space-x-3 rounded-lg border p-4"
        >
          <Checkbox id={option} className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </label>
            <p className="text-sm text-muted-foreground">
              Description for {option.toLowerCase()}
            </p>
          </div>
        </div>
      ))}
    </div>
  ),
}
