import React from 'react'
import Link from 'next/link'
import {getPayload} from 'payload'
import config from '@payload-config'
import {Category, Post} from '@/payload-types'
import {MainCard} from '@/components/VerticalCategoryComponents/MainCard'
import {HorizontalCard} from '@/components/VerticalCategoryComponents/HorizontalCard'

interface VerticalCategoryStackBlockProps {
  categories: (Category | string | number)[]
  latestCount?: number
}

export const VerticalCategoryStackBlock = async ({
                                                   categories,
                                                   latestCount = 6, // default to 6 to match magazine block behavior
                                                 }: VerticalCategoryStackBlockProps) => {
  const payload = await getPayload({config})

  const featuredGlobal = await payload.findGlobal({
    slug: 'featured-article',
    depth: 1,
  })

  const featuredArticleId =
    typeof featuredGlobal?.post === 'number'
      ? String(featuredGlobal.post)
      : featuredGlobal?.post?.id
        ? String(featuredGlobal.post.id)
        : null

  const {docs: latestPosts} =
    latestCount > 0
      ? await payload.find({
        collection: 'posts',
        sort: '-createdAt',
        where: {_status: {equals: 'published'}},
        limit: latestCount,
      })
      : {docs: []}

  const excludedIDs = new Set([
    ...latestPosts.map((p) => String(p.id)),
    ...(featuredArticleId ? [featuredArticleId] : []),
  ])

  const categoryDocs: Category[] = await Promise.all(
    categories.map(async (cat) => {
      if (typeof cat === 'object') return cat
      const doc = await payload.findByID({
        collection: 'categories',
        id: String(cat),
      })
      return doc as Category
    })
  )

  const columns = await Promise.all(
    categoryDocs.map(async (categoryDoc) => {
      const {docs: categoryPosts} = await payload.find({
        collection: 'posts',
        sort: '-createdAt',
        where: {
          _status: {equals: 'published'},
          categories: {in: [String(categoryDoc.id)]},
          id: {not_in: Array.from(excludedIDs)},
        },
        limit: 3,
      })

      if (!categoryPosts.length) return null

      const mainPost = categoryPosts[0]
      const subPosts = categoryPosts.slice(1)

      return {categoryDoc, mainPost, subPosts}
    })
  )

  const validColumns = columns.filter(
    (col): col is { categoryDoc: Category; mainPost: Post; subPosts: Post[] } => !!col
  )

  if (!validColumns.length) return null

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {validColumns.map(({categoryDoc, mainPost, subPosts}) => (
          <div key={categoryDoc.id} className="flex flex-col">
            {/* Category header */}
            <Link href={`/posts/category/${categoryDoc.slug}`} className="inline-block mb-3">
              <h2
                className="uppercase font-extrabold tracking-widest text-lg border-l-4 pl-2 border-black dark:border-white">
                {categoryDoc.title}
              </h2>
            </Link>

            {/* Top main article */}
            <MainCard post={mainPost}/>

            {/* Sub articles */}
            <div className="mt-6 space-y-4">
              {subPosts.map((p) => (
                <HorizontalCard key={p.id} post={p}/>
              ))}
            </div>

            {/* Read more button */}
            <div className="mt-6">
              <Link
                href={`/posts/category/${categoryDoc.slug}`}
                className="text-primary font-semibold hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
