import {
  Indicator as ProgressIndicatorPrimitive,
  Root as ProgressRootPrimitive,
} from '@radix-ui/react-progress'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

const Progress = forwardRef<
  ComponentRef<typeof ProgressRootPrimitive>,
  ComponentPropsWithoutRef<typeof ProgressRootPrimitive>
>(({ className, value = 0, ...props }, ref) => {
  const max = props.max ?? 100
  const dataState =
    value === null || value === undefined
      ? 'indeterminate'
      : value >= max
        ? 'complete'
        : 'loading'

  return (
    <ProgressRootPrimitive
      ref={ref}
      value={value}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className,
      )}
      aria-valuenow={value ?? undefined}
      {...props}
    >
      <ProgressIndicatorPrimitive
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        data-state={dataState}
      />
    </ProgressRootPrimitive>
  )
})

Progress.displayName = ProgressRootPrimitive.displayName

export { Progress }
