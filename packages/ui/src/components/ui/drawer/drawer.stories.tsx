import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer/drawer'
import { Input } from '@/components/ui/input/input'
import { Label } from '@/components/ui/label/label'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a drawer component built with Vaul.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Swipe down or click outside to close.
          </p>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open Drawer</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close Drawer
          </Button>
        </div>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Controlled Drawer</DrawerTitle>
              <DrawerDescription>
                This drawer&apos;s state is controlled externally.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-sm">Open state: {open ? 'true' : 'false'}</p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    )
  },
}

export const NonDismissible: Story = {
  render: () => (
    <Drawer dismissible={false}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Non-Dismissible</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Non-Dismissible Drawer</DrawerTitle>
          <DrawerDescription>
            This drawer cannot be dismissed by clicking outside or swiping.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            You must click the close button to dismiss.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithoutHandle: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Without Handle</Button>
      </DrawerTrigger>
      <DrawerContent className="[&>div:first-child]:hidden">
        <DrawerHeader>
          <DrawerTitle>No Handle</DrawerTitle>
          <DrawerDescription>This drawer has no handle bar.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            The handle can be hidden with CSS.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const CustomHeight: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Full Height</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Full Height Drawer</DrawerTitle>
          <DrawerDescription>
            This drawer takes up most of the screen height.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="mb-4 text-sm">
              Content line {i + 1}. This demonstrates scrollable content within
              a tall drawer.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const Nested: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Outer Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Outer Drawer</DrawerTitle>
          <DrawerDescription>
            This drawer contains another drawer inside.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm">
                Open Inner Drawer
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Inner Drawer</DrawerTitle>
                <DrawerDescription>
                  This is a nested drawer component.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <p className="text-sm">Nested drawer content.</p>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button size="sm">Close Inner</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close Outer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const WithScrollableContent: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Scrollable</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Scrollable Content</DrawerTitle>
          <DrawerDescription>
            This drawer has scrollable content.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[400px] overflow-y-auto p-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="mb-2 rounded border p-3">
              <p className="font-medium">Item {i + 1}</p>
              <p className="text-sm text-muted-foreground">
                This is item number {i + 1} in the scrollable list.
              </p>
            </div>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const CustomStyling: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Custom Styled</Button>
      </DrawerTrigger>
      <DrawerContent className="border-2 border-primary">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-primary">Custom Styling</DrawerTitle>
          <DrawerDescription>
            This drawer has custom styling applied.
          </DrawerDescription>
        </DrawerHeader>
        <div className="bg-muted/50 p-4">
          <p className="text-sm">Custom background and borders.</p>
        </div>
        <DrawerFooter className="border-t">
          <Button>Primary Action</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}

export const MobileOptimized: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Mobile Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Mobile Optimized</DrawerTitle>
          <DrawerDescription>
            This drawer is optimized for mobile interactions.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-6">
          <div className="space-y-4">
            <Button className="w-full" size="lg">
              Primary Action
            </Button>
            <Button className="w-full" variant="outline" size="lg">
              Secondary Action
            </Button>
            <Button className="w-full" variant="ghost" size="lg">
              Tertiary Action
            </Button>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
