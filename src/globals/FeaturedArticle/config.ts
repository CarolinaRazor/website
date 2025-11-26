import type {GlobalConfig} from 'payload'
import sauthor from "@/collections/Users/access/sauthor";
import seditor from "@/collections/Users/access/seditor";

export const FeaturedArticle: GlobalConfig = {
  slug: 'featured-article',
  access: {
    update: sauthor || seditor
  },
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
