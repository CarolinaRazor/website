'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

interface PaginationProps {
  className?: string
  page: number
  totalPages: number
  basePath?: string
}

export const Pagination: React.FC<PaginationProps> = ({
                                                        className,
                                                        page,
                                                        totalPages,
                                                        basePath = '/posts/page',
                                                      }) => {
  const router = useRouter()

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      router.push(`${basePath}/${p}`)
    }
  }

  const pageNumbers: (number | 'ellipsis')[] = []

  if (page > 2) pageNumbers.push(1)
  if (page > 3) pageNumbers.push('ellipsis')
  if (page - 1 >= 1) pageNumbers.push(page - 1)
  pageNumbers.push(page)
  if (page + 1 <= totalPages) pageNumbers.push(page + 1)
  if (page + 2 < totalPages) pageNumbers.push('ellipsis')
  if (page + 1 < totalPages) pageNumbers.push(totalPages)

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            />
          </PaginationItem>

          {pageNumbers.map((p, idx) => (
            <PaginationItem key={idx}>
              {p === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => goToPage(p as number)}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
