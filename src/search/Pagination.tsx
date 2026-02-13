'use client'

import {ChevronLeft, ChevronRight} from 'lucide-react'
import React from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button} from '@/components/ui/button'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalResults: number
  resultsPerPage: number
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newPage > 1) {
      params.set('page', String(newPage))
    } else {
      params.delete('page')
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startResult} to {endResult} of {totalResults} results
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            const showPage =
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)

            if (!showPage) {
              // Show ellipsis for gaps
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                )
              }
              return null
            }

            return (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={page === currentPage ? 'default' : 'outline'}
                size="sm"
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
