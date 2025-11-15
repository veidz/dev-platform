import {
  BarChartIcon,
  CalendarIcon,
  CodeIcon,
  ExitIcon,
  FileTextIcon,
  GearIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  ReaderIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command'

const meta = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <PersonIcon />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <MagnifyingGlassIcon />
              <span>Search</span>
            </CommandItem>
            <CommandItem>
              <FileTextIcon />
              <span>New File</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <GearIcon />
              <span>Preferences</span>
            </CommandItem>
            <CommandItem>
              <PersonIcon />
              <span>Profile</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>
              <FileTextIcon />
              <span>New Document</span>
            </CommandItem>
            <CommandItem>
              <ReaderIcon />
              <span>Open Documentation</span>
            </CommandItem>
            <CommandItem>
              <CodeIcon />
              <span>View Source</span>
            </CommandItem>
            <CommandItem>
              <BarChartIcon />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon />
              <span>Deploy</span>
            </CommandItem>
            <CommandItem>
              <ExitIcon />
              <span>Sign Out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>
            <div className="flex items-center justify-center p-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-foreground" />
              <span className="ml-2 text-sm">Loading...</span>
            </div>
          </CommandEmpty>
        </CommandList>
      </Command>
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." defaultValue="xyz123" />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center p-4">
              <MagnifyingGlassIcon className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs text-muted-foreground">
                Try searching for something else
              </p>
            </div>
          </CommandEmpty>
        </CommandList>
      </Command>
    </div>
  ),
}

export const WithShortcuts: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="File">
            <CommandItem>
              <FileTextIcon />
              <span>New File</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileTextIcon />
              <span>Open File</span>
              <CommandShortcut>⌘O</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <FileTextIcon />
              <span>Save</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Edit">
            <CommandItem>
              <span>Copy</span>
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Paste</span>
              <CommandShortcut>⌘V</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Undo</span>
              <CommandShortcut>⌘Z</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const Nested: Story = {
  render: () => {
    const [pages, setPages] = useState<string[]>(['home'])

    function pushPage(page: string): void {
      setPages([...pages, page])
    }

    function popPage(): void {
      setPages((p) => p.slice(0, -1))
    }

    const activePage = pages[pages.length - 1]

    return (
      <div className="w-[450px]">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {activePage === 'home' && (
              <>
                <CommandGroup heading="Main">
                  <CommandItem onSelect={() => pushPage('settings')}>
                    <GearIcon />
                    <span>Settings</span>
                  </CommandItem>
                  <CommandItem onSelect={() => pushPage('profile')}>
                    <PersonIcon />
                    <span>Profile</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            {activePage === 'settings' && (
              <>
                <CommandGroup heading="Settings">
                  <CommandItem onSelect={() => popPage()}>
                    <span>← Back</span>
                  </CommandItem>
                  <CommandItem>
                    <span>General</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Security</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Privacy</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            {activePage === 'profile' && (
              <>
                <CommandGroup heading="Profile">
                  <CommandItem onSelect={() => popPage()}>
                    <span>← Back</span>
                  </CommandItem>
                  <CommandItem>
                    <span>View Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Edit Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <span>Change Avatar</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </div>
    )
  },
}

export const Filtered: Story = {
  render: () => {
    const [search, setSearch] = useState('')

    return (
      <div className="w-[450px]">
        <Command
          className="rounded-lg border shadow-md"
          filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1
            return 0
          }}
        >
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="APIs">
              <CommandItem value="users-api">Users API</CommandItem>
              <CommandItem value="products-api">Products API</CommandItem>
              <CommandItem value="orders-api">Orders API</CommandItem>
              <CommandItem value="payments-api">Payments API</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Endpoints">
              <CommandItem value="get-users">GET /users</CommandItem>
              <CommandItem value="post-users">POST /users</CommandItem>
              <CommandItem value="get-products">GET /products</CommandItem>
              <CommandItem value="post-orders">POST /orders</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        {search && (
          <p className="mt-2 text-xs text-muted-foreground">
            Searching for: {search}
          </p>
        )}
      </div>
    )
  },
}

export const WithFooter: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Commands">
            <CommandItem>
              <FileTextIcon />
              <span>New File</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearIcon />
              <span>Settings</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Press ⌘K to open</span>
            <span>ESC to close</span>
          </div>
        </div>
      </Command>
    </div>
  ),
}

export const CustomStyling: Story = {
  render: () => (
    <div className="w-[450px]">
      <Command className="rounded-2xl border-2 border-purple-500 bg-linear-to-b from-purple-50 to-white shadow-xl dark:from-purple-950 dark:to-background">
        <CommandInput
          placeholder="Search magic..."
          className="text-purple-600 placeholder:text-purple-400"
        />
        <CommandList>
          <CommandEmpty className="text-purple-600">
            No spells found.
          </CommandEmpty>
          <CommandGroup heading="Spells">
            <CommandItem className="data-[selected=true]:bg-purple-100 dark:data-[selected=true]:bg-purple-900">
              <RocketIcon />
              <span>Levitation</span>
              <CommandShortcut className="text-purple-500">✨</CommandShortcut>
            </CommandItem>
            <CommandItem className="data-[selected=true]:bg-purple-100 dark:data-[selected=true]:bg-purple-900">
              <RocketIcon />
              <span>Invisibility</span>
              <CommandShortcut className="text-purple-500">🌟</CommandShortcut>
            </CommandItem>
            <CommandItem className="data-[selected=true]:bg-purple-100 dark:data-[selected=true]:bg-purple-900">
              <RocketIcon />
              <span>Teleportation</span>
              <CommandShortcut className="text-purple-500">⚡</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

export const Dialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border bg-background px-4 py-2 text-sm shadow-sm hover:bg-accent"
        >
          Open Command ⌘K
        </button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => setOpen(false)}>
                <CalendarIcon />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <PersonIcon />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <RocketIcon />
                <span>Launch</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem onSelect={() => setOpen(false)}>
                <GearIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <GearIcon />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
}
