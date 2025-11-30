import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu'

const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Dev Platform
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Build and manage your APIs with ease
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/docs"
                  >
                    <div className="text-sm font-medium leading-none">
                      Documentation
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn how to use our platform effectively
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/tutorials"
                  >
                    <div className="text-sm font-medium leading-none">
                      Tutorials
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Step-by-step guides for common tasks
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/button"
                  >
                    <div className="text-sm font-medium leading-none">
                      Button
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Clickable button component with variants
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/input"
                  >
                    <div className="text-sm font-medium leading-none">
                      Input
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Text input field for forms
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/dialog"
                  >
                    <div className="text-sm font-medium leading-none">
                      Dialog
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Modal dialog for important actions
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/components/table"
                  >
                    <div className="text-sm font-medium leading-none">
                      Table
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Display data in rows and columns
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/pricing"
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const WithSubmenu: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/products/api-gateway"
                  >
                    <div className="text-sm font-medium leading-none">
                      API Gateway
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Manage and route your API requests
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/products/mock-server"
                  >
                    <div className="text-sm font-medium leading-none">
                      Mock Server
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Create mock responses for testing
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/products/analytics"
                  >
                    <div className="text-sm font-medium leading-none">
                      Analytics
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Track and visualize API metrics
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/about"
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const MegaMenu: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-3">
              <li>
                <div className="mb-2 text-sm font-semibold">Documentation</div>
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/docs/getting-started"
                      >
                        Getting Started
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/docs/api-reference"
                      >
                        API Reference
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/docs/examples"
                      >
                        Examples
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </li>
              <li>
                <div className="mb-2 text-sm font-semibold">Support</div>
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/support/contact"
                      >
                        Contact Us
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/support/faq"
                      >
                        FAQ
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/support/community"
                      >
                        Community
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </li>
              <li>
                <div className="mb-2 text-sm font-semibold">Company</div>
                <ul className="space-y-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/company/about"
                      >
                        About Us
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/company/careers"
                      >
                        Careers
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        href="/company/blog"
                      >
                        Blog
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const Vertical: Story = {
  render: () => (
    <NavigationMenu orientation="vertical" className="w-full max-w-xs">
      <NavigationMenuList className="flex-col space-x-0 space-y-1">
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle + ' w-full justify-start'}
            href="/dashboard"
          >
            Dashboard
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle + ' w-full justify-start'}
            href="/workspaces"
          >
            Workspaces
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle + ' w-full justify-start'}
            href="/apis"
          >
            APIs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle + ' w-full justify-start'}
            href="/settings"
          >
            Settings
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/home"
          >
            <span className="mr-2">🏠</span> Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span className="mr-2">📚</span> Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    href="/features/mock"
                  >
                    <div className="text-sm font-medium leading-none">
                      <span className="mr-2">🎭</span> Mock Server
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Create realistic API mocks
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    href="/features/analytics"
                  >
                    <div className="text-sm font-medium leading-none">
                      <span className="mr-2">📊</span> Analytics
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Visualize your API metrics
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/contact"
          >
            <span className="mr-2">✉️</span> Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const ActiveStates: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/home"
            data-active
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/about"
          >
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/contact"
          >
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const Disabled: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle}
            href="/home"
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger disabled>Coming Soon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <li className="p-3 text-sm text-muted-foreground">
                This feature is not yet available
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={
              navigationMenuTriggerStyle + ' pointer-events-none opacity-50'
            }
            href="/disabled"
          >
            Disabled Link
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const CustomStyling: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-blue-500 text-white hover:bg-blue-600 data-[state=open]:bg-blue-600">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md bg-blue-50 p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-100"
                    href="/product-1"
                  >
                    <div className="text-sm font-medium leading-none text-blue-900">
                      Product 1
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-blue-700">
                      Custom styled item
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className="inline-flex h-9 w-max items-center justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            href="/custom"
          >
            Custom Style
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}

export const Mobile: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex-col space-x-0 space-y-1 md:flex-row md:space-x-1 md:space-y-0">
          <NavigationMenuItem className="w-full md:w-auto">
            <NavigationMenuTrigger className="w-full justify-between md:w-auto md:justify-center">
              Menu
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-full gap-3 p-4 md:w-[300px]">
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      href="/item-1"
                    >
                      <div className="text-sm font-medium leading-none">
                        Item 1
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      href="/item-2"
                    >
                      <div className="text-sm font-medium leading-none">
                        Item 2
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full md:w-auto">
            <NavigationMenuLink
              className={
                navigationMenuTriggerStyle +
                ' w-full justify-start md:w-auto md:justify-center'
              }
              href="/about"
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
}

export const InHeader: Story = {
  render: () => (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-bold">Logo</div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          href="/solutions/enterprise"
                        >
                          <div className="text-sm font-medium leading-none">
                            Enterprise
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            For large organizations
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          href="/solutions/startup"
                        >
                          <div className="text-sm font-medium leading-none">
                            Startup
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            For growing teams
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle}
                  href="/pricing"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle}
                  href="/docs"
                >
                  Docs
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-2">
          <button className="rounded-md px-4 py-2 text-sm">Sign In</button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  ),
}
