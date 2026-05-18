import { cn } from "@/lib/utils"

type CollectionHandle = "diaria" | "premier" | "plus"

const BADGE_STYLES: Record<CollectionHandle, string> = {
  diaria:  "bg-primary/10 text-primary",
  premier: "bg-secondary/10 text-secondary",
  plus:    "bg-accent/20 text-accent-foreground",
}

const BADGE_LABELS: Record<CollectionHandle, string> = {
  diaria:  "Diaria",
  premier: "Premier",
  plus:    "Plus",
}

const HANDLES = Object.keys(BADGE_STYLES) as CollectionHandle[]

interface CollectionBadgeProps {
  handle: string
  className?: string
}

export function CollectionBadge({ handle, className }: CollectionBadgeProps) {
  const key: CollectionHandle = HANDLES.includes(handle as CollectionHandle)
    ? (handle as CollectionHandle)
    : "diaria"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        BADGE_STYLES[key],
        className
      )}
    >
      {BADGE_LABELS[key]}
    </span>
  )
}
