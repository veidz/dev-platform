import { cn } from '@/lib/utils'
import type React from 'react'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export const Skeleton = ({
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
