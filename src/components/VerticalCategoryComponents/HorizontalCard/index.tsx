'use client'
import Link from 'next/link'
import {Post} from '@/payload-types'
import {Media} from '@/components/Media'

export function HorizontalCard({ post }: { post: Post }) {
  const titleSize = 'text-lg'
  const squareSize = 112 // 28 * 4 = 112px

  const original = post.heroImage
  const preferredImage =
    typeof original === "object" && original !== null
      ? {
        ...original,
        ...(original.sizes?.small
          ? {
            url: original.sizes.small.url,
            width: original.sizes.small.width,
            height: original.sizes.small.height,
          }
          : {}),
      }
      : original;

  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="flex gap-3 items-start">
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
        <h2
          className={`${titleSize} font-bold leading-snug group-hover:text-primary transition-colors flex-1`}
        >
          {post.title}
        </h2>
      </article>
    </Link>
  )
}
