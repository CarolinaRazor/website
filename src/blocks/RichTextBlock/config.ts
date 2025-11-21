import type {Block} from 'payload'

import {BlocksFeature, lexicalEditor,} from '@payloadcms/richtext-lexical'

import {Banner} from '@/blocks/Banner/config'
import {Code} from '@/blocks/Code/config'
import {MediaBlock} from '@/blocks/MediaBlock/config'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({rootFeatures}) => {
          return [
            ...rootFeatures,
            BlocksFeature({blocks: [Banner, Code, MediaBlock]}),
          ]
        },
      }),
      label: false,
    },
  ],
}
