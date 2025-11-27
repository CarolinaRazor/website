import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {getPayload} from 'payload'
import configPromise from '@payload-config'
import React, {cache} from 'react'
import Image from 'next/image'
import {PayloadRedirects} from '@/components/PayloadRedirects'
import {LivePreviewListener} from '@/components/LivePreviewListener'
import {RenderBlocks} from '@/blocks/RenderBlocks'
import {generateMeta} from '@/utilities/generateMeta'
import PageClient from './page.client'

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

  return (
    <article className="pb-24">
      <PageClient/>
      <PayloadRedirects disableNotFound url={url}/>
      {draft && <LivePreviewListener/>}

      {/* Author Header */}
      {firstAuthor && (
        <header className="flex items-center gap-4 px-4 md:px-0 mb-12 max-w-4xl mx-auto">
          {firstAuthor.avatar && typeof firstAuthor.avatar !== 'number' && (
            <Image src={firstAuthor.avatar.sizes?.small?.url ?? ''}
                   alt={firstAuthor.name ?? 'Author avatar'}
                   width={firstAuthor.avatar.sizes?.small?.width ?? 1}
                   height={firstAuthor.avatar.sizes?.small?.width ?? 1}
                   className="w-24 h-24 object-cover rounded-md"/>
          )}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold">{firstAuthor.name}</h1>
            {firstAuthor.jobTitle && (
              <p className="text-lg text-gray-400">{firstAuthor.jobTitle}</p>
            )}
          </div>
        </header>
      )}

      {/* Layout blocks */}
      <div className="max-w-4xl mx-auto px-4 md:px-0">
        <RenderBlocks blocks={layout || []} constraint="page"/>
      </div>
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
