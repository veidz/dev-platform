import {
  Content as SelectContentPrimitive,
  Group as SelectGroupPrimitive,
  Icon as SelectIconPrimitive,
  ItemIndicator as SelectItemIndicatorPrimitive,
  Item as SelectItemPrimitive,
  ItemText as SelectItemTextPrimitive,
  Label as SelectLabelPrimitive,
  Portal as SelectPortalPrimitive,
  Root as SelectRootPrimitive,
  ScrollDownButton as SelectScrollDownButtonPrimitive,
  ScrollUpButton as SelectScrollUpButtonPrimitive,
  Separator as SelectSeparatorPrimitive,
  Trigger as SelectTriggerPrimitive,
  Value as SelectValuePrimitive,
  Viewport as SelectViewportPrimitive,
} from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type {
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactElement,
} from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

const Select = SelectRootPrimitive

const SelectGroup = SelectGroupPrimitive

const SelectValue = SelectValuePrimitive

const SelectTrigger = forwardRef<
  ComponentRef<typeof SelectTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof SelectTriggerPrimitive>
>(
  ({ className, children, ...props }, ref): ReactElement => (
    <SelectTriggerPrimitive
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <SelectIconPrimitive asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectIconPrimitive>
    </SelectTriggerPrimitive>
  ),
)
SelectTrigger.displayName = SelectTriggerPrimitive.displayName

const SelectScrollUpButton = forwardRef<
  ComponentRef<typeof SelectScrollUpButtonPrimitive>,
  ComponentPropsWithoutRef<typeof SelectScrollUpButtonPrimitive>
>(
  ({ className, ...props }, ref): ReactElement => (
    <SelectScrollUpButtonPrimitive
      ref={ref}
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectScrollUpButtonPrimitive>
  ),
)
SelectScrollUpButton.displayName = SelectScrollUpButtonPrimitive.displayName

const SelectScrollDownButton = forwardRef<
  ComponentRef<typeof SelectScrollDownButtonPrimitive>,
  ComponentPropsWithoutRef<typeof SelectScrollDownButtonPrimitive>
>(
  ({ className, ...props }, ref): ReactElement => (
    <SelectScrollDownButtonPrimitive
      ref={ref}
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectScrollDownButtonPrimitive>
  ),
)
SelectScrollDownButton.displayName = SelectScrollDownButtonPrimitive.displayName

const SelectContent = forwardRef<
  ComponentRef<typeof SelectContentPrimitive>,
  ComponentPropsWithoutRef<typeof SelectContentPrimitive>
>(
  (
    { className, children, position = 'popper', ...props },
    ref,
  ): ReactElement => (
    <SelectPortalPrimitive>
      <SelectContentPrimitive
        ref={ref}
        className={cn(
          'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectViewportPrimitive
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
          )}
        >
          {children}
        </SelectViewportPrimitive>
        <SelectScrollDownButton />
      </SelectContentPrimitive>
    </SelectPortalPrimitive>
  ),
)
SelectContent.displayName = SelectContentPrimitive.displayName

const SelectLabel = forwardRef<
  ComponentRef<typeof SelectLabelPrimitive>,
  ComponentPropsWithoutRef<typeof SelectLabelPrimitive>
>(
  ({ className, ...props }, ref): ReactElement => (
    <SelectLabelPrimitive
      ref={ref}
      className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
      {...props}
    />
  ),
)
SelectLabel.displayName = SelectLabelPrimitive.displayName

const SelectItem = forwardRef<
  ComponentRef<typeof SelectItemPrimitive>,
  ComponentPropsWithoutRef<typeof SelectItemPrimitive>
>(
  ({ className, children, ...props }, ref): ReactElement => (
    <SelectItemPrimitive
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectItemIndicatorPrimitive>
          <Check className="h-4 w-4" />
        </SelectItemIndicatorPrimitive>
      </span>

      <SelectItemTextPrimitive>{children}</SelectItemTextPrimitive>
    </SelectItemPrimitive>
  ),
)
SelectItem.displayName = SelectItemPrimitive.displayName

const SelectSeparator = forwardRef<
  ComponentRef<typeof SelectSeparatorPrimitive>,
  ComponentPropsWithoutRef<typeof SelectSeparatorPrimitive>
>(
  ({ className, ...props }, ref): ReactElement => (
    <SelectSeparatorPrimitive
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  ),
)
SelectSeparator.displayName = SelectSeparatorPrimitive.displayName

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
