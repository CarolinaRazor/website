import type {Block} from 'payload'

export const NewsletterSignupBlock: Block = {
  slug: 'newsletterSignup',
  labels: {
    singular: 'Newsletter Signup Block',
    plural: 'Newsletter Signup Blocks',
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
}
