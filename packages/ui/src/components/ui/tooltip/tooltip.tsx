import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

import {
  Content as TooltipContentPrimitive,
  Portal as TooltipPortalPrimitive,
  Provider as TooltipProviderPrimitive,
  Root as TooltipRootPrimitive,
  Trigger as TooltipTriggerPrimitive,
} from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

const TooltipProvider = TooltipProviderPrimitive

const Tooltip = TooltipRootPrimitive

const TooltipTrigger = TooltipTriggerPrimitive

const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipContentPrimitive>,
  ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPortalPrimitive>
    <TooltipContentPrimitive
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </TooltipPortalPrimitive>
))
TooltipContent.displayName = TooltipContentPrimitive.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
