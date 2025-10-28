import type {CollectionAfterChangeHook, CollectionAfterDeleteHook} from 'payload'

import {revalidatePath, revalidateTag} from 'next/cache'

import type {Post} from '@/payload-types'

export const revalidateAuthor: CollectionAfterChangeHook<Post> = ({
                                                                    doc,
                                                                    previousDoc,
                                                                    req: {payload, context},
                                                                  }) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/authors/${doc.slug}`

      payload.logger.info(`Revalidating author at path: ${path}`)

      revalidatePath(path)
      revalidateTag('authors-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/authors/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('authors-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({doc, req: {context}}) => {
  if (!context.disableRevalidate) {
    const path = `/authors/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('authors-sitemap')
  }

  return doc
}
