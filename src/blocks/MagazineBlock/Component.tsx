import type { Post } from '@/payload-types'
import type { MagazineBlock as MagazineBlockProps } from '@/payload-types'

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'

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
    <section className="" id={`block-${id}`}> {/*possibly re-add mb or my-16 at some point*/}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 gap-6 xl:grid-cols-5 xl:gap-8">
        {/* Left column */}
        <div className="xl:col-span-1 space-y-6">
          {columns[0].map((p) => (
            <PostCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Featured article */}
        <div className="xl:col-span-2">
          {featuredArticle && <PostCard post={featuredArticle as Post} size="medium" />}
        </div>

        {/* Middle column */}
        <div className="xl:col-span-1 space-y-6">
          {columns[1].map((p) => (
            <PostCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 space-y-6">
          {columns[2].map((p) => (
            <PostCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>
      </div>
    </section>
  )
}
