import type {CollectionAfterChangeHook, CollectionAfterDeleteHook} from 'payload'

import {revalidatePath, revalidateTag} from 'next/cache'

import type {Post} from '../../../payload-types'

const revalidateAuthors = (authors: Post['authors']) => {
  for (const author of authors ?? []) {
    const authorId = typeof author === 'object' ? author?.id : author

    if (authorId) {
      revalidatePath(`/authors/${authorId}`)
    }
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
                                                                  doc,
                                                                  previousDoc,
                                                                  req: {payload, context},
                                                                }) => {
    if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap','max')

      payload.logger.info(`Revalidating main page for changed post.`)
      revalidatePath('/')
      revalidateTag('pages-sitemap','max')

      revalidateAuthors([...(doc.authors ?? []), ...(previousDoc.authors ?? [])])
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap','max')

      payload.logger.info(`Revalidating main page for changed post.`)
      revalidatePath('/')
      revalidateTag('pages-sitemap','max')

      revalidateAuthors([...(doc.authors ?? []), ...(previousDoc.authors ?? [])])
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({doc, req: {context}}) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap','max')

    revalidatePath('/')
    revalidateTag('pages-sitemap','max')

    revalidateAuthors(doc?.authors)
  }

  return doc
}
