import type {MagazineBlock as MagazineBlockProps, Post} from '@/payload-types'

import React from 'react'
import {getPayload} from 'payload'
import config from '@payload-config'
import {MagazineCard} from '@/components/MagazineCard'

export const MagazineBlock: React.FC<MagazineBlockProps & { id?: string }> = async ({ id }) => {
  const payload = await getPayload({ config })

  const featuredGlobal = await payload.findGlobal({
    slug: 'featured-article',
    depth: 2,
  })

  const featuredArticleId =
    typeof featuredGlobal?.post === 'number'
      ? featuredGlobal.post
      : featuredGlobal?.post?.id

  let featuredArticle: Post | null = null

  if (featuredArticleId) {
    const { docs } = await payload.find({
      collection: 'posts',
      where: { id: { equals: featuredArticleId }, _status: { equals: 'published' } },
      depth: 2,
    })
    featuredArticle = docs[0] ?? null
  }

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    depth: 2,
  })

  if (!featuredArticle && posts?.[0]) {
    featuredArticle = posts[0]
  }

  const remaining = posts.filter((p) => p.id !== featuredArticle?.id)

  const colCount = 3
  const postsPerCol = 2
  const columns = Array.from({ length: colCount }, (_, i) =>
    remaining.slice(i * postsPerCol, (i + 1) * postsPerCol)
  )

  return (
    <section id={`block-${id}`} className="pb-12">
      <div
        className="
      max-w-7xl mx-auto px-4
      grid gap-6
      sm:grid-cols-2
      lg:grid-cols-5 lg:gap-8
      items-start
    "
      >
        {/* Left column */}
        <div className="space-y-6 lg:col-span-1 mt-0 md:mt-10 lg:md-10 order-2 lg:order-1">
          {columns[0].map((p) => (
            <MagazineCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Featured article — first on mobile, centered column on lg */}
        {featuredArticle && (
          <div
            className="
          order-1 lg:order-2
          sm:col-span-2
          lg:col-span-2
        "
          >
            <h2 className="uppercase font-extrabold tracking-widest text-lg border-l-4 pl-2 mb-3 border-black dark:border-white">
              Featured
            </h2>
            <MagazineCard post={featuredArticle as Post} size="medium" />
          </div>
        )}

        {/* Middle column */}
        <div className="space-y-6 lg:col-span-1 mt-0 md:mt-10 lg:md-10 order-3 lg:order-3">
          {columns[1].map((p) => (
            <MagazineCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-6 lg:col-span-1 mt-0 md:mt-10 lg:md-10 order-4 lg:order-4">
          {columns[2].map((p) => (
            <MagazineCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-300 dark:border-neutral-700 mt-12 w-[80%] border-3 mx-auto"></div>
    </section>

  )
}
