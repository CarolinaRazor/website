import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {getPayload} from 'payload'
import configPromise from '@payload-config'
import React, {cache} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {PayloadRedirects} from '@/components/PayloadRedirects'
import {LivePreviewListener} from '@/components/LivePreviewListener'
import {RenderBlocks} from '@/blocks/RenderBlocks'
import {generateMeta} from '@/utilities/generateMeta'
import PageClient from './page.client'
import {FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube} from 'react-icons/fa'
import {MdEmail} from 'react-icons/md'
import {HiGlobeAlt} from 'react-icons/hi'
import {Card} from '@/components/Card'

const iconMap = {
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  mail: MdEmail,
  globe: HiGlobeAlt,
  instagram: FaInstagram,
  facebook: FaFacebook,
  youtube: FaYoutube,
}

export async function generateStaticParams() {
  const payload = await getPayload({config: configPromise})
  const authors = await payload.find({
    collection: 'authors',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {slug: true},
  })

  return authors.docs.map(({slug}) => ({slug}))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function AuthorPage({params: paramsPromise}: Args) {
  const {isEnabled: draft} = await draftMode()
  const {slug = ''} = await paramsPromise
  const url = '/authors/' + slug

  const author = await queryAuthorBySlug({slug})
  if (!author) return <PayloadRedirects url={url}/>

  const {layout, populatedAuthors} = author
  const firstAuthor = populatedAuthors?.[0]
  // console.log(populatedAuthors)

  // Fetch latest 6 posts by this author
  const payload = await getPayload({config: configPromise})
  const authorPosts = firstAuthor?.id ? await payload.find({
    collection: 'posts',
    where: {
      authors: {
        contains: firstAuthor.id,
      },
    },
    limit: 6,
    sort: '-publishedAt',
    depth: 1,
  }) : null

  return (
    <article className="pb-24 -mt-3">
      <PageClient/>
      <PayloadRedirects disableNotFound url={url}/>
      {draft && <LivePreviewListener/>}

      {/* Author Header with full-width background */}
      {firstAuthor && (
        <header className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 mb-16">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* Avatar */}
              {firstAuthor.avatar && typeof firstAuthor.avatar !== 'number' && (
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                    <Image
                      src={firstAuthor.avatar.sizes?.small?.url ?? ''}
                      alt={firstAuthor.name ?? 'Author avatar'}
                      width={firstAuthor.avatar.sizes?.small?.width ?? 1}
                      height={firstAuthor.avatar.sizes?.small?.height ?? 1}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {firstAuthor.name}
                </h1>
                {firstAuthor.jobTitle && (
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4">
                    {firstAuthor.jobTitle}
                  </p>
                )}

                {/* Social Links */}
                {firstAuthor.links && firstAuthor.links.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                    {firstAuthor.links.map((link: any, index: number) => {
                      const Icon = iconMap[link.icon as keyof typeof iconMap]
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                          title={link.label}
                        >
                          {Icon && <Icon size={18} />}
                          <span className="text-sm font-medium">{link.label}</span>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Layout blocks */}
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <RenderBlocks blocks={layout || []} constraint="page"/>
      </div>

      {/* Latest Articles Section */}
      {authorPosts && authorPosts.docs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorPosts.docs.map((post) => (
              <Card
                key={post.id}
                doc={post}
                relationTo="posts"
                showCategories
              />
            ))}
          </div>
          {firstAuthor?.id && (
            <div className="flex justify-center mt-10">
              <Link
                href={`/search?author=${firstAuthor.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                View All Articles
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}

    </article>
  )
}

export async function generateMetadata({params: paramsPromise}: Args): Promise<Metadata> {
  const {slug = ''} = await paramsPromise
  const author = await queryAuthorBySlug({slug})
  return generateMeta({doc: author})
}

const queryAuthorBySlug = cache(async ({slug}: { slug: string }) => {
  const {isEnabled: draft} = await draftMode()
  const payload = await getPayload({config: configPromise})

  const result = await payload.find({
    collection: 'authors',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {slug: {equals: slug}},
  })

  return result.docs?.[0] || null
})
