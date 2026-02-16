'use client'
import Link from 'next/link'
import {Post} from '@/payload-types'
import {Media} from '@/components/Media'

export function HorizontalCard({ post }: { post: Post }) {
  const titleSize = 'text-xl'
  const squareSize = 112 // 28 * 4 = 112px

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
        ...(original.sizes?.square
          ? {
            url: original.sizes.square.url,
            width: original.sizes.square.width,
            height: original.sizes.square.height,
          }
          : {}),
      }
      : original;

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="flex gap-3 items-start ">
        {preferredImage && (
          <div
            className="relative flex-shrink-0 overflow-hidden rounded-md"
            style={{ width: squareSize, height: squareSize }}
          >
            <Media
              resource={preferredImage}
              fill={true} // fill the container
              style={{objectFit: "cover"}}
              className="object-cover w-full h-full transition-transform duration-300 " // group-hover:scale-110
            />
          </div>
        )}
        <div className="flex-1">
          <h2
            className={`${titleSize} leading-snug group-hover:text-primary transition-colors`}
          >
            {post.title}
          </h2>
          {authorNames && (
            <p className="text-sm text-sky-400 mt-0 mb-0">{authorNames}</p>
          )}
        </div>
      </article>
    </Link>
  )
}
