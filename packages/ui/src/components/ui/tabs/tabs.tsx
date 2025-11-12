import {
  Content as TabsContentPrimitive,
  List as TabsListPrimitive,
  Root as TabsRootPrimitive,
  Trigger as TabsTriggerPrimitive,
} from '@radix-ui/react-tabs'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

const Tabs = TabsRootPrimitive

const TabsList = forwardRef<
  ComponentRef<typeof TabsListPrimitive>,
  ComponentPropsWithoutRef<typeof TabsListPrimitive>
>(({ className, ...props }, ref) => (
  <TabsListPrimitive
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsListPrimitive.displayName

const TabsTrigger = forwardRef<
  ComponentRef<typeof TabsTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof TabsTriggerPrimitive>
>(({ className, ...props }, ref) => (
  <TabsTriggerPrimitive
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsTriggerPrimitive.displayName

const TabsContent = forwardRef<
  ComponentRef<typeof TabsContentPrimitive>,
  ComponentPropsWithoutRef<typeof TabsContentPrimitive>
>(({ className, ...props }, ref) => (
  <TabsContentPrimitive
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsContentPrimitive.displayName

export { Tabs, TabsContent, TabsList, TabsTrigger }
