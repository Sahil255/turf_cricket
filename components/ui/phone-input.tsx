'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex">
        <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
          <span className="text-sm text-muted-foreground">+91</span>
        </div>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }