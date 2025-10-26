import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import Link from 'next/link'

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && populatedAuthors.length > 0

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category
                const titleToUse = categoryTitle || 'Untitled category'
                const isLast = index === categories.length - 1
                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col gap-4">
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}

            {hasAuthors && (
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-sm">Author{populatedAuthors.length > 1 ? 's' : ''}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 [&>*:not(:last-child)]:after:content-['•'] [&>*:not(:last-child)]:after:mx-3 [&>*:not(:last-child)]:after:text-white/70">
                  {populatedAuthors.map((author) => (
                    <Link
                      key={author.id}
                      href={`/authors/${author.id}`}
                      className="flex items-center gap-2 text-white"
                    >
                      {author.avatar && typeof author.avatar !== 'number' && (
                        <img
                          src={author.avatar.url ?? ''}
                          alt={author.name ?? 'Author avatar'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <span className="font-semibold text-sm">{author.name}</span>
                    </Link>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}
