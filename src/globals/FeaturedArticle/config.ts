// globals/FeaturedArticle.ts
import type { GlobalConfig } from 'payload'

export const FeaturedArticle: GlobalConfig = {
  slug: 'featured-article',
  label: {
    singular: 'Featured Article',
    plural: 'Featured Article',
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: false,
      admin: {
        description: 'Select the post to feature globally.',
      },
      filterOptions: { _status: { equals: 'published' } },
    },
  ],
}
