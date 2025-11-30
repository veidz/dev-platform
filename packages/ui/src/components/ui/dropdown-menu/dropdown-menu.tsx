import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  HTMLAttributes,
  JSX,
} from 'react'
import { forwardRef } from 'react'

import {
  CheckboxItem as DropdownMenuCheckboxItemPrimitive,
  Content as DropdownMenuContentPrimitive,
  Group as DropdownMenuGroupPrimitive,
  Item as DropdownMenuItemPrimitive,
  ItemIndicator as DropdownMenuItemIndicatorPrimitive,
  Label as DropdownMenuLabelPrimitive,
  Portal as DropdownMenuPortalPrimitive,
  RadioGroup as DropdownMenuRadioGroupPrimitive,
  RadioItem as DropdownMenuRadioItemPrimitive,
  Root as DropdownMenuRootPrimitive,
  Separator as DropdownMenuSeparatorPrimitive,
  Sub as DropdownMenuSubPrimitive,
  SubContent as DropdownMenuSubContentPrimitive,
  SubTrigger as DropdownMenuSubTriggerPrimitive,
  Trigger as DropdownMenuTriggerPrimitive,
} from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'

const DropdownMenu = DropdownMenuRootPrimitive

const DropdownMenuTrigger = DropdownMenuTriggerPrimitive

const DropdownMenuGroup = DropdownMenuGroupPrimitive

const DropdownMenuPortal = DropdownMenuPortalPrimitive

const DropdownMenuSub = DropdownMenuSubPrimitive

const DropdownMenuRadioGroup = DropdownMenuRadioGroupPrimitive

const DropdownMenuSubTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuSubTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuSubTriggerPrimitive> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuSubTriggerPrimitive
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-auto"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </DropdownMenuSubTriggerPrimitive>
))
DropdownMenuSubTrigger.displayName = DropdownMenuSubTriggerPrimitive.displayName

const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof DropdownMenuSubContentPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuSubContentPrimitive>
>(({ className, ...props }, ref) => (
  <DropdownMenuSubContentPrimitive
    ref={ref}
    className={cn(
      'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuSubContentPrimitive.displayName

const DropdownMenuContent = forwardRef<
  ComponentRef<typeof DropdownMenuContentPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPortalPrimitive>
    <DropdownMenuContentPrimitive
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenuPortalPrimitive>
))
DropdownMenuContent.displayName = DropdownMenuContentPrimitive.displayName

const DropdownMenuItem = forwardRef<
  ComponentRef<typeof DropdownMenuItemPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuItemPrimitive> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuItemPrimitive
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuItemPrimitive.displayName

const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof DropdownMenuCheckboxItemPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItemPrimitive>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuCheckboxItemPrimitive
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicatorPrimitive>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </DropdownMenuItemIndicatorPrimitive>
    </span>
    {children}
  </DropdownMenuCheckboxItemPrimitive>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuCheckboxItemPrimitive.displayName

const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof DropdownMenuRadioItemPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuRadioItemPrimitive>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuRadioItemPrimitive
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicatorPrimitive>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
        </svg>
      </DropdownMenuItemIndicatorPrimitive>
    </span>
    {children}
  </DropdownMenuRadioItemPrimitive>
))
DropdownMenuRadioItem.displayName = DropdownMenuRadioItemPrimitive.displayName

const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof DropdownMenuLabelPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuLabelPrimitive> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuLabelPrimitive
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuLabelPrimitive.displayName

const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuSeparatorPrimitive>,
  ComponentPropsWithoutRef<typeof DropdownMenuSeparatorPrimitive>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparatorPrimitive
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuSeparatorPrimitive.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>): JSX.Element => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
