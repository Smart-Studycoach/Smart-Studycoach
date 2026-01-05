import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * Root pagination navigation component that wraps all pagination elements.
 * Provides semantic navigation structure with ARIA labels for accessibility.
 * 
 * @example
 * ```tsx
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="#" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

/**
 * Container for pagination items, renders as an unordered list.
 * Should be used inside a Pagination component.
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

/**
 * Individual list item wrapper for pagination elements.
 * Used to wrap PaginationLink, PaginationPrevious, PaginationNext, or PaginationEllipsis.
 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

/**
 * Pagination link component for page numbers and navigation.
 * Renders as an anchor tag with button styling.
 * 
 * @param isActive - Indicates if this is the current active page
 * @param size - Size variant of the link, inherited from button component
 * 
 * @example
 * ```tsx
 * <PaginationLink href="?page=1" isActive={true}>1</PaginationLink>
 * <PaginationLink href="?page=2">2</PaginationLink>
 * ```
 */
type PaginationLinkProps = {
  isActive?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

/**
 * Previous page navigation button with icon and text.
 * Styled as a button with a left chevron icon and "Vorige" (Previous) text.
 * 
 * @example
 * ```tsx
 * <PaginationPrevious href="?page=1" />
 * ```
 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Vorige</span>
    </PaginationLink>
  )
}

/**
 * Next page navigation button with icon and text.
 * Styled as a button with "Volgende" (Next) text and a right chevron icon.
 * 
 * @example
 * ```tsx
 * <PaginationNext href="?page=3" />
 * ```
 */
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Volgende</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

/**
 * Ellipsis indicator for omitted pages in pagination.
 * Displays a horizontal dots icon to indicate skipped page numbers.
 * 
 * @example
 * ```tsx
 * <PaginationEllipsis />
 * ```
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
