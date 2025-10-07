import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Post, Category } from '@/payload-types'
import { MainCard } from '@/components/VerticalCategoryBlock/MainCard'
import { HorizontalCard } from '@/components/VerticalCategoryBlock/HorizontalCard'

interface VerticalCategoryBlockProps {
  category: Category | string | number
  latestCount?: number
}

export const VerticalCategoryBlock = async ({
                                              category,
                                              latestCount = 0,
                                            }: VerticalCategoryBlockProps) => {
  const payload = await getPayload({ config })

  const categoryId = typeof category === 'object' ? category.id : category

  const categoryDoc =
    typeof category === 'object'
      ? category
      : await payload.findByID({
        collection: 'categories',
        id: categoryId,
      })

  const { docs: allPosts } = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    limit: latestCount,
  })

  const excludedIDs = latestCount > 0 ? allPosts.map((p) => p.id) : []

  const { docs: categoryPosts } = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    where: {
      _status: { equals: 'published' },
      categories: { in: [String(categoryId)] },
      ...(excludedIDs.length > 0 && { id: { not_in: excludedIDs } }),
    },
    limit: 3,
  })

  if (!categoryPosts.length) return null

  const mainPost = categoryPosts[0]
  const subPosts = categoryPosts.slice(1)

  return (
    <section className="max-w-lg w-full mx-auto pb-8">
      {/* Category header */}
      <Link href={`/categories/${categoryDoc.slug}`} className="inline-block mb-3">
        <h2 className="uppercase font-extrabold tracking-widest text-lg border-l-4 pl-2 border-black dark:border-white">
          {categoryDoc.title}
        </h2>
      </Link>

      {/* Top main article */}
      <MainCard post={mainPost} />

      {/* Sub articles */}
      <div className="mt-6 space-y-4">
        {subPosts.map((p) => (
          <HorizontalCard key={p.id} post={p} />
        ))}
      </div>

      {/* Read more button */}
      <div className="mt-6">
        <Link
          href={`/categories/${categoryDoc.slug}`}
          className="text-primary font-semibold hover:underline"
        >
          Read more →
        </Link>
      </div>
    </section>
  )
}
