import type {Block} from 'payload'
import {updateFeaturedArticleGlobal} from "@/blocks/MagazineBlock/hooks/updateFeaturedArticleGlobal";

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
      hooks: {
        afterChange: [updateFeaturedArticleGlobal],
      },
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      label: 'Full Width (ignore layout constraints)',
      admin: {
        description: 'Enable to let this block span the full page width.',
        hidden: true,
      },
      defaultValue: true,
    },
  ],
}
