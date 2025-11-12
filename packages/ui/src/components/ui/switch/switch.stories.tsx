import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => <Switch />,
}

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
}

export const Disabled: Story = {
  render: () => <Switch disabled />,
}

export const DisabledChecked: Story = {
  render: () => <Switch disabled checked />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Airplane Mode
      </label>
    </div>
  ),
}

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Switch id="marketing-emails" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="marketing-emails"
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
          <Switch
            id="controlled-switch"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <label
            htmlFor="controlled-switch"
            className="text-sm font-medium leading-none"
          >
            Controlled switch
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          Status: <strong>{checked ? 'On' : 'Off'}</strong>
        </p>
      </div>
    )
  },
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
        <label className="text-sm font-medium">Notification Settings</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" defaultChecked />
            <label htmlFor="email-notifications" className="text-sm">
              Email notifications
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="push-notifications" />
            <label htmlFor="push-notifications" className="text-sm">
              Push notifications
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="sms-notifications" />
            <label htmlFor="sms-notifications" className="text-sm">
              SMS notifications
            </label>
          </div>
        </div>
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

export const SettingsPanel: Story = {
  render: () => (
    <div className="w-[400px] space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="text-lg font-medium">Privacy Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your privacy and security preferences
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="profile-visible" className="text-sm font-medium">
              Public Profile
            </label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to everyone
            </p>
          </div>
          <Switch id="profile-visible" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="search-indexing" className="text-sm font-medium">
              Search Engine Indexing
            </label>
            <p className="text-sm text-muted-foreground">
              Allow search engines to index your profile
            </p>
          </div>
          <Switch id="search-indexing" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="analytics" className="text-sm font-medium">
              Analytics
            </label>
            <p className="text-sm text-muted-foreground">
              Help us improve by sharing anonymous usage data
            </p>
          </div>
          <Switch id="analytics" defaultChecked />
        </div>
      </div>
    </div>
  ),
}

export const WithCard: Story = {
  render: () => (
    <div className="space-y-3 w-[400px]">
      {['Feature 1', 'Feature 2', 'Feature 3'].map((feature) => (
        <div
          key={feature}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="space-y-0.5">
            <label
              htmlFor={feature}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {feature}
            </label>
            <p className="text-sm text-muted-foreground">
              Enable {feature.toLowerCase()} for your account
            </p>
          </div>
          <Switch id={feature} />
        </div>
      ))}
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <form className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Terms and Conditions <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <Switch id="terms" required />
          <label htmlFor="terms" className="text-sm">
            I agree to the terms and conditions
          </label>
        </div>
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
