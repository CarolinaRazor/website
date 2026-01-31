import type {CollectionConfig} from 'payload'

export const Newsletters: CollectionConfig = {
  slug: 'newsletters',
  admin: {
    group: 'Newsletters',
    useAsTitle: 'generated'
  },
  fields: [
    {
      name: 'generated',
      type: 'date',
      timezone: true,
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        }
      }
    },
    {
      name: 'subject',
      type: 'text',
      required: false,
    },
    {
      name: 'introduction',
      type: 'text',
      required: false,
    },
    {
      name: 'posts',
      type: 'array',
      fields: [
        {
          name: 'postText',
          label: 'Post Text',
          type: 'text',
          required: false,
        },
        {
          name: 'post',
          type: 'relationship',
          relationTo: 'posts',
          required: true,
        },
      ],
    },
  ],
}
