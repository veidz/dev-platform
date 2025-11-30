import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import { forwardRef } from 'react'

import {
  Range as SliderRange,
  Root as SliderRoot,
  Thumb as SliderThumb,
  Track as SliderTrack,
} from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = forwardRef<
  ComponentRef<typeof SliderRoot>,
  ComponentPropsWithoutRef<typeof SliderRoot>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SliderRoot
    ref={ref}
    orientation={orientation}
    className={cn(
      'group relative flex touch-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
      orientation === 'horizontal'
        ? 'w-full items-center'
        : 'h-full flex-col items-center',
      className,
    )}
    {...props}
  >
    <SliderTrack
      className={cn(
        'relative grow overflow-hidden rounded-full bg-secondary',
        orientation === 'horizontal' ? 'h-2 w-full' : 'h-full w-2',
      )}
    >
      <SliderRange
        className={cn(
          'absolute bg-primary',
          orientation === 'horizontal' ? 'h-full' : 'w-full',
        )}
      />
    </SliderTrack>
    {(props.defaultValue || props.value || [0]).map((_, i) => (
      <SliderThumb
        key={i}
        className="block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group-data-disabled:pointer-events-none group-data-disabled:cursor-not-allowed"
      />
    ))}
  </SliderRoot>
))
Slider.displayName = SliderRoot.displayName

export { Slider }
