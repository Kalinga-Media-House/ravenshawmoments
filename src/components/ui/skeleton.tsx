import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-shimmer bg-gradient-to-r from-[#FFFDF8] via-[#F3EBE1] to-[#FFFDF8] dark:from-muted/40 dark:via-muted/60 dark:to-muted/40 rounded-xl border border-[#EADED2]/50 dark:border-border/40 shadow-[0_2px_8px_rgba(91,0,27,0.02)] transition-all",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
