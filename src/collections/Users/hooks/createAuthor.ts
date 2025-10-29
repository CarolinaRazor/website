import type {CollectionAfterChangeHook} from 'payload'

export const createAuthor: CollectionAfterChangeHook = async ({
                                                                doc,
                                                                operation,
                                                                req: {payload},
                                                              }) => {
  if (operation !== 'create') return doc

  try {
    const existingAuthors = await payload.find({
      collection: 'authors',
      where: {user: {equals: doc.id}},
      limit: 1,
    })
    console.log(doc)
    if (existingAuthors.totalDocs > 0) return doc

    await payload.create({
      collection: 'authors',
      data: {
        user: doc,
        name: doc.name,
        author_id: doc.id,
        meta: {
          title: `${doc.name} — The Carolina Razor`,
          description: doc.jobTitle || 'Author',
        },
      },
    })
  } catch (err) {
    payload.logger.error(`Failed to create author for user ${doc.id}: ${err}`)
  }

  return doc
}
