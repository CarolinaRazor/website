import type { Block } from 'payload'

export const VerticalCategoryBlock: Block = {
  slug: 'verticalcategoryblock',
  labels: {
    singular: 'Vertical Category',
    plural: 'Vertical Categories',
  },
  fields: [
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'latestCount',
      label: 'Skip latest # of posts',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
