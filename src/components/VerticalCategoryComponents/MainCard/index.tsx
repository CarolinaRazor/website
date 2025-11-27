'use client'
import Link from 'next/link'
import {Post} from '@/payload-types'
import {Media} from '@/components/Media'

export function MainCard({ post }: { post: Post }) {
  const titleSize = 'text-2xl'

  const original = post.heroImage
  const preferredImage =
    typeof original === "object" && original !== null
      ? {
        ...original,
        ...(original.sizes?.medium
          ? {
            url: original.sizes.medium.url,
            width: original.sizes.medium.width,
            height: original.sizes.medium.height,
          }
          : {}),
      }
      : original;

  return (
    <article>
      <Link href={`/posts/${post.slug}`} className="block group">
        {preferredImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-3">
            <Media
              resource={preferredImage}
              size="100%"
              className="object-cover transition-transform duration-300 " // group-hover:scale-105
            />
          </div>
        )}

        <h2
          className={`${titleSize} font-bold leading-snug group-hover:text-primary transition-colors`}
        >
          {post.title}
        </h2>
      </Link>
    </article>
  )
}
