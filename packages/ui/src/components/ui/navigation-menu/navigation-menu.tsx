import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

import { ChevronDownIcon } from '@radix-ui/react-icons'
import {
  Content as NavigationMenuContentPrimitive,
  Indicator as NavigationMenuIndicatorPrimitive,
  Item as NavigationMenuItemPrimitive,
  Link as NavigationMenuLinkPrimitive,
  List as NavigationMenuListPrimitive,
  Root as NavigationMenuRootPrimitive,
  Trigger as NavigationMenuTriggerPrimitive,
  Viewport as NavigationMenuViewportPrimitive,
} from '@radix-ui/react-navigation-menu'

import { cn } from '@/lib/utils'

const NavigationMenu = forwardRef<
  ComponentRef<typeof NavigationMenuRootPrimitive>,
  ComponentPropsWithoutRef<typeof NavigationMenuRootPrimitive>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuRootPrimitive
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuRootPrimitive>
))
NavigationMenu.displayName = 'NavigationMenu'

const NavigationMenuList = forwardRef<
  ComponentRef<typeof NavigationMenuListPrimitive>,
  ComponentPropsWithoutRef<typeof NavigationMenuListPrimitive>
>(({ className, ...props }, ref) => (
  <NavigationMenuListPrimitive
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = 'NavigationMenuList'

const NavigationMenuItem = NavigationMenuItemPrimitive

const navigationMenuTriggerStyle = cn(
  'group inline-flex h-9 w-max cursor-pointer items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
)

const NavigationMenuTrigger = forwardRef<
  ComponentRef<typeof NavigationMenuTriggerPrimitive>,
  ComponentPropsWithoutRef<typeof NavigationMenuTriggerPrimitive>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuTriggerPrimitive
    ref={ref}
    className={cn(navigationMenuTriggerStyle, 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDownIcon
      className="relative top-px ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuTriggerPrimitive>
))
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

const NavigationMenuContent = forwardRef<
  ComponentRef<typeof NavigationMenuContentPrimitive>,
  ComponentPropsWithoutRef<typeof NavigationMenuContentPrimitive>
>(({ className, ...props }, ref) => (
  <NavigationMenuContentPrimitive
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = 'NavigationMenuContent'

const NavigationMenuLink = NavigationMenuLinkPrimitive

const NavigationMenuViewport = forwardRef<
  ComponentRef<typeof NavigationMenuViewportPrimitive>,
  ComponentPropsWithoutRef<typeof NavigationMenuViewportPrimitive>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuViewportPrimitive
      className={cn(
        'origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-(--radix-navigation-menu-viewport-width)',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = 'NavigationMenuViewport'

const NavigationMenuIndicator = forwardRef<
  ComponentRef<typeof NavigationMenuIndicatorPrimitive>,
  ComponentPropsWithoutRef<typeof NavigationMenuIndicatorPrimitive>
>(({ className, ...props }, ref) => (
  <NavigationMenuIndicatorPrimitive
    ref={ref}
    className={cn(
      'top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuIndicatorPrimitive>
))
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator'

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
}
