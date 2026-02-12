import type {CollectionAfterReadHook} from 'payload'
// import { User } from 'src/payload-types'

export const populateAuthors: CollectionAfterReadHook = async ({doc, req: {payload}}) => {
  if (!doc?.author_id) {
    return doc
  }

  try {
    //
    // const userId = typeof doc.user === 'object' ? doc.user.id : doc.user ?? 1

    const userDoc = await payload.findByID({
      id: doc.author_id,
      collection: 'users',
      depth: 1,
    })

    if (userDoc) {
      doc.populatedAuthors = [
        {
          id: userDoc.id,
          name: userDoc.name,
          avatar: userDoc.avatar || null,
          jobTitle: userDoc.jobTitle || null,
          links: doc.links || [],
        },
      ]
    }
  } catch (err) {
    console.error('populateAuthors error', err)
  }

  return doc
}
