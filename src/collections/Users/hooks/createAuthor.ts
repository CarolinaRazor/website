import type {CollectionAfterOperationHook} from 'payload'
import type {User} from '@/payload-types'

export const createAuthor: CollectionAfterOperationHook = async ({
                                                                   operation,
                                                                   result,
                                                                   req: {payload},
                                                                 }) => {
  if (operation !== 'create' || !result) return result

  const user = result as User

  setTimeout(async () => {
    try {
      const existingAuthors = await payload.find({
        collection: 'authors',
        where: {author_id: {equals: user.id}},
        limit: 1,
      })

      if (existingAuthors.totalDocs > 0) return

      const authorPage = await payload.create({
        collection: 'authors',
        data: {
          // user: user.id,
          slug: String(user.id) ? String(user.id) : "1",
          name: user.name ? user.name : "",
          author_id: String(user.id) ? String(user.id) : "1",
          meta: {
            title: `${user.name} | The LiberatorCH`,
            description: `${user.jobTitle || 'Author'}`,
          },
        },
      })

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          page: authorPage.id,
        },
      })

    } catch (err) {
      payload.logger.error(`Failed to create author for user ${user.id}: ${err}`)
    }
  }, 0)

  return result
}
