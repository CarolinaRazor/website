import type {Metadata} from 'next'
import {RelatedPosts} from '@/blocks/RelatedPosts/Component'
import {PayloadRedirects} from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import {getPayload, type RequiredDataFromCollectionSlug} from 'payload'
import {draftMode} from 'next/headers'
import React, {cache} from 'react'
import type {Post} from '@/payload-types'

import {PostHero} from '@/heros/PostHero'
import {RenderBlocks} from '@/blocks/RenderBlocks'
import {generateMeta} from '@/utilities/generateMeta'
import PageClient from './page.client'
import {LivePreviewListener} from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({config: configPromise})
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({slug}) => {
    return {slug}
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({params: paramsPromise}: Args) {
  const {isEnabled: draft} = await draftMode()
  const {slug = ''} = await paramsPromise
  const url = '/posts/' + slug
  const post: RequiredDataFromCollectionSlug<'posts'> | null = await queryPostBySlug({slug})

  if (!post) return <PayloadRedirects url={url}/>

  const {layout, relatedPosts} = post

  return (
    <article className="pt-16 pb-16">
      <PageClient/>

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url}/>

      {draft && <LivePreviewListener/>}

      <PostHero post={post as Post}/>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-4xl px-6 mx-auto">
          <RenderBlocks blocks={layout}/>

          {relatedPosts && relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 w-full"
              docs={relatedPosts.filter((p) => typeof p === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({params: paramsPromise}: Args): Promise<Metadata> {
  const {slug = ''} = await paramsPromise
  const post = await queryPostBySlug({slug})
  return generateMeta({doc: post})
}

const queryPostBySlug = cache(async ({slug}: { slug: string }) => {
  const {isEnabled: draft} = await draftMode()
  const payload = await getPayload({config: configPromise})

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
