import type { FieldHook } from 'payload'

export const updateFeaturedArticleGlobal: FieldHook = async ({ value, req }) => {
  const payload = req.payload

  if (!value) {
    await payload.updateGlobal({
      slug: 'featured-article',
      data: {
        post: null,
      },
    })
    return value
  }

  await payload.updateGlobal({
    slug: 'featured-article',
    data: {
      post: value,
    },
  })

  return value
}
