import type React from 'react'

import { cn } from '@/lib/utils'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

const Skeleton = ({
  className,
  ...props
}: SkeletonProps): React.JSX.Element => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

Skeleton.displayName = 'Skeleton'

export { Skeleton }
