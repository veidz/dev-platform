import type React from 'react'
import { useState } from 'react'

import type { Meta } from '@storybook/react-vite'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable'

const meta = {
  title: 'UI/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

export const Horizontal = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Left Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Right Panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const Vertical = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="vertical" className="rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Top Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Bottom Panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const ThreePanels = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Main Content</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Inspector</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const WithMinMax = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <div className="flex h-full flex-col items-center justify-center p-6">
          <span className="font-semibold">Min: 20% | Max: 40%</span>
          <span className="mt-2 text-sm text-muted-foreground">
            Try resizing
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">No constraints</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export function Collapsible(): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="h-[600px] p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md border bg-background px-4 py-2 text-sm shadow-sm hover:bg-accent"
        >
          {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
        </button>
      </div>
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel
          defaultSize={25}
          minSize={0}
          collapsible
          collapsedSize={0}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
        >
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Collapsible Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Main Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export const Nested = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={15}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Editor</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Terminal</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const Persistent = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <div className="mb-4 rounded-md bg-muted p-3 text-sm">
      <p className="font-medium">Persistent layout:</p>
      <p className="text-muted-foreground">
        Resize panels, then refresh the page. Layout will persist via
        localStorage.
      </p>
    </div>
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border"
      autoSaveId="persistent-layout-demo"
    >
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel 1</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel 2</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel 3</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const CustomHandle = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Left</span>
        </div>
      </ResizablePanel>
      <ResizableHandle
        className="w-2 bg-linear-to-b from-blue-500 to-purple-500"
        withHandle
      />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Right</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const WithContent = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="flex h-full flex-col p-4">
          <h3 className="mb-4 text-lg font-semibold">Navigation</h3>
          <nav className="space-y-2">
            <a href="#" className="block rounded-md px-3 py-2 hover:bg-accent">
              Dashboard
            </a>
            <a href="#" className="block rounded-md px-3 py-2 hover:bg-accent">
              Projects
            </a>
            <a href="#" className="block rounded-md px-3 py-2 hover:bg-accent">
              Settings
            </a>
          </nav>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col p-6">
              <h2 className="mb-4 text-2xl font-bold">API Playground</h2>
              <div className="flex-1 rounded-lg bg-muted p-4">
                <code className="text-sm">
                  POST /api/users
                  <br />
                  Content-Type: application/json
                  <br />
                  <br />
                  {'{'}
                  <br />
                  &nbsp;&nbsp;"name": "John Doe",
                  <br />
                  &nbsp;&nbsp;"email": "john@example.com"
                  <br />
                  {'}'}
                </code>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full flex-col p-6">
              <h3 className="mb-2 text-lg font-semibold">Response</h3>
              <div className="flex-1 rounded-lg bg-green-50 p-4 dark:bg-green-950">
                <code className="text-sm">
                  Status: 201 Created
                  <br />
                  <br />
                  {'{'}
                  <br />
                  &nbsp;&nbsp;"id": "123",
                  <br />
                  &nbsp;&nbsp;"name": "John Doe"
                  <br />
                  {'}'}
                </code>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)

export const Responsive = (): React.JSX.Element => (
  <div className="h-[600px] p-4">
    <div className="mb-4 rounded-md bg-muted p-3 text-sm">
      <p className="font-medium">Responsive design:</p>
      <p className="text-muted-foreground">
        Resize your browser window to see panels adapt
      </p>
    </div>
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={30} minSize={20} className="hidden md:block">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Hidden on mobile</span>
        </div>
      </ResizablePanel>
      <ResizableHandle className="hidden md:flex" />
      <ResizablePanel>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Always visible</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
)
