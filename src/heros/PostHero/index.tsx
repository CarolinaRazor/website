import {formatDateTime} from 'src/utilities/formatDateTime'
import React from 'react'
import type {Post} from '@/payload-types'
import {Media} from '@/components/Media'
import Link from 'next/link'
import Image from 'next/image'
import RichText from "@/components/RichText";
import {DefaultTypedEditorState} from "@payloadcms/richtext-lexical";

export const PostHero: React.FC<{ post: Post }> = ({post}) => {
  const {categories, heroImage, populatedAuthors, publishedAt, title} = post

  const hasAuthors = populatedAuthors && populatedAuthors.length > 0

  return (
    <div className="flex flex-col gap-6">
      {heroImage && typeof heroImage !== 'string' && (
        <div className="w-full max-w-[48rem] mx-auto px-4 sm:px-6 lg:px-0">
          <div className="relative">
            <Media
              priority
              imgClassName="w-full h-auto object-cover"
              resource={heroImage}
            />
          </div>

          {typeof heroImage === 'object' && heroImage.caption && (
            <RichText
              className="[&_a]:text-gray-600 [&_a]:underline [&_a]:hover:text-gray-900 [&_p]:text-gray-600 mt-2"
              data={heroImage.caption as DefaultTypedEditorState}
              enableGutter={false}
            />
          )}
        </div>
      )}

      {/* --- Categories, Title, Meta --- */}
      <div className="w-full max-w-[48rem] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col gap-2">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="uppercase text-base font-semibold text-gray-500 ">
            {categories.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const titleToUse = category.title || 'Untitled category'
                const isLast = index === categories.length - 1
                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && ', '}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>
        )}

        <h1 className="text-2xl md:text-3xl lg:text-5xl -mt-1">{title}</h1>

        <div className="flex flex-col gap-3 text-gray-600 text-sm">
          {publishedAt && (
            <div>
              <span className="font-semibold">Published:</span>{" "}
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </div>
          )}

          {hasAuthors && (
            <div className="flex flex-wrap items-center gap-4">
              {populatedAuthors.map((author) => (
                <Link
                  key={author.id}
                  href={author.authorPage === 1 ? `/authors/${author.id}` : '#'}
                  className="flex items-center gap-2 hover:underline"
                >
                  {author.avatar && typeof author.avatar !== 'number' && (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={author.avatar.url ?? ''}
                        alt={author.name ?? 'Author avatar'}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  )}
                  <span className="font-semibold">{author.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
