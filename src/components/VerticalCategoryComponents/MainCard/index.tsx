'use client'
import Link from 'next/link'
import {Post} from '@/payload-types'
import {Media} from '@/components/Media'

export function MainCard({ post }: { post: Post }) {
  const titleSize = 'text-2xl'

  const authors = post.authors

  const regularAuthorNames = authors
    ?.map((author) => {
      if (typeof author === 'object' && author !== null && 'name' in author) {
        return author.name
      }
      return null
    })
    .filter((name): name is string => name !== null)

  const guestAuthorNames = post.guestAuthors?.filter((name): name is string => !!name)

  const authorNames =
    regularAuthorNames && regularAuthorNames.length > 0
      ? regularAuthorNames.join(' & ')
      : guestAuthorNames && guestAuthorNames.length > 0
        ? guestAuthorNames.join(' & ')
        : 'Anonymous'

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
          className={`${titleSize} leading-snug group-hover:text-primary transition-colors`}
        >
          {post.title}
        </h2>
        {authorNames && (
          <p className="text-sm text-sky-500 mt-0 mb-1">{authorNames}</p>
        )}
      </Link>
    </article>
  )
}
