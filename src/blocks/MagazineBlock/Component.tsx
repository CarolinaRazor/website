import type { Post } from '@/payload-types'
import type { MagazineBlock as MagazineBlockProps } from '@/payload-types'

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MagazineCard } from '@/components/MagazineCard'

export const MagazineBlock: React.FC<MagazineBlockProps & { id?: string }> = async ({
                                                                                      id,
                                                                                      featuredArticle: featuredArticleProp,
                                                                                    }) => {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    depth: 2,
  })

  let featuredArticle: Post | null = null

  if (featuredArticleProp) {
    const articleId =
      typeof featuredArticleProp === 'number'
        ? featuredArticleProp
        : featuredArticleProp?.id

    if (articleId) {
      const { docs } = await payload.find({
        collection: 'posts',
        where: { id: { equals: articleId }, _status: { equals: 'published' } },
        depth: 2,
      })
      featuredArticle = docs[0] ?? null
    }
  }

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
    <section id={`block-${id}`} className="pb-12"> {/*removed py-12, remember this for later*/}
      <div
        className="
          max-w-7xl mx-auto px-4
          grid gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5 xl:gap-8
          items-start
        "
      >
        {/* Featured article */}
        {featuredArticle && (
          <div
            className="
              order-first
              sm:col-span-2
              lg:col-span-3
              xl:order-none
              xl:col-span-2
            "
          >
            <h2 className="uppercase font-extrabold tracking-widest text-lg border-l-4 pl-2 mb-3 border-black dark:border-white">
              Featured
            </h2>
            <MagazineCard post={featuredArticle as Post} size="medium" />
          </div>
        )}

        {/* Left column */}
        <div className="space-y-6 xl:col-span-1 mt-10">
          {columns[0].map((p) => (
            <MagazineCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Middle column */}
        <div className="space-y-6 xl:col-span-1 mt-10">
          {columns[1].map((p) => (
            <MagazineCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-6 xl:col-span-1 mt-10">
          {columns[2].map((p) => (
            <MagazineCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>
      </div>
    </section>
  )
}
