'use client'
import Link from 'next/link'
import {Post} from '@/payload-types'
import {Media} from '@/components/Media'

// required for grabbing extra featured article text
function getTextFromContent(content: any): string {
  if (!content?.root?.children) return ''

  let text = ''

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (node.text) text += node.text + ' '
      if (node.children) traverse(node.children)
    }
  }

  traverse(content.root.children)
  return text.trim()
}

export function MagazineCard({post, size}: { post: Post; size: 'small' | 'medium' }) {
  const titleSize = size === 'medium' ? 'text-3xl' : 'text-xl'
  const excerptSize = size === 'medium' ? 'text-lg' : 'text-sm'

  // const excerpt =
  //   size === 'medium' && post.content
  //     ? getTextFromContent(post.content).slice(0, 500) + '...'
  //     : post.meta?.description

  const excerpt =
    size === 'medium' && post.featuredtext

  const category =
    (post.categories?.[0] as any)?.title ?? 'Uncategorized'

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null

  const original = post.heroImage;

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
    <article className={`article-${size}`}>
      <Link href={`/posts/${post.slug}`} className="block group">
        {preferredImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-3">
            <Media
              resource={preferredImage}
              size="100%"
              className="object-cover transition-transform duration-300 " // group-hover:scale-110
              priority={true}
            />
          </div>
        )}


        <p className="uppercase text-[0.8rem] font-semibold text-teal-700 dark:text-teal-300 mb-1">
          {category}
        </p>

        <h2
          className={`${titleSize} leading-snug group-hover:text-primary transition-colors`}
        >
          {post.title}
        </h2>

        {formattedDate && (
          <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
        )}

        <p className={`${excerptSize} text-muted-foreground mt-1`}>{excerpt}</p>
      </Link>
    </article>
  )
}
