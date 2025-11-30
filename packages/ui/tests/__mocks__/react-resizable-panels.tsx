import { forwardRef } from 'react'

export const PanelGroup = forwardRef<
  HTMLDivElement,
  {
    direction: 'horizontal' | 'vertical'
    autoSaveId?: string
    children: React.ReactNode
    className?: string
  }
>(({ direction, autoSaveId, children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    data-panel-group-direction={direction}
    data-panel-group-id={autoSaveId}
    {...props}
  >
    {children}
  </div>
))
PanelGroup.displayName = 'PanelGroup'

export const Panel = forwardRef<
  HTMLDivElement,
  {
    defaultSize?: number
    minSize?: number
    maxSize?: number
    collapsible?: boolean
    collapsedSize?: number
    onCollapse?: () => void
    onExpand?: () => void
    id?: string
    children: React.ReactNode
    className?: string
  }
>((allProps, ref) => {
  const { defaultSize, collapsible, id, children, className, ...restProps } =
    allProps

  const nonDomProps = [
    'onCollapse',
    'onExpand',
    'minSize',
    'maxSize',
    'collapsedSize',
  ]
  const domProps = Object.fromEntries(
    Object.entries(restProps).filter(([key]) => !nonDomProps.includes(key)),
  )

  return (
    <div
      ref={ref}
      className={className}
      data-panel=""
      data-panel-id={id}
      data-panel-size={defaultSize}
      data-panel-collapsible={collapsible?.toString()}
      {...domProps}
    >
      {children}
    </div>
  )
})
Panel.displayName = 'Panel'

export const PanelResizeHandle = forwardRef<
  HTMLDivElement,
  {
    disabled?: boolean
    children?: React.ReactNode
    className?: string
  }
>(({ disabled, children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    role="separator"
    tabIndex={0}
    aria-valuenow={50}
    aria-valuemin={0}
    aria-valuemax={100}
    data-panel-resize-handle-id="mock-handle"
    data-panel-resize-handle-enabled={(!disabled).toString()}
    {...props}
  >
    {children}
  </div>
))
PanelResizeHandle.displayName = 'PanelResizeHandle'
