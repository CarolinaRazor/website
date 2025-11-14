import type {GlobalConfig} from 'payload'
import {FixedToolbarFeature, InlineToolbarFeature, lexicalEditor} from "@payloadcms/richtext-lexical";

export const BreakingHeader: GlobalConfig = {
  slug: 'breaking-header',
  label: {
    singular: 'Breaking News Header',
    plural: 'Breaking News Header',
  },
  fields: [
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Visible',
      defaultValue: false,
    },
    {
      name: 'text',
      label: 'Text',
      type: 'richText',
      editor: lexicalEditor({
        features: ({rootFeatures}) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
}
