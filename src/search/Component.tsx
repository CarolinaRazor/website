'use client'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import React, {useEffect, useState} from 'react'
import {useDebounce} from '@/utilities/useDebounce'
import {useRouter, useSearchParams} from 'next/navigation'

export const Search: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') || '')

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue) {
      params.set('q', debouncedValue)
    } else {
      params.delete('q')
    }

    // Reset to page 1 when search query changes
    params.delete('page')

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`
    const currentPath = window.location.pathname + window.location.search

    // Only push if the URL is actually different so we don't have an infinite loop of updates
    if (currentPath !== newUrl) {
      router.push(newUrl)
    }
  }, [debouncedValue, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
