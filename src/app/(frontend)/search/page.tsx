import type {Metadata} from 'next/types'

import {CollectionArchive} from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import {getPayload} from 'payload'
import React from 'react'
import {Search} from '@/search/Component'
import {SearchFilters} from '@/search/SearchFilters'
import {Pagination} from '@/search/Pagination'
import PageClient from './page.client'
import {CardPostData} from '@/components/Card'

const RESULTS_PER_PAGE = 12

type Args = {
  searchParams: Promise<{
    q: string
    category?: string
    author?: string
    dateRange?: string
    sort?: string
    page?: string
  }>
}

export default async function Page({searchParams: searchParamsPromise}: Args) {
  const {q: query, category, author, dateRange, sort, page: pageParam} = await searchParamsPromise
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))
  const payload = await getPayload({config: configPromise})

  const [categoriesResult, authorsResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
    }),
    payload.find({
      collection: 'users',
      limit: 100,
      sort: 'name',
      where: {
        roles: {
          contains: 'author',
        },
      },
    }),
  ])

  const whereConditions: any = {}
  const andConditions: any[] = []

  if (query) {
    andConditions.push({
      or: [
        { title: { like: query } },
        { 'meta.description': { like: query } },
        { 'meta.title': { like: query } },
        { slug: { like: query } },
      ],
    })
  }

  if (category && category !== 'all') {
    andConditions.push({
      'categories.categoryID': { equals: category },
    })
  }

  if (author && author !== 'all') {
    andConditions.push({
      'authors.authorID': { equals: author },
    })
  }

  if (dateRange && dateRange !== 'all') {
    let startDate: Date

    switch (dateRange) {
      case 'today':
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case '3months':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 3)
        break
      case '6months':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 6)
        break
      case 'year':
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = new Date(0)
    }

    andConditions.push({
      publishedAt: { greater_than_equal: startDate.toISOString() },
    })
  }

  if (andConditions.length > 0) {
    whereConditions.and = andConditions
  }

  // Determine sort field for database query
  let sortField: string = '-publishedAt' // default: newest first

  if (sort) {
    switch (sort) {
      case 'newest':
        sortField = '-publishedAt'
        break
      case 'oldest':
        sortField = 'publishedAt'
        break
      case 'title-asc':
        sortField = 'title'
        break
      case 'title-desc':
        sortField = '-title'
        break
      case 'relevance':
        // For relevance, we'll use default and let Payload handle it
        sortField = '-publishedAt'
        break
    }
  }

  // Fetch paginated results directly from database
  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: RESULTS_PER_PAGE,
    page: currentPage,
    sort: sortField,
    select: {
      title: true,
      slug: true,
      categories: true,
      authors: true,
      meta: true,
      publishedAt: true,
    },
    ...(Object.keys(whereConditions).length > 0 ? { where: whereConditions } : {}),
  })

  const paginatedPosts = posts.docs
  const totalResults = posts.totalDocs
  const totalPages = posts.totalPages

  return (
    <div className="pt-4 md:pt-12 pb-24">
      <PageClient/>
      <div className="container mb-8">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-6">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search/>
          </div>
        </div>
      </div>

      <div className="container mb-8">
        <SearchFilters
          categories={categoriesResult.docs.map(cat => ({
            id: cat.id,
            title: cat.title,
            slug: cat.slug || '',
          }))}
          authors={authorsResult.docs.map(user => ({
            id: user.id,
            name: user.name,
          }))}
        />
      </div>

      {totalResults > 0 ? (
        <>
          <div className="container mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''}
            </p>
          </div>
          <CollectionArchive posts={paginatedPosts as unknown as CardPostData[]} />
          <div className="container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={RESULTS_PER_PAGE}
            />
          </div>
        </>
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `The LiberatorCH Search`,
  }
}
