import { cn } from "@/lib/utils"

function Skeleton({ className, ref, ...props }: React.ComponentProps<"div"> & { ref?: React.RefObject<HTMLDivElement> } ) {
  return (
    <div ref={ref}
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
