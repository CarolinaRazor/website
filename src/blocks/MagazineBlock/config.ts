import type { Block } from 'payload'

export const MagazineBlock: Block = {
  slug: 'magazine',
  interfaceName: 'MagazineBlock',
  labels: {
    singular: 'Magazine',
    plural: 'Magazines',
  },
  fields: [
    {
      name: 'featuredArticle',
      label: 'Featured Article',
      type: 'relationship',
      relationTo: 'posts',
      required: false,
      admin: {
        description: 'Optionally override the featured article.',
      },
      filterOptions: { _status: { equals: 'published' } },
    },
  ],
}
