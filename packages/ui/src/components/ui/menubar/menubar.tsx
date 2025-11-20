import { cn } from '@/lib/utils'
import {
  CheckboxItem,
  Content,
  Group,
  Item,
  ItemIndicator,
  Label,
  Menu,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from '@radix-ui/react-menubar'
import { Check, ChevronRight, Circle } from 'lucide-react'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react'

const MenubarMenu: typeof Menu = Menu

const Menubar = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      'flex h-10 items-center space-x-1 rounded-md border bg-background p-1',
      className,
    )}
    {...props}
  />
))
Menubar.displayName = Root.displayName

const MenubarTrigger = forwardRef<
  ComponentRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
  <Trigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      className,
    )}
    {...props}
  />
))
MenubarTrigger.displayName = Trigger.displayName

type MenubarSubTriggerProps = ComponentPropsWithoutRef<typeof SubTrigger> & {
  inset?: boolean
}

const MenubarSubTrigger = forwardRef<
  ComponentRef<typeof SubTrigger>,
  MenubarSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </SubTrigger>
))
MenubarSubTrigger.displayName = SubTrigger.displayName

type MenubarSubContentProps = ComponentPropsWithoutRef<typeof SubContent>

const MenubarSubContent = forwardRef<
  ComponentRef<typeof SubContent>,
  MenubarSubContentProps
>(({ className, ...props }, ref) => (
  <SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
MenubarSubContent.displayName = SubContent.displayName

type MenubarContentProps = ComponentPropsWithoutRef<typeof Content>

const MenubarContent = forwardRef<
  ComponentRef<typeof Content>,
  MenubarContentProps
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => (
    <Portal>
      <Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      />
    </Portal>
  ),
)
MenubarContent.displayName = Content.displayName

type MenubarItemProps = ComponentPropsWithoutRef<typeof Item> & {
  inset?: boolean
}

const MenubarItem = forwardRef<ComponentRef<typeof Item>, MenubarItemProps>(
  ({ className, inset, ...props }, ref) => (
    <Item
      ref={ref}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  ),
)
MenubarItem.displayName = Item.displayName

type MenubarCheckboxItemProps = ComponentPropsWithoutRef<typeof CheckboxItem>

const MenubarCheckboxItem = forwardRef<
  ComponentRef<typeof CheckboxItem>,
  MenubarCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
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
MenubarCheckboxItem.displayName = CheckboxItem.displayName

type MenubarRadioItemProps = ComponentPropsWithoutRef<typeof RadioItem>

const MenubarRadioItem = forwardRef<
  ComponentRef<typeof RadioItem>,
  MenubarRadioItemProps
>(({ className, children, ...props }, ref) => (
  <RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
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
MenubarRadioItem.displayName = RadioItem.displayName

type MenubarLabelProps = ComponentPropsWithoutRef<typeof Label> & {
  inset?: boolean
}

const MenubarLabel = forwardRef<ComponentRef<typeof Label>, MenubarLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <Label
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-sm font-semibold',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  ),
)
MenubarLabel.displayName = Label.displayName

type MenubarSeparatorProps = ComponentPropsWithoutRef<typeof Separator>

const MenubarSeparator = forwardRef<
  ComponentRef<typeof Separator>,
  MenubarSeparatorProps
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
MenubarSeparator.displayName = Separator.displayName

type MenubarShortcutProps = HTMLAttributes<HTMLSpanElement>

const MenubarShortcut = ({
  className,
  ...props
}: MenubarShortcutProps): React.JSX.Element => {
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
MenubarShortcut.displayName = 'MenubarShortcut'

const MenubarGroup = Group

const MenubarPortal = Portal

const MenubarSub = Sub

const MenubarRadioGroup = RadioGroup

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
export type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarRadioItemProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubContentProps,
  MenubarSubTriggerProps,
}
