'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'content' | 'createdAt'>

export const Card: React.FC<{
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  size?: 'small' | 'medium'
}> = ({ className, doc, relationTo = 'posts', showCategories = true, size = 'medium' }) => {
  const { card, link } = useClickableCard({})
  const { slug, categories, meta, title, content, createdAt } = doc || {}
  const { description, image: metaImage } = meta || {}

  const categoryTitle = showCategories
    ? (categories?.[0] as any)?.title ?? 'Uncategorized'
    : undefined

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null

  const titleSize = size === 'medium' ? 'text-2xl md:text-3xl' : 'text-xl'
  const excerptSize = size === 'medium' ? 'text-base' : 'text-sm'

  // Generate excerpt
  const excerpt =
    size === 'medium' && content
      ? (() => {
        let text = ''
        function traverse(nodes: any[]) {
          for (const node of nodes) {
            if (node.text) text += node.text + ' '
            if (node.children) traverse(node.children)
          }
        }
        traverse(content.root?.children || [])
        return text.trim().slice(0, 200) + '...'
      })()
      : description

  const href = `/${relationTo}/${slug}`

  return (
    <article
      ref={card.ref}
      className={cn(
        'group border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow duration-200 cursor-pointer',
        className,
      )}
    >
      {metaImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Media
            resource={metaImage}
            size="100%"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        {categoryTitle && (
          <p className="uppercase text-xs md:text-sm font-semibold text-teal-700 dark:text-teal-300 mb-1">
            {categoryTitle}
          </p>
        )}

        {title && (
          <h2
            className={cn(
              titleSize,
              'font-bold leading-snug group-hover:text-primary transition-colors mb-1',
            )}
          >
            <Link href={href} ref={link.ref} className="not-prose">
              {title}
            </Link>
          </h2>
        )}

        {formattedDate && <p className="text-xs text-muted-foreground mb-2">{formattedDate}</p>}

        {excerpt && <p className={cn(excerptSize, 'text-muted-foreground')}>{excerpt}</p>}
      </div>
    </article>
  )
}
