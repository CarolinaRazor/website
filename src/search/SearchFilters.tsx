'use client'

import {Check, ChevronDown, X} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Label} from '@/components/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {cn} from '@/utilities/ui'


type Category = {
  id: string | number
  title: string
  slug: string
}

type Author = {
  id: string | number
  name: string
}

type SearchFiltersProps = {
  categories: Category[]
  authors: Author[]
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ categories, authors }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  )
  const [selectedAuthor, setSelectedAuthor] = useState<string>(
    searchParams.get('author') || 'all'
  )
  const [selectedDateRange, setSelectedDateRange] = useState<string>(
    searchParams.get('dateRange') || 'all'
  )
  const [selectedSort, setSelectedSort] = useState<string>(
    searchParams.get('sort') || 'newest'
  )

  const [categorySearch, setCategorySearch] = useState('')
  const [authorSearch, setAuthorSearch] = useState('')

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [authorOpen, setAuthorOpen] = useState(false)
  const [dateRangeOpen, setDateRangeOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  // Sync state with URL parameters when they change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all')
    setSelectedAuthor(searchParams.get('author') || 'all')
    setSelectedDateRange(searchParams.get('dateRange') || 'all')
    setSelectedSort(searchParams.get('sort') || 'newest')
  }, [searchParams])

  const updateFilters = (
    category: string,
    author: string,
    dateRange: string,
    sort: string
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    const query = searchParams.get('q')

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    if (author && author !== 'all') {
      params.set('author', author)
    } else {
      params.delete('author')
    }

    if (dateRange && dateRange !== 'all') {
      params.set('dateRange', dateRange)
    } else {
      params.delete('dateRange')
    }

    if (sort && sort !== 'newest') {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateFilters(value, selectedAuthor, selectedDateRange, selectedSort)
    setCategoryOpen(false)
    setCategorySearch('')
  }

  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value)
    updateFilters(selectedCategory, value, selectedDateRange, selectedSort)
    setAuthorOpen(false)
    setAuthorSearch('')
  }

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value)
    updateFilters(selectedCategory, selectedAuthor, value, selectedSort)
    setDateRangeOpen(false)
  }

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    updateFilters(selectedCategory, selectedAuthor, selectedDateRange, value)
    setSortOpen(false)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedAuthor('all')
    setSelectedDateRange('all')
    setSelectedSort('newest')
    const params = new URLSearchParams()
    const query = searchParams.get('q')
    if (query) {
      params.set('q', query)
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedAuthor !== 'all' ||
    selectedDateRange !== 'all' ||
    selectedSort !== 'newest'

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((category) => ({
      value: String(category.id),
      label: category.title,
    })),
  ]

  const authorOptions = [
    { value: 'all', label: 'All Authors' },
    ...authors.map((author) => ({
      value: String(author.id),
      label: author.name,
    })),
  ]

  const filteredCategories = categorySearch
    ? categoryOptions.filter((option) =>
        option.label.toLowerCase().includes(categorySearch.toLowerCase())
      )
    : categoryOptions

  const filteredAuthors = authorSearch
    ? authorOptions.filter((option) =>
        option.label.toLowerCase().includes(authorSearch.toLowerCase())
      )
    : authorOptions

  const selectedCategoryLabel = categoryOptions.find(opt => opt.value === selectedCategory)?.label || 'All Categories'
  const selectedAuthorLabel = authorOptions.find(opt => opt.value === selectedAuthor)?.label || 'All Authors'

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Past Week' },
    { value: 'month', label: 'Past Month' },
    { value: '3months', label: 'Past 3 Months' },
    { value: '6months', label: 'Past 6 Months' },
    { value: 'year', label: 'Past Year' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'relevance', label: 'Most Relevant' },
  ]

  const selectedDateRangeLabel = dateRangeOptions.find(opt => opt.value === selectedDateRange)?.label || 'All Time'
  const selectedSortLabel = sortOptions.find(opt => opt.value === selectedSort)?.label || 'Newest First'

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="ghost" size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category-filter">Category</Label>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
                id="category-filter"
              >
                <span className="truncate">{selectedCategoryLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col" align="start">
              <div className="max-h-64 overflow-y-auto p-1 flex-1">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((option) => {
                    const isSelected = option.value === selectedCategory
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent"
                        )}
                        onClick={() => handleCategoryChange(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </div>
                    )
                  })
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No category found
                  </div>
                )}
              </div>
              <div className="p-2 border-t sticky bottom-0 bg-background">
                <Input
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="h-9"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="author-filter">Author</Label>
          <Popover open={authorOpen} onOpenChange={setAuthorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
                id="author-filter"
              >
                <span className="truncate">{selectedAuthorLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col" align="start">
              <div className="max-h-64 overflow-y-auto p-1 flex-1">
                {filteredAuthors.length > 0 ? (
                  filteredAuthors.map((option) => {
                    const isSelected = option.value === selectedAuthor
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent"
                        )}
                        onClick={() => handleAuthorChange(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </div>
                    )
                  })
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No author found
                  </div>
                )}
              </div>
              <div className="p-2 border-t sticky bottom-0 bg-background">
                <Input
                  placeholder="Search authors..."
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  className="h-9"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-range-filter">Published</Label>
          <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
                id="date-range-filter"
              >
                <span className="truncate">{selectedDateRangeLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col" align="start">
              <div className="max-h-64 overflow-y-auto p-1">
                {dateRangeOptions.map((option) => {
                  const isSelected = option.value === selectedDateRange
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent"
                      )}
                      onClick={() => handleDateRangeChange(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort-filter">Sort By</Label>
          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
                id="sort-filter"
              >
                <span className="truncate">{selectedSortLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 flex flex-col" align="start">
              <div className="max-h-64 overflow-y-auto p-1">
                {sortOptions.map((option) => {
                  const isSelected = option.value === selectedSort
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent"
                      )}
                      onClick={() => handleSortChange(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
