'use client'

import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />
)

const PaginationContent: React.FC<{ ref?: React.Ref<HTMLUListElement> } & React.HTMLAttributes<HTMLUListElement>> = ({
                                                                                                                       className,
                                                                                                                       ref,
                                                                                                                       ...props
                                                                                                                     }) => <ul className={cn('flex flex-row items-center gap-1', className)} ref={ref} {...props} />

const PaginationItem: React.FC<{ ref?: React.Ref<HTMLLIElement> } & React.HTMLAttributes<HTMLLIElement>> = ({
                                                                                                              className,
                                                                                                              ref,
                                                                                                              ...props
                                                                                                            }) => <li className={cn('', className)} ref={ref} {...props} />

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'button'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        size,
        variant: isActive ? 'outline' : 'ghost',
      }),
      className,
    )}
    {...props}
  />
)

const PaginationFirst = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to first page" size="default" {...props}>
    <ChevronLeft className="h-4 w-4 rotate-180" />
    <span>First</span>
  </PaginationLink>
)

const PaginationPrevious = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)

const PaginationNext = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)

const PaginationLast = (props: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to last page" size="default" {...props}>
    <span>Last</span>
    <ChevronRight className="h-4 w-4 rotate-180" />
  </PaginationLink>
)

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

export const PaginationUI: React.FC<{
  page: number
  totalPages: number
  basePath?: string
  className?: string
}> = ({ page, totalPages, basePath = '/posts/page', className }) => {
  const router = useRouter()
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const goToPage = (p: number) => router.push(`${basePath}/${p}`)

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst onClick={() => goToPage(1)} disabled={!hasPrevPage} />
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious onClick={() => goToPage(page - 1)} disabled={!hasPrevPage} />
        </PaginationItem>

        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {hasPrevPage && (
          <PaginationItem>
            <PaginationLink onClick={() => goToPage(page - 1)}>{page - 1}</PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink isActive onClick={() => goToPage(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>

        {hasNextPage && (
          <PaginationItem>
            <PaginationLink onClick={() => goToPage(page + 1)}>{page + 1}</PaginationLink>
          </PaginationItem>
        )}

        {page + 1 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext onClick={() => goToPage(page + 1)} disabled={!hasNextPage} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLast onClick={() => goToPage(totalPages)} disabled={!hasNextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}


export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
}
