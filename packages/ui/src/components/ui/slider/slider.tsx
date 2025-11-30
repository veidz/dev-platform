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
>(({ className, ...props }, ref) => (
  <SliderRoot
    ref={ref}
    className={cn(
      'group relative flex w-full touch-none select-none items-center data-disabled:cursor-not-allowed data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderRange className="absolute h-full bg-primary" />
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
