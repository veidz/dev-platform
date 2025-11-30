import type { Meta, StoryObj } from '@storybook/react-vite'
import { File, Home, Settings, User } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../card'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta = {
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'UI/Tabs',
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
}

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm text-muted-foreground">
          Overview of your dashboard and recent activity.
        </p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="text-sm text-muted-foreground">
          View detailed analytics and insights.
        </p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="text-sm text-muted-foreground">
          Access and generate reports.
        </p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="home" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Home
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="files" className="flex items-center gap-2">
          <File className="h-4 w-4" />
          Files
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <p className="text-sm">Home dashboard content</p>
      </TabsContent>
      <TabsContent value="profile">
        <p className="text-sm">User profile information</p>
      </TabsContent>
      <TabsContent value="files">
        <p className="text-sm">File management interface</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm">Application settings</p>
      </TabsContent>
    </Tabs>
  ),
}

export const InCard: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">General Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your general account settings and preferences.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Security Settings</h3>
              <p className="text-sm text-muted-foreground">
                Update your password and security preferences.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Enabled</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="tab3">Also Enabled</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        This tab is enabled and can be selected.
      </TabsContent>
      <TabsContent value="tab2">This content is not accessible.</TabsContent>
      <TabsContent value="tab3">
        This tab is also enabled and can be selected.
      </TabsContent>
    </Tabs>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">Tab One</TabsTrigger>
        <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        <TabsTrigger value="tab3">Tab Three</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        Content for tab one with full width layout.
      </TabsContent>
      <TabsContent value="tab2">
        Content for tab two with full width layout.
      </TabsContent>
      <TabsContent value="tab3">
        Content for tab three with full width layout.
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs
      defaultValue="tab1"
      orientation="vertical"
      className="flex w-[600px] gap-4"
    >
      <TabsList className="flex flex-col h-auto">
        <TabsTrigger value="tab1" className="w-full justify-start">
          Profile
        </TabsTrigger>
        <TabsTrigger value="tab2" className="w-full justify-start">
          Account
        </TabsTrigger>
        <TabsTrigger value="tab3" className="w-full justify-start">
          Privacy
        </TabsTrigger>
        <TabsTrigger value="tab4" className="w-full justify-start">
          Advanced
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="tab1">
          <h3 className="text-lg font-semibold">Profile Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your profile information and public visibility.
          </p>
        </TabsContent>
        <TabsContent value="tab2">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Update your account details and preferences.
          </p>
        </TabsContent>
        <TabsContent value="tab3">
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Control your privacy and data sharing options.
          </p>
        </TabsContent>
        <TabsContent value="tab4">
          <h3 className="text-lg font-semibold">Advanced Settings</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Configure advanced features and integrations.
          </p>
        </TabsContent>
      </div>
    </Tabs>
  ),
}

export const Compact: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="h-8">
        <TabsTrigger value="tab1" className="text-xs px-2 py-1">
          Small
        </TabsTrigger>
        <TabsTrigger value="tab2" className="text-xs px-2 py-1">
          Compact
        </TabsTrigger>
        <TabsTrigger value="tab3" className="text-xs px-2 py-1">
          Tabs
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="text-sm">
        Compact tab content
      </TabsContent>
      <TabsContent value="tab2" className="text-sm">
        Another compact tab
      </TabsContent>
      <TabsContent value="tab3" className="text-sm">
        Third compact tab
      </TabsContent>
    </Tabs>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="all" className="flex items-center gap-2">
          All
          <span className="ml-1 rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs">
            12
          </span>
        </TabsTrigger>
        <TabsTrigger value="active" className="flex items-center gap-2">
          Active
          <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
            5
          </span>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          Completed
          <span className="ml-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs">
            7
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <p className="text-sm text-muted-foreground">All 12 items</p>
      </TabsContent>
      <TabsContent value="active">
        <p className="text-sm text-muted-foreground">5 active items</p>
      </TabsContent>
      <TabsContent value="completed">
        <p className="text-sm text-muted-foreground">7 completed items</p>
      </TabsContent>
    </Tabs>
  ),
}

export const RichContent: Story = {
  render: () => (
    <Tabs defaultValue="preview" className="w-[700px]">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="rounded-md border p-4">
        <Card>
          <CardHeader>
            <CardTitle>Preview Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is a rich preview with nested components.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="code" className="rounded-md border p-4 bg-muted">
        <pre className="text-xs">
          <code>{`<Card>
  <CardHeader>
    <CardTitle>Preview Mode</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This is a rich preview...</p>
  </CardContent>
</Card>`}</code>
        </pre>
      </TabsContent>
    </Tabs>
  ),
}
