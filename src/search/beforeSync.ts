import {BeforeSync, DocToSync} from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, authors, title, meta, publishedAt } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    publishedAt,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
    authors: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  if (authors && Array.isArray(authors) && authors.length > 0) {
    const populatedAuthors: { id: string | number; name: string }[] = []
    for (const author of authors) {
      if (!author) {
        continue
      }

      if (typeof author === 'object') {
        populatedAuthors.push(author)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'users',
        id: author,
        disableErrors: true,
        depth: 0,
        select: { name: true },
        req,
      })

      if (doc !== null) {
        populatedAuthors.push(doc)
      } else {
        console.error(
          `Failed. Author not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.authors = populatedAuthors.map((each) => ({
      relationTo: 'users',
      authorID: String(each.id),
      name: each.name,
    }))
  }

  return modifiedDoc
}
