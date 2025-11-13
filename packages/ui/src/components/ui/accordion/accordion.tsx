import {
  Content as AccordionContentPrimitive,
  Header as AccordionHeaderPrimitive,
  Item as AccordionItemPrimitive,
  Root as AccordionRootPrimitive,
  Trigger as AccordionTriggerPrimitive,
} from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

const Accordion = AccordionRootPrimitive

const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionItemPrimitive>,
  ComponentPropsWithoutRef<typeof AccordionItemPrimitive>
>(({ className, ...props }, ref) => (
  <AccordionItemPrimitive
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof AccordionTriggerPrimitive>
>(({ className, children, ...props }, ref) => (
  <AccordionHeaderPrimitive className="flex">
    <AccordionTriggerPrimitive
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionTriggerPrimitive>
  </AccordionHeaderPrimitive>
))
AccordionTrigger.displayName = AccordionTriggerPrimitive.displayName

const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionContentPrimitive>,
  ComponentPropsWithoutRef<typeof AccordionContentPrimitive>
>(({ className, children, ...props }, ref) => (
  <AccordionContentPrimitive
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionContentPrimitive>
))
AccordionContent.displayName = AccordionContentPrimitive.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
