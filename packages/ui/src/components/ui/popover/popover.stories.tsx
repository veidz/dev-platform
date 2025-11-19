import type { Meta } from '@storybook/react-vite'
import type React from 'react'
import { useState } from 'react'
import { Button } from '../button'
import { Input } from '../input'
import { Label } from '../label'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from './popover'

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

export const Default = (): React.JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const Controlled = (): React.JSX.Element => {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Open: {open ? 'true' : 'false'}
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">Toggle popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Controlled</h4>
            <p className="text-sm text-muted-foreground">
              This popover is controlled by state.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const SidePlacement = (): React.JSX.Element => {
  return (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <p className="text-sm">Positioned on top</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <p className="text-sm">Positioned on right</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <p className="text-sm">Positioned on bottom</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <p className="text-sm">Positioned on left</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const AlignVariants = (): React.JSX.Element => {
  return (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Start</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Aligned to start</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Center</Button>
        </PopoverTrigger>
        <PopoverContent align="center">
          <p className="text-sm">Aligned to center</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">End</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm">Aligned to end</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const WithOffset = (): React.JSX.Element => {
  return (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">No offset</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={0}>
          <p className="text-sm">No offset from trigger</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Default offset</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">Default offset (4px)</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Large offset</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={20}>
          <p className="text-sm">20px offset from trigger</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const Modal = (): React.JSX.Element => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="outline">Open modal popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Modal Popover</h4>
          <p className="text-sm text-muted-foreground">
            Clicking outside will close this popover and restore focus.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const WithForm = (): React.JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure your preferences.
            </p>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const CustomStyling = (): React.JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Custom styling</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 border-2 border-primary bg-primary/5">
        <div className="space-y-2">
          <h4 className="font-bold text-primary">Custom Styled Popover</h4>
          <p className="text-sm">
            This popover has custom border and background styling.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const WithAnchor = (): React.JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Popover>
        <PopoverAnchor asChild>
          <div className="rounded-md border-2 border-dashed border-muted-foreground p-4">
            <p className="text-sm text-muted-foreground">Anchor element</p>
          </div>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <Button variant="outline">Open (anchored to box above)</Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-sm">
            This popover is positioned relative to the anchor element.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const Nested = (): React.JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open first popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">First Level</h4>
          <p className="text-sm text-muted-foreground">
            You can nest popovers inside each other.
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Open nested popover
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Nested Popover</h4>
                <p className="text-sm text-muted-foreground">
                  This is a nested popover.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </PopoverContent>
    </Popover>
  )
}
