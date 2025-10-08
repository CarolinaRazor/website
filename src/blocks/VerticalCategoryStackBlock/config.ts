import type { Block } from 'payload'

export const VerticalCategoryStackBlock: Block = {
  slug: 'verticalcategorystackblock',
  labels: {
    singular: 'Vertical Category Stack',
    plural: 'Vertical Category Stacks',
  },
  fields: [
    {
      name: 'categories',
      label: 'Categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
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
