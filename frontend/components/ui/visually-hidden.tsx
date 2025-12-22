'use client'

import * as React from 'react'

const VisuallyHidden = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0,
      ...style,
    }}
    className={className}
    {...props}
  />
))
VisuallyHidden.displayName = 'VisuallyHidden'

export { VisuallyHidden }

