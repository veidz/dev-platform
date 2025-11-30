import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  type HTMLAttributes,
} from 'react'

import {
  CheckboxItem,
  Content,
  Group,
  Item,
  ItemIndicator,
  Label,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from '@radix-ui/react-context-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

const ContextMenu = Root

const ContextMenuTrigger = Trigger

const ContextMenuGroup = Group

const ContextMenuPortal = Portal

const ContextMenuSub = Sub

const ContextMenuRadioGroup = RadioGroup

type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof SubTrigger
> & {
  inset?: boolean
}

const ContextMenuSubTrigger = forwardRef<
  ComponentRef<typeof SubTrigger>,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </SubTrigger>
))
ContextMenuSubTrigger.displayName = SubTrigger.displayName

type ContextMenuSubContentProps = ComponentPropsWithoutRef<typeof SubContent>

const ContextMenuSubContent = forwardRef<
  ComponentRef<typeof SubContent>,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = SubContent.displayName

type ContextMenuContentProps = ComponentPropsWithoutRef<typeof Content>

const ContextMenuContent = forwardRef<
  ComponentRef<typeof Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      className={cn(
        'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </Portal>
))
ContextMenuContent.displayName = Content.displayName

type ContextMenuItemProps = ComponentPropsWithoutRef<typeof Item> & {
  inset?: boolean
}

const ContextMenuItem = forwardRef<
  ComponentRef<typeof Item>,
  ContextMenuItemProps
>(({ className, inset, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
ContextMenuItem.displayName = Item.displayName

type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof CheckboxItem
>

const ContextMenuCheckboxItem = forwardRef<
  ComponentRef<typeof CheckboxItem>,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Check className="h-4 w-4" />
      </ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
))
ContextMenuCheckboxItem.displayName = CheckboxItem.displayName

type ContextMenuRadioItemProps = ComponentPropsWithoutRef<typeof RadioItem>

const ContextMenuRadioItem = forwardRef<
  ComponentRef<typeof RadioItem>,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ItemIndicator>
    </span>
    {children}
  </RadioItem>
))
ContextMenuRadioItem.displayName = RadioItem.displayName

type ContextMenuLabelProps = ComponentPropsWithoutRef<typeof Label> & {
  inset?: boolean
}

const ContextMenuLabel = forwardRef<
  ComponentRef<typeof Label>,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-foreground',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = Label.displayName

type ContextMenuSeparatorProps = ComponentPropsWithoutRef<typeof Separator>

const ContextMenuSeparator = forwardRef<
  ComponentRef<typeof Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = Separator.displayName

type ContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement>

const ContextMenuShortcut = ({
  className,
  ...props
}: ContextMenuShortcutProps): React.JSX.Element => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
export type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuRadioItemProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubTriggerProps,
}
