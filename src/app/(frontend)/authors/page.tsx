import type {Metadata} from 'next/types'

import {CollectionArchive} from '@/components/CollectionArchive'
import {PageRange} from '@/components/PageRange'
import {Pagination} from '@/components/Pagination'
import configPromise from '@payload-config'
import {getPayload} from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function AuthorsPage() {
  const payload = await getPayload({config: configPromise})

  // Fetch all authors
  const authors = await payload.find({
    collection: 'authors',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      name: true,
      slug: true,
      avatar: true,
      bio: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      {/*<PageClient/>*/}

      {/*<div className="container mb-16">*/}
      {/*  <div className="prose dark:prose-invert max-w-none">*/}
      {/*    <h1>Authors</h1>*/}
      {/*    <p>Meet all of our amazing authors and contributors.</p>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="container mb-8">*/}
      {/*  <PageRange*/}
      {/*    collection="authors"*/}
      {/*    currentPage={authors.page}*/}
      {/*    limit={12}*/}
      {/*    totalDocs={authors.totalDocs}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<CollectionArchive*/}
      {/*  posts={authors.docs.map(author => ({*/}
      {/*    title: author.name,*/}
      {/*    slug: `/author/${author.slug}`,*/}
      {/*    meta: {*/}
      {/*      image: author.avatar,*/}
      {/*      description:*/}
      {/*        typeof author.bio === 'string'*/}
      {/*          ? author.bio*/}
      {/*          : 'View this author’s page',*/}
      {/*    },*/}
      {/*  }))}*/}
      {/*/>*/}

      {/*<div className="container">*/}
      {/*  {authors.totalPages > 1 && authors.page && (*/}
      {/*    <Pagination page={authors.page} totalPages={authors.totalPages}/>*/}
      {/*  )}*/}
      {/*</div>*/}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Authors | The Carolina Razor`,
    description: 'Meet all of our authors and contributors.',
  }
}
